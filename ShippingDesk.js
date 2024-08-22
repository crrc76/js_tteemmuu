// ==UserScript==
// @name         创建发货单并发送消息
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automate task for clicking elements, processing delivery creation, and sending a message when conditions are met
// @author       Your Name
// @match        https://seller.kuajingmaihuo.com/main/order-manager/shipping-desk
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendPostRequest() {
    const url = "https://open.feishu.cn/open-apis/bot/v2/hook/8dc76656-98bf-4d02-a6e3-8b68eb2cd233";
    const data = {
        "msg_type": "text",
        "content": {
            "text": "抢到发货台了，快去创建发货单。"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error sending POST request:', error);
    }
}

async function main() {
    console.log('进入页面,10s后开始执行');
    await sleep(10000); // Wait for 10 seconds

    let lenBoxSelects = 2;

    while (lenBoxSelects > 1) {
        let boxSelectsSnapshot;
        try {
            boxSelectsSnapshot = await waitForElements("//input[@class='CBX_input_5-111-0']");
            lenBoxSelects = boxSelectsSnapshot.snapshotLength;
              // Send the POST request
            await sendPostRequest();
            console.log(`lenBoxSelects: ${lenBoxSelects}`);
        } catch (error) {
            console.log("没有发现//input[@class='CBX_input_5-111-0'],等待十秒后再试");
            await sleep(10000);
            const requre = await waitForElements("//button/span[text()='查询']");
            await clickElement(requre.snapshotItem(0));
            continue;
        }

        if (lenBoxSelects >= 2) {

            for (let i = 1; i < lenBoxSelects; i++) {
                try {
                    await clickElement(boxSelectsSnapshot.snapshotItem(i));
                    console.log("点击完//input[@class='CBX_input_5-111-0']");
                    await sleep(2000);

                    const elementCreateDeliveryNote = await waitForElements("//button/span[text()='创建发货单']/..");
                    await sleep(2000);
                    const statusElementCreateDeliveryNote = elementCreateDeliveryNote.snapshotItem(0).className;

                    if (statusElementCreateDeliveryNote.includes('disabled')) {
                        await sleep(1000);
                        await clickElement(boxSelectsSnapshot.snapshotItem(i)); // Unselect the checkbox
                        await clickElement(elementCreateDeliveryNote.snapshotItem(0)); // Try clicking again
                    } else {
                        await clickElement(elementCreateDeliveryNote.snapshotItem(0));
                    }

                    // Handling pop-up "我知道了"
                    const elementIKnow = await waitForElements("//button/span[text()='我知道了']");
                    await clickElement(elementIKnow.snapshotItem(0));

                    // Confirm shipping quantity
                    const elementSubmitNum = await waitForElements("//button/span[text()='发货数一致，继续创建']");
                    await clickElement(elementSubmitNum.snapshotItem(0));

                    // Select shipping address
                    await sleep(1000); // Wait for 1 second
                    const elementInputAddress = document.querySelector("input.IPT_input_5-111-0");
                    const addressName = '滨江总部1号';
                    elementInputAddress.value = addressName;
                    const event = new Event('input', { bubbles: true });
                    elementInputAddress.dispatchEvent(event);
                    const elementSelectAddress = await waitForElements(`//ul/li[text()='${addressName}']`);
                    await clickElement(elementSelectAddress.snapshotItem(0));

                    // Confirm creation
                    const elementSubmit = await waitForElements("//button/span[text()='确认创建']");
                    await clickElement(elementSubmit.snapshotItem(0));

                    // Final confirmation
                    const elementSubmit2 = await waitForElements("//button/span[text()='继续创建，已确认一致']");
                    await clickElement(elementSubmit2.snapshotItem(0));

                } catch (error) {
                    console.error('发生错误，继续下一个循环:', error);
                    const requre = await waitForElements("//button/span[text()='查询']");
                    await clickElement(requre.snapshotItem(0));
                    await sleep(10000); // Wait for 10 seconds
                    lenBoxSelects = 2;
                    continue; // Continue to the next iteration
                }
            }
        } else {
            console.log(`当前元素个数${lenBoxSelects}, 10s后再检测`);
            await sleep(10000);
            const requre = await waitForElements("//button/span[text()='查询']");
            await clickElement(requre.snapshotItem(0));
            await sleep(1000); // Wait for 1 second
            lenBoxSelects = 2;
        }
    }
}

main();
