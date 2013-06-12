/*
 * reveal.leap.js
 * Uses Reveal.js API
 * @author https://github.com/jefBinomed
 */

var RevealLeap = function() {

    // Support both the WebSocket and MozWebSocket objects
    if ((typeof(WebSocket) == 'undefined') &&
    (typeof(MozWebSocket) != 'undefined')) {
        WebSocket = MozWebSocket;
    }

    ws = new WebSocket("ws://localhost:6437/");
    ws.onopen = function(event) {
        console.log("ws opened!");
         var enableMessage = JSON.stringify({enableGestures: true});
         ws.send(enableMessage); // Enable gestures
    }
    var lastTime = -1;
    var frameRate = 0;

    ws.onmessage = function(event) {
        frameRate++;
        if(0 === frameRate%5) {
            var obj = JSON.parse(event.data);
            if (obj.gestures){
                if(obj.gestures.length > 0) {
                    var gesture = obj.gestures[0];
                    if("swipe" === gesture.type) {
                        var currentTime = new Date().getTime();
                        if(-1 == lastTime){
                            lastTime = currentTime;
                            if(gesture.direction[0] < -0.9){ // horizontal swipes only
                            Reveal.prev();
                            } else if (gesture.direction[0] > 0.9) {
                              Reveal.next();
                            }
                        }
                        else if (300 < currentTime - lastTime) {
                            lastTime = -1;
                        }
                    }
                }
            }
        }
    }

    ws.onclose = function(event) {
        ws = null;
    }

    ws.onerror = function(event) {
        console.log("ERROR: " + event);
    }
}();
