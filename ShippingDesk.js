// ==UserScript==
// @name         创建发货单
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automate task for clicking elements and processing delivery creation
// @author       Your Name
// @match        https://seller.kuajingmaihuo.com/main/order-manager/shipping-desk
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    async function main() {
        console.log('进入页面,10s后开始执行');
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds

        let lenBoxSelects = 2;
        while (lenBoxSelects > 1) {
            try {
                let boxSelects = document.querySelectorAll("input.CBX_input_5-111-0");
                lenBoxSelects = boxSelects.length;
            } catch (error) {
                console.log('列表为空，未发现待执行任务');
                let t0 = 1;
                while (t0 <= 10) {
                    console.log(`等待第${t0}分钟`);
                    await sleep(60000); // wait for 1 minute
                    t0 += 1;
                }
                let requre = document.evaluate("//button/span[text()='查询']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                requre.click();
                await sleep(2000); // wait for 2 seconds
                lenBoxSelects = 2;
                continue;
            }

            if (lenBoxSelects >= 2) {
                for (let i = 1; i < lenBoxSelects; i++) {
                    try {
                        // 依次勾选第一条复选框
                        boxSelects[i].click();
                        await sleep(1000); // wait for 1 second

                        // 创建发货单
                        let elementCreateDeliveryNote = document.evaluate("//button/span[text()='创建发货单']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        let statusElementCreateDeliveryNote = elementCreateDeliveryNote.className;
                        if (statusElementCreateDeliveryNote.includes('disabled')) {
                            await sleep(1000); // wait for 1 second
                            boxSelects[i].click();
                            elementCreateDeliveryNote.click();
                        } else {
                            elementCreateDeliveryNote.click();
                        }

                        // 异常处理，n个SKC存在近期被拒收问题，请仔细检查实物
                        try {
                            let element0 = document.evaluate("//button/span[text()='我知道了']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            element0.click();
                        } catch (error) {
                            console.log(2);
                        }

                        // 确认发货数量
                        await sleep(1000); // wait for 1 second
                        let elementSubmitNum = document.evaluate("//button/span[text()='发货数一致，继续创建']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        elementSubmitNum.click();

                        // 选择发货地址
                        await sleep(1000); // wait for 1 second
                        let elementInputAddress = document.querySelector("input.IPT_input_5-111-0");
                        let addressName = '滨江总部1号';
                        elementInputAddress.value = addressName;
                        let event = new Event('input', { bubbles: true });
                        elementInputAddress.dispatchEvent(event);
                        await sleep(1000); // wait for 1 second
                        let elementSelectAddress = document.evaluate(`//ul/li[text()='${addressName}']`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        elementSelectAddress.click();

                        // 确认创建
                        await sleep(1000); // wait for 1 second
                        let elementSubmit = document.evaluate("//button/span[text()='确认创建']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        elementSubmit.click();

                        // 二次确认创建
                        await sleep(1000); // wait for 1 second
                        let elementSubmit2 = document.evaluate("//button/span[text()='继续创建，已确认一致']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        elementSubmit2.click();

                    } catch (error) {
                        console.error(error);
                        continue;
                    }
                }
            } else {
                console.log(`当前元素个数${lenBoxSelects},x分钟后再检测`);
                let t0 = 1;
                while (t0 <= 10) {
                    console.log(`等待第${t0}分钟`);
                    await sleep(60000); // wait for 1 minute
                    t0 += 1;
                }
                let requre = document.evaluate("//button/span[text()='查询']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                requre.click();
                await sleep(2000); // wait for 2 seconds
                lenBoxSelects = 2;
            }
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Start the script
    main();

})();
