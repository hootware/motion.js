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
	
	//var logger = document.getElementById('logger');
	function log(text){
		//var line = document.createElement('li');
		//line.innerHTML = text;
		//logger.insertBefore(line, logger.firstChild)
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
			stopping: false,
			starting: false,
			shaking: false,
			sensitivity: 5,
			currentCoords: null,
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
			start: function() {
				//Emit shake start
				this.shaking = true;
				log("Start event");
				window.dispatchEvent(this.events['start']);
			},
			stop: function() {
				this.shaking = false;
				this.lastStop = new Date().getTime();
				//Emit shake end
				log("Stop event");
				window.dispatchEvent(this.events['end']);
			},
			listen: function(){
				window.addEventListener('devicemotion', function (e) {
					//Change
					var change = 0;
					
					//New Coords
					var newX = e.accelerationIncludingGravity.x;
					var newY = e.accelerationIncludingGravity.y;
					var newZ = e.accelerationIncludingGravity.z;
					
					//If not the first
					if (this.coords != null) {
						change = Math.abs(this.coords.x - newX + this.coords.y - newY + this.coords.z - newZ);
					} else {
						this.coords = {};
					}
					
					//Update
					this.coords.x = newX;
					this.coords.y = newY;
					this.coords.z = newZ;
					
					//If we have a change on 2 axis then we are shaking properly
					if (change >= this.sensitivity) {
						//If not currently shaking
						if (!this.shaking) {
							//Check to see if its starting, if so then start it properly
							if (this.starting) {
								this.start();
								this.starting = false;
							
							//Check to see if its starting, if it isn't then set it to starting
							} else {
								this.starting = true;
							}						
						}
						
					} else {
						//If currently shaking
						if (this.shaking) {
							//Check to see if its starting, if so then start it properly
							if (this.stopping) {
								this.stop();
								this.stopping = false;

							//Check to see if its starting, if it isn't then set it to starting
							} else {
								this.stopping = true;
							}
						}	
					}
					
				}.bind(this), false);
			}
		}
		shake.init();
	}
})();