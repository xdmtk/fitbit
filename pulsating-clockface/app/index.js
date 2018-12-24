import document from "document"
import clock from "clock"

let bgImage = document.getElementById("background-frame1");
let frameNumber = 0;
let frameString = "";
/*
setInterval(function() {
    if (frameNumber < 31) {
        frameString = "pulse/p-" + frameNumber + ".jpg";
        bgImage.image = frameString;
        frameNumber += 1;
    }
    else {
        frameNumber = 0;
        frameString = "pulse/p-" + frameNumber + ".jpg";
        frameNumber += 1;
    }
}, 50);
*/

setInterval(function() {
    var front = document.getElementById("background-frame"+(frameNumber+1).toString());
    if (frameNumber === 0) {
        var back = document.getElementById("background-frame32");
    }
    else {
        var back = document.getElementById("background-frame"+frameNumber.toString());
    }
    front.style.opacity = 1;
    back.style.opacity = 0;
    frameNumber += 1;
    if (frameNumber === 32) {
        frameNumber = 0;
    }
}, 50);
