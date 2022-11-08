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
 * This file contains additional functions used in Berusky 2 WebGL game.
 *
 */

/**
* Callback for showing some of measured parameters
* and showing them into console.
* Enabled by showFPSinConsole.
*/
function showFPS(){

    if(showFPSinConsole){
        console.log("FPS:"+fps+ " clippedObjects: " + clippedObjects + " static: " + staticCounter + " dynamic " + dynamicCounter);
    }

    // Reinitialization
    fps = 0;
    clippedObjects = 0;
    staticCounter = 0;
    dynamicCounter = 0;

    // New timeout
    if(showFPSinConsole){
        fpsTimeoutID = setTimeout(showFPS, 1000);
    }
}

/**
* This function toggles rendering mode
*/
function changeRenderMode(){

    if(log){
        console.log("Changing render mode");
    }

    var nextRenderModeIndex = (++renderModeIndex) % renderModes.length;
    renderModeIndex = nextRenderModeIndex;
    
    // New rendering mode
    renderMode = renderModes[renderModeIndex];
}

/**
* Toggles camera mode
*/
function changeCameraMode(){

    var nextCameraModeIndex = (++cameraModeIndex) % cameraModes.length;
    cameraModeIndex = nextCameraModeIndex;

    // New Camera mode
    cameraMode = cameraModes[cameraModeIndex];

    /*if(useRotationInFPS && cameraMode == "fpsCamera"){


    }*/
}

/**
* Resets camera rotation and elevation, so that it
* is behing the selected bug.
*/
function resetCamera(){

    switch(logic.dynamicItems[logic.selectedBugID].direction){

        case "up":
            currentRotation = 90;
            break;
        case "right":
            currentRotation = 180;
            break;
        case "down":
            currentRotation = 270;
            break;
        case "left":
            currentRotation = 360;
            break;
    }

    currentRotation -= 90;

    currentElevation = 15;
}

/**
* Callback function for drawing bug with
* original texture again
*/
function resetSelectionPainter(){

    paintSelectedBugRed = false;
}

/**
* Determines if GUID belongs to static or dynamic object
* @param guid GUID attribute of object
* @return If object is static then true, else false
*/
function isObjectStatic( guid ){
	
	var itemClass = Math.floor(guid / 1000);
	
	return (itemClass == 2 || itemClass == 9 || itemClass == 17 || itemClass == 19 || itemClass == 20 || itemClass == 12 || itemClass == 4);
}

/** 
* Determines if GUID belong to bug 
* @param guid GUID attribute of object
* @return true if guid belongs to bug, else false
*/
function isObjectBug( guid ){
	
	var itemClass = Math.floor(guid / 1000);
	
	return (itemClass == 1);
}
	
/**
* Sort helper.
* Sorts objects by distance from camera.
* FAR -> CLOSE
*/
function sortObjectsByZOrder(object1, object2){

    if(object1.zValue < object2.zValue){

        return 1;
    }
    else{

        return -1;
    }

}

/**
* Convert degrees into radians
* @param degrees Angle in deg.
* @return Angle in radians
*/
function degToRad(degrees) {

    return degrees * Math.PI / 180;
}

/**
* Used for measuring game performance
*/
function time(){

    timeCounter += 10;  

    if(showTime){
        timeID = setTimeout(time, 10);
    }
    else{
        if(log){
            console.log("time " + (timeCounter));
        }
    }
 }

/**
* Clones object 
* @param obj Object
* @return Copied object
*/
function clone(obj){

    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor();

    // Copy it key by key
    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}

/* Background position animate pro firefox */
(function($) {
if(!document.defaultView || !document.defaultView.getComputedStyle){
    var oldCurCSS = jQuery.curCSS;
    jQuery.curCSS = function(elem, name, force){
        if(name === 'background-position'){
            name = 'backgroundPosition';
        }
        if(name !== 'backgroundPosition' || !elem.currentStyle || elem.currentStyle[ name ]){
            return oldCurCSS.apply(this, arguments);
        }
        var style = elem.style;
        if ( !force && style && style[ name ] ){
            return style[ name ];
        }
        return oldCurCSS(elem, 'backgroundPositionX', force) +' '+ oldCurCSS(elem, 'backgroundPositionY', force);
    };
}

var oldAnim = $.fn.animate;
$.fn.animate = function(prop){
    if('background-position' in prop){
        prop.backgroundPosition = prop['background-position'];
        delete prop['background-position'];
    }
    if('backgroundPosition' in prop){
        prop.backgroundPosition = '('+ prop.backgroundPosition + ')';
    }
    return oldAnim.apply(this, arguments);
};

function toArray(strg){
    strg = strg.replace(/left|top/g,'0px');
    strg = strg.replace(/right|bottom/g,'100%');
    strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");
    var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
    return [parseFloat(res[1],10),res[2],parseFloat(res[3],10),res[4]];
}

$.fx.step.backgroundPosition = function(fx) {
    if (!fx.bgPosReady) {
        var start = $.curCSS(fx.elem,'backgroundPosition');

        if(!start){//FF2 no inline-style fallback
            start = '0px 0px';
        }

        start = toArray(start);

        fx.start = [start[0],start[2]];

        var end = toArray(fx.end);
        fx.end = [end[0],end[2]];

        fx.unit = [end[1],end[3]];
        fx.bgPosReady = true;
    }

    var nowPosX = [];
    nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
    nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];
    fx.elem.style.backgroundPosition = nowPosX[0]+' '+nowPosX[1];
};
})(jQuery);

