const canvasedCursors = {}

function blinkCursors() {
    $.each(canvasedCursors, function(k, v) {
        let theCanvasCursor = canvasedCursors[k]
        blinkCursor(theCanvasCursor);
    });
}

function blinkCursor(canvasCursor) {
    if (canvasCursor) {
        let context = canvasCursor.the.getContext("2d");
        if (canvasCursor.toggle) {
            context.fillStyle = canvasCursor.the.dataset.color;
            context.fillRect(0, 0, canvasCursor.the.width, canvasCursor.the.height);
            canvasCursor.toggle = false;
        } else {
            context.clearRect(0, 0, canvasCursor.the.width, canvasCursor.the.height);
            canvasCursor.toggle = true;
        }
    }
}

function buildBlinkingCursors() {
    $(".cursor-blink").map(function () {
        canvasedCursors[this.id] = {
            'the': this,
            'toggle': false,
            'typedObject': null
        }
    });
}

const typedObjects = {}

function typeText(reverse = false) {
    $.each(typedObjects, function(k, v) {
        let theTypedObject = typedObjects[k]

        function blinkOwnedCursor() {
            if (theTypedObject.canvasedCursor) {
                return setInterval(function () {
                    blinkCursor(theTypedObject.canvasedCursor);
                }, 250);
            }
        }

        if (!reverse) {
            if (theTypedObject.activeTextIndex <= (theTypedObject.activeTextSize)) {
                theTypedObject.the.innerText += theTypedObject.activeText.charAt(theTypedObject.activeTextIndex);
                theTypedObject.activeTextIndex++;
                theTypedObject.typedInterval = setTimeout(function () {
                    typeText(false);
                }, theTypedObject.typedIntervalTimeForward);
            } else {
                clearInterval(typedObjects[k].typedInterval);
                let blinkInterval = blinkOwnedCursor()
                setTimeout(function () {
                    clearInterval(blinkInterval);
                    typeText(true);
                }, 5000);
            }
        } else {
            if (theTypedObject.activeTextIndex >= 0) {
                theTypedObject.the.innerText = theTypedObject.the.innerText.substring(0, theTypedObject.activeTextIndex);
                theTypedObject.activeTextIndex--;
                theTypedObject.typedInterval = setTimeout(function () {
                    typeText(true);
                }, theTypedObject.typedIntervalTimeBackward);
            } else {
                clearInterval(typedObjects[k].typedInterval);
                let blinkInterval = blinkOwnedCursor();
                setTimeout(function () {
                    // Shift the top element to the back and set the appropriate properties.
                    let textOut = theTypedObject.text.shift();
                    theTypedObject.text.push(textOut);
                    // Update props
                    theTypedObject.activeText = theTypedObject.text[0]
                    theTypedObject.activeTextIndex = 0;
                    theTypedObject.activeTextSize = theTypedObject.text[0].length;
                    clearInterval(blinkInterval);
                    typeText(false);
                }, 1000);
            }
        }
    });
}

function buildTypedTexts() {
    // -- CLASS: typed-this
    // Function: takes in any span tag labeled 'type-this'
    $('span.type-this').map(function () {
        if(this.dataset['splitChar']) {
            typedObjects[this.id] = {
                'the': this,
                'text': this.innerText.split(this.dataset['splitChar']),
                'activeText': this.innerText.split(this.dataset['splitChar'])[0],
                'activeTextIndex': 0,
                'activeTextSize': this.innerText.split(this.dataset['splitChar'])[0].length,
                'typedInterval': null,
                'typedIntervalTimeForward': 100,
                'typedIntervalTimeBackward': 50,
                'canvasedCursor': null
            }
        } else {
            typedObjects[this.id] = {
                'the': this,
                'text': this.innerText.split(' '),
                'activeText': this.innerText.split(' ')[0],
                'activeTextIndex': 0,
                'activeTextSize': this.innerText.split(' ')[0].length,
                'typedInterval': null,
                'typedIntervalTimeForward': 100,
                'typedIntervalTimeBackward': 50,
                'canvasedCursor': null
            }
        }
        this.innerText = '';
    });
}

function scrollTopTheTopNicely() {
    $('html, body').animate({scrollTop:0}, 2000);
}