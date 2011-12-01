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
	
	/**
	 * Shake detection
	 */
	if (window.DeviceMotionEvent === undefined) {
		//Not supported
		throw "Device motion not supported";
		
	} else {
		var shake = {
			events: {},
			sensitivity: 20,
			shaking: false,
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
				this.events['start'] = document.createEvent("Event");
				this.events['start'].initEvent('start', true, true);
				this.events['end'] = document.createEvent("Event");
				this.events['end'].initEvent('event', true, true);
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
					window.dispatchEvent(this.events['start']);
				}
			},
			stop: function() {
				if (this.shaking) {
					this.shaking = false;
					//Emit shake end
					window.dispatchEvent(this.events['end']);
				}
			},
			listen: function(){
				window.addEventListener('devicemotion', function (e) {
					//Collect values
					var newX = e.accelerationIncludingGravity.x;
					var newY = e.accelerationIncludingGravity.y;
					var newZ = e.accelerationIncludingGravity.z;

					//Check the Z axis
					if (Math.abs(newX - shake.currentCoords.x) > shake.sensitivity) {
						//X has started
						this.update(newX, newY, newZ, true);
						return;
					} else if (Math.abs(newX - shake.currentCoords.x) <= shake.sensitivity) {
						//X has stopped
						this.update(newX, newY, newZ, false);
						return;
					
					//Check the Y axis
					} else if (Math.abs(newX - shake.currentCoords.y) > shake.sensitivity) {
						//Y has changed
						this.update(newX, newY, newZ, true);
						return;
					} else if (Math.abs(newY - shake.currentCoords.y) <= shake.sensitivity) {
						//X has stopped
						this.update(newX, newY, newZ, false);
						return;
					
					//Check the Z axis
					} else if (Math.abs(newZ - shake.currentCoords.z) > shake.sensitivity) {
						//Y has changed
						this.update(newZ, newZ, newZ, true);
						return;
					} else if (Math.abs(newZ - shake.currentCoords.z) <= shake.sensitivity) {
						//X has stopped
						this.update(newX, newY, newZ, false);
						return;
					}

				}.bind(this), false);
			}
		}
		shake.init();
	}
})();