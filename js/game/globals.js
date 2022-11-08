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
 * This file contains all global variables used in the game.
 *
 */


/*  
    ---------------------------
         Global Variables
    ---------------------------
*/

/**
* Additional informations in console
*/
var log = false;

/**
* Main WebGL Object
*/
var gl;
/**
* Compiled shader program
*/
var shaderProgram;
/**
* Array of dynamic GeometryContainer
* objects
*/
var dynamicObjects = [];
/**
* Array of static GeometryContainer
* objects
*/
var staticObjects = [];
/**
* Logic representation of game field
*/
var logic;
/**
* Lights in the scene
*/
var lights = [];
/**
* Lightmaps in the scene
*/
var lightmaps = [];
/**
* Game materials
*/
var materials = [];
/**
* Model-View Matrix
*/
var mvMatrix = mat4.create();
/**
* Model-View Matrix stack
*/
var mvMatrixStack = [];
/**
* Projection Matrix
*/
var pMatrix = mat4.create();

/** ----- PATHS AND FILETYPES ----- **/

/**
* Lightmap path on the server
*/
var lightmapPath = "./lightmaps/";
/**
* Lightmap file type
*/
var lightmapFileType = ".bmp";
/**
* Level path on the server
*/
var levelPath = "./levels/";
/**
* Game representation export file type
*/
var levelFileType = ".json";
/**
* Actually selected level
*/
var selectedLevel = "level210";
/**
* Audio path
*/
var audioPath = "./audio/";
/**
* Used audio files
*/
var audioFiles = [  "Break", 
					"comix1",
					"comix2",
					"comix3",
					"comix4",
					"comix5",
					"comix6",
					"comix7",
					"comix8",
					"comix9",
					"comix10",
					"Cool12",
					"Emotion",
					"Freemind",
					"Piano",
					"Piano1",
					"Relax3",
					"Relax4",
					"Relax5",
					"Relax6",
					"Relax7",
					"Space",
					"Trip12"
							]
/**
* Audio filetype
*/
var audioFileType = ".ogg";

/** ----- END OF PATHS AND FILETYPES -----  **/

/** ----- RENDERING SETTINGS ----- **/

/**
* Sets rendering of the game field - true
* or rendering of the whole scene - false
* mapped to key 'n'
*/
var drawOnlyGameField = true;
/**
* This enables or disables drawing
*/
var draw = true;
/**
* Sets usage of opacity
* mapped to key 'o'
*/
var useOpacity = false;
/**
* Sets amout of color addition 
* when opacity enabled
*/
var opacityLevel = 0.5;
/**
* Sets usage of textures
* Mapped to key 't'
*/
var useTextures = true;
/** 
* Sets usage of lightmaps in the scene
* Lightmaps has not been completely 
* exported yet, so use this only
* when you are completely sure
* what you are doing, because this
* significantly slows rendering
* Mapped to key 'x'
*/
var useLightmaps = false;
/**
* Sets usage of lightning
* Mapped to key 'l'
*/
var useLightning = true;
/**
* Sets usage of specular highlights in the scene
* Works only with useLightning = true
* Mapped to key 's'
*/
var useSpecular = true;
/**
* Sets WebGL canvas to fullscreen
* This removes all HTML elements (visibility: none)
* and leaves only WebGL canvas and UI over it
* Mapped to key 'f'.
*/
var fullscreen = false;
/**
* Sets top camera lock
*/
var useTopCamera = false;
/**
* This displays user interface
* Mapped to key 'u'
*/
var useUi = true;
/**
* Actual rendering mode
*/
var renderMode = "triangles";
/**
* Index of actual rendering mode
* This is used for faster access
*/
var renderModeIndex = 0;
/**
* This is just a list of all supported
* rendering modes. Those enabled are
* included in renderModes
*/
var allRenderModes = ["triangles", "points", "lineStrip", "lineLoop", "lines", "triangleStrip", "triangleFan", "quadStrip", "quads", "polygon"];
/**
* Enabled rendering modes
* Change of rendering mode is mapped to key 'm'
*/
var renderModes = ["triangles", "points", "lineStrip"];
/**
* Actual camera mode
* "followCamera" is default
*/
var cameraMode = "followCamera";
/**
* Actual index of camera mode
* for faster access
* default value is 3
*/
var cameraModeIndex = 3;
/**
* List of camera modes
* Change of camera mode is mapped to key 'c'
*/
var cameraModes = ["centerCamera", "fpsCamera", "followCamera", "behindCamera"];
/**
* ID of timeout used whed selecting bug
*/
var paintSelectedBugRedTimeoutID = -1;
/**
* Nastavi vykreslovani vybrane berusky 
* cervenou barvou - interval vykreslovani
* se nastavi pomoci resetSelectionPainterTime
*/
var paintSelectedBugRed = false;
/**
* Sets timeout delay for bug being 
* drawn red when selected.
* Enabled by paintSelectedBugRed
*/
var resetSelectionPainterTime = 1000;
/**
* Sets drawing of weight reacting
* floor to higher position
*/
var propadloUp = true;
/**
* This variable enables envelope
* drawing for dynamic objects
*/
var drawEnvelopes = false;
/**
* This is used for drawing of 
* additional floor when there is
* only game field displayed
*/
var drawFloor = true;
/**
* Sets frustrum clipping
*/
var useClipping = false;
/**
* When clipping is enabled 
* this variable sets normalization
* of frustrum
*/
var normalizeFrustum = false;
/**
* Clipped object counter
*/
var clippedObjects = 0;
/**
* This specifies the amout 
* of objects being clipped
*/
var clippingThreshold = 0;
/**
* Sets keyboard and event notifications
*/
var useNotifications = true;


