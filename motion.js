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
	window.isMotionSupported = function() {
		return (window.DeviceMotionEvent !== undefined);
	}
	
	
	/**
	 * Shake detection
	 */
	if (window.isMotionSupported()) {
		var shake = {
			events: {},
			stopping: false,
			starting: false,
			shaking: false,
			sensitivity: 5,
			currentCoords: null,
			init: function(){
				//Initialise custom events
				this.events['start'] = document.createEvent("Event");
				this.events['start'].initEvent('shakestart', true, true);
				this.events['end'] = document.createEvent("Event");
				this.events['end'].initEvent('shakeend', true, true);
				//Start listening
				this.listen();
			},
			start: function() {
				//Emit shake start
				this.shaking = true;
				window.dispatchEvent(this.events['start']);
			},
			stop: function() {
				this.shaking = false;
				this.lastStop = new Date().getTime();
				//Emit shake end
				window.dispatchEvent(this.events['end']);
			},
			listen: function(){
				//Ugly as ios 4 was a pain
				var self = this;
				window.addEventListener('devicemotion', function(e) {
					
					//Change
					var change = 0;
					
					//New Coords
					var newX = e.accelerationIncludingGravity.x;
					var newY = e.accelerationIncludingGravity.y;
					var newZ = e.accelerationIncludingGravity.z;
					
					//If not the first
					if (self.coords != null) {
						change = Math.abs(self.coords.x - newX + self.coords.y - newY + self.coords.z - newZ);
					} else {
						self.coords = {};
					}
					
					//Update
					self.coords.x = newX;
					self.coords.y = newY;
					self.coords.z = newZ;
					
					//If we have a change on 2 axis then we are shaking properly
					if (change >= self.sensitivity) {
						//If not currently shaking
						if (!self.shaking) {
							//Check to see if its starting, if so then start it properly
							if (self.starting) {
								self.start();
								self.starting = false;
							
							//Check to see if its starting, if it isn't then set it to starting
							} else {
								self.starting = true;
							}						
						}
						
					} else {
						//If currently shaking
						if (self.shaking) {
							//Check to see if its starting, if so then start it properly
							if (self.stopping) {
								self.stop();
								self.stopping = false;

							//Check to see if its starting, if it isn't then set it to starting
							} else {
								self.stopping = true;
							}
						}	
					}
					
				}, false);
			}
		}
		shake.init();
	}
})();