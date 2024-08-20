// ==UserScript==
// @name         抢发货台1
// @namespace    http://tampermonkey.net/
// @version      2024-08-16
// @description  try to take over the world!
// @author       You
// @match        https://seller.kuajingmaihuo.com/main/order-manage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kuajingmaihuo.com
// @grant        none
// ==/UserScript==

async function waitForElements(xpath, timeout = 10000) {
    const start = new Date().getTime();
    while (new Date().getTime() - start < timeout) {
        const elements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (elements.snapshotLength > 0) {
            return elements;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`Elements not found for XPath: ${xpath}`);
}

async function clickElement(element) {
    element.click();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
}

async function main() {
    console.log('进入页面,10s后开始执行');
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds

    let lenBoxSelects = 2;

    while (lenBoxSelects > 1) {
        const boxSelectsSnapshot = await waitForElements("//input[@class='CBX_input_5-111-0']");
        lenBoxSelects = boxSelectsSnapshot.snapshotLength;

        if (lenBoxSelects >= 2) {
            try {
                await clickElement(boxSelectsSnapshot.snapshotItem(0));

                const elementBatchAddToDesk = await waitForElements("//span[text()='批量加入发货台']/..");
                const statusElementBatchAddToDesk = elementBatchAddToDesk.snapshotItem(0).className;

                if (statusElementBatchAddToDesk.includes('disabled')) {
                    console.log('等待5分钟再重头执行');
                    await new Promise(resolve => setTimeout(resolve, 1 * 60 * 1000)); // Wait for 5 minutes
                    lenBoxSelects = 2;
                    const requre = await waitForElements("//button/span[text()='查询']");
                    await clickElement(requre.snapshotItem(0));
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                    lenBoxSelects = 2;
                    continue;
                } else {
                    await clickElement(elementBatchAddToDesk.snapshotItem(0));
                }

                const elementSubmit = await waitForElements("//button/span[text()='确认']");
                await clickElement(elementSubmit.snapshotItem(0));

                const elementIKnow = await waitForElements("//button/span[text()='我知道了']");
                await clickElement(elementIKnow.snapshotItem(0));

            } catch (error) {
                console.error('发生错误，继续下一个循环:', error);
                const requre = await waitForElements("//button/span[text()='查询']");
                await clickElement(requre.snapshotItem(0));
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                lenBoxSelects = 2;
                continue; // 直接继续下一个循环
            }
        } else {
            console.log(`当前元素个数${lenBoxSelects}, x分钟后再检测`);
            for (let t0 = 1; t0 <= 10; t0++) {
                console.log(`等待第${t0}分钟`);
                await new Promise(resolve => setTimeout(resolve, 60 * 1000)); // Wait for 1 minute
            }
            const requre = await waitForElements("//button/span[text()='查询']");
            await clickElement(requre.snapshotItem(0));
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
            lenBoxSelects = 2;
        }
    }
}

main();