/** ----- END OF RENDERING SETTINGS ----- **/

/** ----- OTHER GLOBAL VARIABLES ----- **/

/**
* Indication of WebGL object being initialized
* used for faster access
*/
var glInitialized = false;
/**
* This variable is used for switching
* between old type of export and new one
* All game files are now converted into
* new format, so true is default
*/
var newFlag = true;
/**
* This enables loading of the game 
* when onload event evoked
* Otherwise loading of level is evoked
* by users keypress on level item in menu
*/
var runWhenLoaded = false;
/**
* When loading level, progress is displayed.
* This value sets the value ofloaded JSON file.
*/ 
var loadedJSONValue = 30;
/**
* When level is loaded, then this variable is set to true
*/
var loaded = false;
/**
* This variable is important
* for various levels with gamefield
* located very low
*/
var moveAlongYAxis = true;
/** 
* Counter of static object drawn
* in one second
*/
var staticCounter = 0;
/**
* Counter of dynamic objects drawn 
* in one second
*/
var dynamicCounter = 0;
/**
* Sum of all loaded textures
*/
var textureCount = 0;
/**
* How many textures have already been loaded
*/
var loadedTextureCount = 0;
/**
* Current frames drawn
* This is being reitialized every second
*/
var fps = 0;
/**
* Sets displaying of FPS into console
*/
var showFPSinConsole = true;
/**
* ID of fps Timeout
*/
var fpsTimeoutID = 0;
/**
* Actually pressed keys
*/
var currentlyPressedKeys = {};
/**
* Receive events from user
*/
var receiveKeyEvents = true;
/**
* When level loaded, here is the whole level
* saved so it can be easily reloaded
*/
var logicBackup;
/**
* How fast to elevate camera
*/
var pitchRate = 0;
/**
* How fast to rotace camera
*/
var yawRate = 0;
/**
* Adjustment for X Axis translation
*/
var xAdjust = 0;
/**
* Adjustment for Y Axis translation
*/
var yAdjust = 0;
/**
* Adjustment for Z Axis translation
*/
var zAdjust = 0;
/**
* Indication of pressed mouse button
*/
var mouseDown = false;
/**
* Mouse last position - axis X
*/
var lastMouseX = null;
/**
* Mouse last position - axis Y
*/
var lastMouseY = null;
/**
* Actual camera rotation
*/
var currentRotation = 60;
/**
* Actual camera eleveation
*/
var currentElevation = 45;
/**
* Width of canvas element
* Used for mouse move events
*/
var canvasWidth;
/**
* Height of canvas element
* Used for mouse move events
*/
var canvasHeight;
/**
* Actual pointer position in axis X
*/
var currentPointerX;
/**
* Actual pointer position in axis Y
*/
var currentPointerY;
/**
* Rotation speed step
*/
var rotationSpeed = 1;
/**
* Slow rotation speed
*/
var singleSpeedRotation = 10;
/**
* Fast rotation speed
*/
var doubleSpeedRotation = 20;
/**
* Double speed multiplier
*/
var doubleSpeedMultiplier = 2;
/**
* Low elevation limit
*/
var lowElevationLimiter = 15;
/**
* High elevation limit
*/
var highElevationLimiter = 90;
/**
* Actual distance from scene
*/
var distanceFromScene = 35;
/**
* Distance speed multiplier
*/
var cameraDistanceMultiplier = 1;
/**
* Max camera distance
*/
var maxCameraDistance = 45;
/**
* Min camera distance
*/
var minCameraDistance = 10;
/**
* Timer enabler
*/
var showTime = false;
/**
* Actual time from timeout start
*/
var timeCounter = 0;
/**
* Time counter timeout ID
*/
var timeID = 0;
/**
* Draw only bugs
*/
var drawJustBug = false;
/**
* Not used yet
*/
var useCameraReset = false;
/**
* Whether to use projection
* buttons or not
*/
var useProjection = false;
/**
* Default projection angle
*/
var projectionAngleDefault = 45;
/**
* Actual projection angle
*/
var projectionAngle = projectionAngleDefault;
/**
* Step for projection angle adjustment
*/
var projectionStep = 5;

