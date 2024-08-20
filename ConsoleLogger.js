// ==UserScript==
// @name         Console Logger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Logs the current date and time to the console every 5 seconds
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to log the current date and time to the console
    function logTime() {
        const currentTime = new Date().toLocaleString();
        console.log(`Current time: ${currentTime}`);
    }

    // Set an interval to run the logTime function every 5 seconds
    setInterval(logTime, 5000);

})();