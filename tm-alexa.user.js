// ==UserScript==
// @name         Alexa Screen Modifier webVersion
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  New Update. Let's see what happens
// @require https://code.jquery.com/jquery-1.12.4.min.js
// @require https://code.jquery.com/ui/1.8.21/jquery-ui.min.js
// @require https://raw.githubusercontent.com/markwcraddock/alexa-test/master/touch-punch.js
// @author       mark craddock
// @match        http://alexa.amazon.co.uk/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    var watchedObjectList = [];
    
    function watch(watchObject) {
        watchedObjectList.push(watchObject);
        if (typeof window.watchTimer == "undefined") {
            window.watchTimer = setInterval(function() {
                watchedObjectList.forEach(function(watchedItem) {
                if ($(watchedItem.element).length) {
                    var currentValue = $(watchedItem.element).html();
                    if (watchedItem.oneTime === true) {
                        removeWatch(watchedItem);
                                 }
                    if ((watchedItem.onUpdateOnly ===true && watchedItem.lastValue !== currentValue) || watchedItem.onUpdateOnly === false) {
                        watchedItem.lastValue = currentValue;
                        watchedItem.action(currentValue);
                        }
                }
             });
        }, 1000);
    }
    }


var spokenCommandTracker = {element:'.playback-audio-text:first', oneTime: false, onUpdateOnly: true, action: function(value){console.log('performing action');spokenAction(value);}};    
var mainTextTracker = {element:'.main-text ', oneTime: true, onUpdateOnly: false, action: switchToMain};
var musicPlayTracker = {element: '#d-play-pause.play', oneTime: true, onUpdateOnly: false, action: switchToMain};
var endMusicTracker = {element: '.d-overlay-text-wrapper', oneTime: true, onUpdateOnly: false, action: switchToMain}; 
var menuButton = {element: '#navMenuIcon', oneTime: true, onUpdateOnly:false, action: makeDraggable};
    
watch(spokenCommandTracker);
watch(musicPlayTracker);
watch(endMusicTracker);
watch(menuButton);

function spokenAction(audioCommand){
    console.log('command is:' + audioCommand);
    var timerCommand = audioCommand.search("timer");
    var timerCommandAlt = audioCommand.search("alarm");
    if ((timerCommand !== -1) || (timerCommandAlt !== -1)) switchToTimer();
}


function switchToTimer() {
    $('#iTimersAndAlarms').click();
    $('.time-text').css({"font-size":"5rem"});
    watch(mainTextTracker); 
}
    
function switchToMain() {
    if (window.location.href !== "http://alexa.amazon.co.uk/spa/index.html#cards") window.location = "http://alexa.amazon.co.uk/spa/index.html#cards";
}
    
function removeWatch(item) {
    console.log('removing item');
    var index = watchedObjectList.indexOf(item);
    if (index > -1) {
        watchedObjectList.splice(index, 1);
        
    }
}
    
function makeDraggable() {
  $('#navMenuIcon').draggable();
}

})();
