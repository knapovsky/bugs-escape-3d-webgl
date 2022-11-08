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
 * This file contains several function used for initialization of HTML5 canvas
 * element used in Berusky 2 WebGL game.
 *
 */

/**
* Initialize HTML5 canvas element
*/
function initCanvas(){
    
    // Get dom reference
    var canvas = document.getElementById("webgl-canvas");

    // Set width and heigth
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    // Initialize
    initGL(canvas);
}

/**
* This function initializes WebGL and sets
* handlers to keyboard and mouse events.
*/
function webGLStart() {
    
    var canvas = document.getElementById("webgl-canvas");

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    // Initialize WebGL
    initGL(canvas);
    
    // Init Shaders
    if(glInitialized){
    	initShaders();
    }

    if(runWhenLoaded){
        loadLevel();
        logicBackup = clone(logic);
    }

    // Set handlers to keyboard
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    // Set handlers to mouse
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    
    // Set handlers to mouse move events
    $("#webgl-canvas").mousemove(function(event) {
        
        position = getPosition(event);
		
		currentPointerX = position.x;
		currentPointerY = position.y;

    });
    
    // Mouse inside canvas - adding over class to canvas element
    $("#webgl-canvas").mouseover(function(e)
    {
		$(this).addClass("over");
    });
    // removing over class from canvas element
	$("#webgl-canvas").mouseout(function(e)
    {
		$(this).removeClass("over");
    });

    // Bind menu mouseClick, mouseOver, mouseRelease animations
    // and actions
    bindMenuToMouse();

    // Bind chooser button mouseClick, mouseOver, mouseRelease animations
    // and actions
    bindChooserButton();

    // Bind chooser sliders mouseClick, mouseOver, mouseRelease animations
    // and actions
    bindChooserSliders();

    // Bind levels mouseClick, mouseOver, mouseRelease animations
    // and actions
    if(glInitialized){
    	bindLevels();
    }

    // Bind audio player mouseClick, mouseOver, mouseRelease animations
    // and actions
    audioBindPlayerUI();

    // Bind icons mouseClick, mouseOver, mouseRelease animations
    // and actions
    bindIcons();

    // Bind mouse wheel in Firefox
    if (window.addEventListener){

        // DOMMouseScroll is for mozilla.
        canvas.addEventListener('DOMMouseScroll', handleWheel, false);
    }

    // Set gl
    if(glInitialized){
    	gl.clearColor(0.0, 0.0, 0.0, 1.0);
    	gl.enable(gl.DEPTH_TEST);
    }
}