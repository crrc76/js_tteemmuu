// ==UserScript==
// @name         快速跳过检测
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在页面上加一个快速跳过的按钮，点击后程序每 1 秒检测一次页面的元素，如果发现指定 XPath 元素集合里的任一元素，等待 0.5 秒后点击检测到的元素。直到未发现元素集合里的任何元素后停止。
// @match        https://seller.kuajingmaihuo.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// ==/UserScript==

(function () {
    // 定义要检测的 XPath 表达式集合
    const xpathExpressions = [
        "//button/span[contains(text(),'我知道了')]",
        "//div[contains(text(),'进入')]",
        "//button/span[contains(text(),'下一条')]",
        "//button/span[contains(text(),'下一步')]",
        "//button/span[contains(text(),'我已阅读')]",
        "//button/span[contains(text(),'发货完成')]",
        "//button/span[contains(text(),'完成')]",
        "//button/span[contains(text(),'稍后充值')]",
        "//button/span[contains(text(),'稍后再说')]",
        "//div[@class='MDL_iconWrapper_5-111-0']",
        "//div[@class='open-account-modal_close__I3_qO']",
        "//div[@class='agent-seller-send-info-modal_close__2t-RN']",
        // 添加其他 XPath 表达式
    ];

    window.addEventListener('load', function () {
        console.log('页面加载完成。');
        setTimeout(() => {
            const intervalId = setInterval(() => {
                let foundElement = null;
                for (const expression of xpathExpressions) {
                    const elements = document.evaluate(expression, document, null, XPathResult.ANY_TYPE, null);
                    const element = elements.iterateNext();
                    if (element) {
                        foundElement = element;
                        break;
                    }
                }
                if (foundElement) {
                    console.log('找到可点击元素，准备点击。');
                    setTimeout(() => {
                        foundElement.click();
                    }, 500);
                } else {
                    console.log('未找到可点击元素，停止检测。');
                    clearInterval(intervalId);
                }
            }, 1000);
        }, 3000);
    });
})();