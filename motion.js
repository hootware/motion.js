/**
 * Copyright (C) 2011 by Ollie Parsley
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */

(function(){
	
	var logger = document.getElementById('logger');
	function log(text){
		var line = document.createElement('li');
		line.innerHTML = text;
		logger.insertBefore(line, logger.firstChild)
	}
	
	/**
	 * Shake detection
	 */
	if (window.DeviceMotionEvent === undefined) {
		//Not supported
		log("Device motion not supported");
		
	} else {
		log("Start");
		var shake = {
			events: {},
			startCount: 0,
			stopCount: 0,
			first: true,
			delay: true,
			shaking: false,
			sensitivity: 5,
			baseCoords: {
				x: 0,
				y: 0,
				z: 0
			},
			currentCoords: {
				x: 0,
				y: 0,
				z: 0
			},
			init: function(){
				//Initialise custom events
				log("Init start");
				this.events['start'] = document.createEvent("Event");
				this.events['start'].initEvent('shakestart', true, true);
				this.events['end'] = document.createEvent("Event");
				this.events['end'].initEvent('shakeend', true, true);
				//Start listening
				this.listen();
				log("Init end");
			},
			update: function(x, y, z, shaking) {
				//Update coords
				this.currentCoords.x = x;
				this.currentCoords.y = y;
				this.currentCoords.z = z;
				if (shaking) {
					this.start();
				} else {
					this.stop();
				}
			},
			start: function() {
				if (!this.shaking) {
					this.shaking = true;
					//Emit shake start
					log("Start event");
					window.dispatchEvent(this.events['start']);
				}
			},
			stop: function() {
				if (this.shaking) {
					this.shaking = false;
					//Emit shake end
					log("Stop event");
					window.dispatchEvent(this.events['end']);
				}
			},
			listen: function(){
				window.addEventListener('devicemotion', function (e) {
					
					//Collect values
					var newX = parseInt(e.accelerationIncludingGravity.x);
					var newY = parseInt(e.accelerationIncludingGravity.y);
					var newZ = parseInt(e.accelerationIncludingGravity.z);
					var shaking = false;
					//log("motion: " + newX + "\t" + shake.currentCoords.x + "\t" + Math.abs(newX - shake.currentCoords.x));
					
					//log("X " + Math.abs(newX) + ' - ' + shake.sensitivity);
					//log("Y " + Math.abs(newY) + ' - ' + shake.sensitivity);
					//log("Z " + Math.abs(newZ) + ' - ' + shake.sensitivity);
					
					//Check the Z axis
					if (Math.abs(newX - shake.currentCoords.x) > shake.sensitivity) {
						//X hass changed
						shaking = true;
						
					//Check the Y axis
					} else if (Math.abs(newY - shake.currentCoords.y) > shake.sensitivity) {
						//Y has changed
						shaking = true;
						
					//Check the Z axis
					} else if (Math.abs(newZ - shake.currentCoords.z) > shake.sensitivity) {
						//Y has changed
						shaking = true;
					
					}

					//log(shaking);
					this.update(newX, newY, newZ, shaking);
					
				}.bind(this), false);
			}
		}
		shake.init();
	}
})();