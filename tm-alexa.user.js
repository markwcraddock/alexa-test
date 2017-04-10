// ==UserScript==
// @name         Alexa Screen Modifier webVersion
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Recipe updated
// @require https://code.jquery.com/jquery-1.12.4.min.js
// @require https://code.jquery.com/ui/1.8.21/jquery-ui.min.js
// @require https://raw.githubusercontent.com/markwcraddock/alexa-test/master/touch-punch.js
// @author       mark craddock
// @match        http://alexa.amazon.co.uk/*
// @match        https://awesome-table.com/*
// @match        https://alexa.amazon.co.uk/*
// @match        http://awesome-table.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var alexaCss = assignCss();
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
var menuButtonStyles = {element: 'head', oneTime: true, onUpdateOnly:false, action: addStyleSheets};
var menuButtonMain = {element: 'link', oneTime: true, onUpdateOnly:false, action: addMenuButtons};
    
watch(spokenCommandTracker);
watch(musicPlayTracker);
watch(endMusicTracker);
watch(menuButtonStyles);
watch(menuButtonMain);

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
    

    
function addStyleSheets() {
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css';
document.getElementsByTagName("head")[0].appendChild(link);

var css = alexaCss,
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

head.appendChild(style);
}

function addMenuButtons(){
$('body').append('<div class="menu-float-alex"><a class="float" id="menu-share" style="{color: white}"><i class="fa fa-share my-float" ' +
                 'style="{color: white}"></i></a><ul><li><a style="{color: white}"><i class="fa fa-home my-float" style="{color: white}"></i></a></li>' + 
                 '<li><a style="{color: white}"><i class="fa fa-cutlery my-float"></i></a></li><li><a><i class="fa fa-chevron-left my-float"></i></a></li><li><a><i class="fa fa-bars my-float"></i></a></li></ul></div>');
$('.fa').click(function() {
  var myClass = $(this).attr("class");
  if (myClass.search('cutlery') !== -1) {
      window.location.href = "#help/thingstotry";
      var recipeMaker = {element: '.dee-help-page', oneTime: true, onUpdateOnly:false, action: createRecipePage};
      watch(recipeMaker);
  }
  if (myClass.search('chevron') !== -1) {window.history.back();}
  if (myClass.search('home') !== -1) {window.location.replace("http://alexa.amazon.co.uk/spa/index.html#cards");}
  if (myClass.search('bars') !== -1) {
     if( $("a#menu-share + ul").css('visibility') == 'visible') {
         alert('redirecting to new homepage');
     }
  }
});
  }

    
function assignCss() {
    return "a#menu-share:active, a#menu-share:focus, a#menu-share:hover{color: #FFF !important; text-decoration: none;} .label-container{position:fixed;bottom:48px;right:105px;display:table;visibility: hidden;}" +
        ".label-text{color:#FFF;background:c;display:table-cell;vertical-align:middle;padding:10px;border-radius:3px;}.label-arrow{display:table-cell;vertical-align:middle;color:#333;opacity:0.5;}" +
        ".float{position:fixed;width:60px;height:60px;bottom:90px;right:40px;background-color:cadetblue;color:#FFF !important;" +
        "border-radius:50px;text-align:center;box-shadow: 2px 2px 3px #999;z-index:1000;animation: bot-to-top 2s ease-out;}ul{position:fixed;right:40px;padding-bottom:20px;bottom:125px;z-index:100;}" +
        "ul li{list-style:none;margin-bottom:10px;}ul li a{background-color:cadetblue;color:#FFF !important;border-radius:50px;text-align:center;box-shadow: 2px 2px 3px #999;" +
        "width:60px;height:60px;display:block;}ul:hover{visibility:visible!important;opacity:1!important;}.my-float{font-size:24px;margin-top:18px;}" +
        "a#menu-share + ul{visibility: hidden;}a#menu-share:hover + ul{visibility: visible;animation: scale-in 0.5s;}a#menu-share i{animation: rotate-in 0.5s;}" +
        "a#menu-share:hover > i{animation: rotate-out 0.5s;}@keyframes bot-to-top {0% {bottom:-40px}50% {bottom:40px}}@keyframes scale-in {from {transform: scale(0);opacity: 0;}" +
        "to {transform: scale(1);opacity: 1;}}@keyframes rotate-in {from {transform: rotate(0deg);}to {transform: rotate(360deg);}}@keyframes rotate-out {from {transform: rotate(360deg);}to {transform: rotate(0deg);}}" +
        "#wrapper ul{width:760px; margin-bottom:20px; overflow:hidden; border-top:1px solid #ccc;} #wrapper li{ line-height:1.5em; border-bottom:1px solid #ccc; float:left; display:inline;}" +
        " #double li{ width:50%;} #triple li{ width:33.333%; } #quad li{ width:25%; } #six li{ width:16.666%; }";
}
    

function createRecipePage() {
    if (window.location.href !== "https://awesome-table.com/-KhIDw5oKK9XyYykaElK/view") window.location = "https://awesome-table.com/-KhIDw5oKK9XyYykaElK/view";
}
    
    https://awesome-table.com/-KhIDw5oKK9XyYykaElK/view

})();
