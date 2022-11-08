/**
 * @file
 * @author Martin Knapovsky <xknapo02@stud.fit.vutbr.cz>
 * @version 1.0
 *
 * @section LICENSE
 *
 * Copyright (c) 2012, Martin Knapovsky
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. All advertising materials mentioning features or use of this software
 *    must display the following acknowledgement:
 *    This product includes software developed by the Martin Knapovsky.
 * 4. Neither the name of the Martin Knapovsky nor the
 *    names of its contributors may be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY MARTIN KNAPOVSKY ''AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL MARTIN KNAPOVSKY BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @section DESCRIPTION
 *
 * This file contains mouse and keyboard handlers for Berusky 2 WebGL game.
 *
 */

/**
* Handles mouse events
*/
function handlePointer(){
	
	// Is canvas under pointer?
	if($("#webgl-canvas").hasClass("over")){
		//
        // Set rotation direction and spped 
        // according to mouse pointer position
        //
        // Left rotation
		if(currentPointerX < canvasWidth/singleSpeedRotation){

			yawRate = rotationSpeed;
			if(currentPointerX < canvasWidth/doubleSpeedRotation){

				yawRate = yawRate * doubleSpeedMultiplier;
			}
			currentRotation = (currentRotation + yawRate) % 360;
		}
        // Right rotation
		else if(currentPointerX > ((canvasWidth/singleSpeedRotation)*(singleSpeedRotation - 1))){

			yawRate = -rotationSpeed;
			if(currentPointerX > (canvasWidth/doubleSpeedRotation)*(doubleSpeedRotation - 1)){

				yawRate = yawRate * doubleSpeedMultiplier;
			}
			currentRotation = (currentRotation + yawRate) % 360;
		}
		else{
			yawRate = 0;
		}

        // Elevation++
		if(currentPointerY < canvasHeight/singleSpeedRotation){

			pitchRate = rotationSpeed;
            // Single speed
			if(currentPointerY < canvasHeight/doubleSpeedRotation){

				pitchRate = pitchRate * doubleSpeedMultiplier;
			}
            // Double speed
			if((currentElevation + pitchRate) >= highElevationLimiter){

				return;
			}
			else{

				currentElevation = (currentElevation + pitchRate);
			}
		}

        // Elevation--
		else if(currentPointerY > ((canvasHeight/singleSpeedRotation)*(singleSpeedRotation - 1))){

			pitchRate = -rotationSpeed;
            // Single speed
			if(currentPointerY > canvasHeight/doubleSpeedRotation*(doubleSpeedRotation - 1)){

				pitchRate = pitchRate * doubleSpeedMultiplier;
			}
            // Double speed
			if(currentElevation + pitchRate < lowElevationLimiter){

				return;
			}
			else{

				currentElevation = (currentElevation + pitchRate);
			}
		}
		else{

			pitchRate = 0;
		}
	}
	else{
		
		yawRate = 0;
		pitchRate = 0;
	}	
}

/** 
* Event handler for mouse wheel event.
* @param event Mouse event
*/
function handleWheel(event) {

    if(log){
        console.log("handling wheel");
    }

    var delta = 0;
    if (!event){
		/* IE. */
		event = window.event;
	}
    if (event.wheelDelta) {
        /* IE/Opera. */
        delta = event.wheelDelta / 120;
    }
    else if (event.detail) {
		/* Mozilla */
		/* Delta is 3 times lower */
        delta = -event.detail / 3;
    }
    
	// If delta not zero - mouse moved
    if (delta){
		
		// Hack :D
		delta = -delta;

        // Move from scene
		if(delta > 0){
		    // Check for boundaries
			if((distanceFromScene + delta) > maxCameraDistance){	
			
				return;
			}
			else{
				
				distanceFromScene = distanceFromScene + (delta * cameraDistanceMultiplier);
			}
		}
        // Move into scene
		else{
            // Check for boundaries
			if((distanceFromScene + delta) < minCameraDistance){
			
				return;
			}
			else{
				
				distanceFromScene = distanceFromScene + (delta * cameraDistanceMultiplier);
			}
		}
	}
		
	// No more events when moving mouse wheel
    if (event.preventDefault){	
		event.preventDefault();
	}
	
    event.returnValue = false;
}