/** ----- WEB GLOBAL VARIABLES ----- **/

/**
* Canvas width for web functions
*/
var windowWidth = 896;
/**
* Menu items
*/
var menu = ['#info', '#howto', '#controls'];
/**
* Actually selected menu item
*/
var selectedScreen = "welcome";
/**
* First level in selector
*/
var leftLevel = 1;
/**
* Is level selector opened?
* FALSE = Closed, TRUE = Opened 
*/
var chooserOpened = false;
/**
* Several animation speed
*/
var speed = 1000;
/**
* How much to shift level div
*/
var levelShift = 170;
/**
* How many levels shown in selector
* at time
*/
var shownLevels = 4;
/**
* How many levels shown in selector
* summary
*/
var levelCounter = 20;
/**
* Double click indicator
*/
var click = false;
/**
* Do not ask me :D
*/
var hack = 2710;
/**
* Rotate levels or not?
*/
var rotateLevelBool = false;
/**
* Chooser animated
*/
var chooserMoving = false;
/**
* Move arrows under pointer
*/
var moveArrow;
/**
* Current screen of howto context
*/
var currentHowtoScreen = 1;
/**
* Current screen of controls context
*/
var currentControlsScreen = 1;
/**
* How many control screens there are
*/
var controlsScreenCount = 2;
/**
* How many howto screens there are
*/
var howtoScreenCount = 3;
/**
* This function is used for 
* level with diffent represention
* loaded
*/
var corrections = function(){};

/* --- AUDIO SECTION --- */
/**
* Audio player div name
*/
var audioDiv = "#audioPlayer";
/**
* Audio player API div name
*/
var audioAPIDiv = "#audioPlayerAPI"
/**
* Audio player buttons div name
*/
var audioButtonsDiv = "#audioPlayerButtons"
/**
* Currently loaded song
*/
var audioPlayingIndex = 0;
/**
* Audio previous button div name
*/
var audioPrewDiv = "#prev";
/**
* Audio play button div name
*/
var audioPlayPauseDiv = "#playPause";
/**
* Audio next button div name
*/
var audioNextDiv = "#next";
/**
* Is audio currently playing?
*/
var audioPlaying = false;