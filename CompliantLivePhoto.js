// ==UserScript==
// @name         Automate Upload Task
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automate the task of uploading images based on tags in the browser
// @author       Your Name
// @match        *://*/*  // Adjust this to match the specific site where you want to run the script
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function checkTags(tags) {
        let tagsSorted = tags.sort();
        let tagPath = '';
        if (JSON.stringify(tagsSorted) === JSON.stringify(['triman标签-包装','GPSR法规标签','塑料防窒息警示语'])) {
            tagPath = '/Users/mac/Documents/电商/外包装/1.jpg';
        } else if (JSON.stringify(tagsSorted) === JSON.stringify(['加拿大产品通用名称','可与食品接触标识','美国儿童产品追踪标签-包装上','triman标签-包装','GPSR法规标签','制造商名称及地址','塑料防窒息警示语'])) {
            tagPath = '/Users/mac/Documents/电商/外包装/2.png';
        } else if (JSON.stringify(tagsSorted) === JSON.stringify(['可与食品接触标识', 'triman标签-包装', 'GPSR法规标签', '制造商名称及地址', '塑料防窒息警示语'])) {
            tagPath = '/Users/mac/Documents/电商/外包装/2.jpg';
        } else if (JSON.stringify(tagsSorted) === JSON.stringify(['triman标签-包装', 'GPSR法规标签', 'triman标签-纺织', '塑料防窒息警示语'])) {
            tagPath = '/Users/mac/Documents/电商/外包装/3.png';
        } else {
            tagPath = ''; // Add more conditions if needed
        }
        return tagPath;
    }

    async function main() {
        console.log('进入页面,10s后开始执行');
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds
        let lenUploads = 1;
        while (lenUploads >= 1) {
            try {
                await sleep(10000);
                let todoUploadFilter = document.evaluate("(//div[@class='rocket-col'])[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                todoUploadFilter.click();

                await sleep(5000);

                let uploads = Array.from(document.evaluate("//button/span[text()='上传']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
                lenUploads = uploads.length;

                if (lenUploads === 0) {
                    console.log('no find button upload,程序结束');
                    break;
                }

                for (let upload of uploads) {
                    await sleep(1000);
                    upload.click();

                    let spu = document.evaluate("//div[@id='spuId']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
                    let tagsElements = document.evaluate("//ul[@class='rocket-list-items']//div[@class='rocket-col rocket-col-12']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                    let tagsList = [];
                    for (let i = 0; i < tagsElements.snapshotLength; i++) {
                        let tagText = tagsElements.snapshotItem(i).textContent.replace('示例', '');
                        if (!tagText.includes("待传图")) {
                            tagsList.push(tagText);
                        }
                    }
                    console.log(`spu: ${spu}, tags: ${tagsList}`);

                    let tagPath = checkTags(tagsList);

                    // 外包装
                    try {
                        await sleep(1000);
                        let packaging = document.querySelector("(//input[@type='file'])[1]");
                        packaging.style.display = 'block'; // Make the input visible
                        packaging.value = tagPath; // Assign the path

                        // Simulate the change event to trigger the upload process
                        let event = new Event('change', { bubbles: true });
                        packaging.dispatchEvent(event);

                        await sleep(10000);
                    } catch (error) {
                        console.error(1, error);
                    }

                    let uploadAndRecognize = document.evaluate("//button/span[contains(text(),'上传并识别')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    uploadAndRecognize.click();

                    await sleep(30000);
                }
            } catch (error) {
                console.error(error);
                window.location.reload();
                console.log('refresh driver');
                await sleep(5000);
                continue;
            }
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Start the script
    main();

})();