/**
* Handles mouse press
*/
function handleMouseDown(event) {

    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

/**
* Handles mouse release
*/
function handleMouseUp(event) {

    mouseDown = false;
}

/**
* Handles mouse move
* Sets rotation and elevation
*/
function handleMouseMove(event) {

    if (!mouseDown) {
        return;
    }

    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;

    lastMouseX = newX
    lastMouseY = newY;
    
    currentRotation = ((currentRotation + deltaX) % 360);
    currentElevation = (currentElevation + deltaY) % 90;
    
    if(log){
        console.log("Rotation:"+currentRotation);
        console.log("Elevation:"+currentElevation);
    }

}

/**
* Handle pressed keys
*/
function handleKeyDown(event) {

    // Set key as pressed
    currentlyPressedKeys[event.keyCode] = true;

    // Handle it
    handleKeys();
    
    if(log){
        console.log("keyDown");
    }
}

/**
* Handle released keys
*/
function handleKeyUp(event) {

    // Set key as released
    currentlyPressedKeys[event.keyCode] = false;
    
    //receiveKeyEvents = true;
    
    if(log){
        console.log("keyUp");
    }
}

/**
* This function handles events from keys
*/   
function handleKeys() {

    if(!receiveKeyEvents) return;

    // If game not loaded
    if(!loaded) return;

    //
    // MOVE BUG
    //
    // UP
    if (currentlyPressedKeys[38]) {

        logic.gameStep("cursorUp");
    }
    // DOWN
    else if (currentlyPressedKeys[40]) {

        logic.gameStep("cursorDown");
    }

    // LEFT
    if (currentlyPressedKeys[37]) {

        logic.gameStep("cursorLeft");
    }
    // RIGHT
    else if (currentlyPressedKeys[39]) {

        logic.gameStep("cursorRight");
    }

    //
    // SELECT BUG
    //
    // 1
    if(currentlyPressedKeys[49]){

        logic.selectBugOnPosition(1);
    }
    // 2
    else if(currentlyPressedKeys[50]){

        logic.selectBugOnPosition(2);
    }
    // 3
    else if(currentlyPressedKeys[51]){

        logic.selectBugOnPosition(3);
    }
    // 4
    else if(currentlyPressedKeys[52]){

        logic.selectBugOnPosition(4);
    }
    // 5
    else if(currentlyPressedKeys[53]){

        logic.selectBugOnPosition(5);
    }
    // 6
    else if(currentlyPressedKeys[54]){

        logic.selectBugOnPosition(6);
    }

    // c - Change camera mode
    if(currentlyPressedKeys[67]){
        
        changeCameraMode();
        notificationAnimation('camera');
    }


    // t - Textures
    if(currentlyPressedKeys[84]){

        useTextures = !useTextures;

        if(useTextures){
            notificationAnimation("texturesOn");
        }
        else{
            notificationAnimation("texturesOff");
        }
    }

    // s - Specular
    if(currentlyPressedKeys[83]){

        useSpecular = !useSpecular;

        if(useSpecular){
            notificationAnimation("specularOn");
        }
        else{
            notificationAnimation("specularOff");
        }
    }

    // l - Lightning
    if(currentlyPressedKeys[76]){

        useLightning = !useLightning;

        if(useLightning){
            notificationAnimation("lightningOn");
        }
        else{
            notificationAnimation("lightningOff");
        }
    }

    // o - Opacity
    if(currentlyPressedKeys[79]){
        
        useOpacity = !useOpacity;

        if(useOpacity){
            notificationAnimation("opacityOn");
        }
        else{
            notificationAnimation("opacityOff");
        }

    }

    // f - Fullscreen
    if(currentlyPressedKeys[70]){

        fullscreenToggle();
    }

    // r - Restart Level
    if(currentlyPressedKeys[82]){

        reloadLogic();
        notificationAnimation('restart');
    }

    // u - show/hide UI
    if(currentlyPressedKeys[85]){

        useUi = !useUi;
        if(useUi){
            notificationAnimation("uiOn");
            showUi();
        }
        else{
            notificationAnimation("uiOff");
            hideUi();
        }
    }

    // m - toggle rendering mode
    if(currentlyPressedKeys[77]){

        changeRenderMode();
        notificationAnimation('renderMode');

    }

    // l - lightmaps\
    // not used
    if(currentlyPressedKeys[88]){

        notificationAnimation('notAvailable');
        
        /*
        useLightmaps = !useLightmaps;

        if(useLightmaps){
            notificationAnimation('lightmapsOn');
        }
        else{
            notificationAnimation('lightmapsOff');
        }*/
    }

    // Enter - top view
    if(currentlyPressedKeys[13]){

       useTopCamera = !useTopCamera;

       if(useTopCamera){
            notificationAnimation('topViewOn');
       }
       else{
            notificationAnimation('topViewOff');
       }

    }

    // n - Draw only gamefield
    if(currentlyPressedKeys[78]){

        drawOnlyGameField = !drawOnlyGameField;

        if(drawOnlyGameField){
            notificationAnimation('gameField');
        }
        else{
            notificationAnimation('wholeScene');
        }
    }

    // , - Use projection
    if(useProjection){

        if(currentlyPressedKeys[221]){

            projectionAngle += projectionStep;
        }
        else if(currentlyPressedKeys[219]){

            projectionAngle -= projectionStep;
        }
        else if(currentlyPressedKeys[222]){

            projectionAngle = projectionAngleDefault;
        }
    }
}

/**
* Gets position of the mouse pointer
* @return Position of the pointer
*/
function getPosition(e) {

    var targ;
    if (!e)
        e = window.event;
    if (e.target)
        targ = e.target;
    else if (e.srcElement)
        targ = e.srcElement;
    if (targ.nodeType == 3) 
        // Safari bug
        targ = targ.parentNode;

    // jQuery normalizes the pageX and pageY
    // pageX,Y are the mouse positions relative to the document
    // offset() returns the position of the element relative to the document
    var x = e.pageX - $(targ).offset().left;
    var y = e.pageY - $(targ).offset().top;

    return {"x": x, "y": y};
};
