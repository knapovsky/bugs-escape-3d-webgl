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
 * This file contains several functions used mainly for animation of 
 * DOM elements in Berusky 2 WebGL game.
 *
 */

/**
* Set inventory to default
*/
function resetUiInventory(){

    if(log){
        console.log("Inventory reset id")
    }

    inventoryAnimation('snorchel', false);
    inventoryAnimation('pickaxe', false);
    inventoryAnimation('weight', false);
    inventoryAnimation('strength', false);
}

/**
* Set inventory to selected bug
* @param id ID of bug
*/
function setUiInventory(id){

    var bug = logic.dynamicItems[id];
    
    if(bug.snorchl){
        inventoryAnimation('snorchel', true);
    }
    if(bug.weight){
        inventoryAnimation('weighting', true);
    }
    if(bug.vitamin){
        inventoryAnimation('strength', true);
    }
    if(logic.inventoryContains(id, 8) != -1){
        inventoryAnimation('pickaxe', true);
    }
}

/**
* Switches between fullscreen and normal rendering
*/
function fullscreenToggle(){

    // Switch to normal
    if(fullscreen){

        if(log){
            console.log("FULLSCREEN OFF");
        }

        // Set default css 
        $("#webgl-canvas").css({'z-index': '1000', 'width' : '896px', 'height' : '504px'}).addClass('overlay').prependTo("#console");
        // Show elements
        $("body").children().show();

        // Set canvas
        var canvas = document.getElementById("webgl-canvas");
        canvas.width  = 896;
        canvas.height = 504;
        canvasWidth = 896;
        canvasHeight = 504;

        // Show notification and move elements to its place
        $("#notification").prependTo("#notificationWindow").css({'position': 'relative', 'z-index': '10001', 'top' : '202px', 'left' : '0px' }).show();
        $("#inventory").appendTo("#ui").css({'position':'relative', 'z-index': '10000', 'top': (400)+'px', 'left': '0px'}).show();
        $("#gameProgress").appendTo('#ui').css({'position':'relative', 'z-index': '10000', 'top': (465)+'px', 'left': '-200px'}).show();
        $(audioDiv).appendTo('#console').css({'position':'absolute', 'z-index': '9999', 'top': '500px', 'left': '800px'}).show();
        notificationAnimation('fullscreenOff');

        // Continue playing
        if(audioPlaying){
            audioPlay();
        }
        else{
            audioPause();
        }

        // Reinit webgl drawing buffer
        initCanvas();

        fullscreen = false;
    }
    else{

        if(log){
            console.log("FULLSCREEN");
        }

        $("body").children().hide();
        var canvas = document.getElementById("webgl-canvas");

        // Set canvas to browser window size
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        canvasWidth = canvas.width ;
        canvasHeight = canvas.height;

        // Set CSS of canvas
        $("#webgl-canvas").removeClass('overlay');
        $("#webgl-canvas").prependTo("body").css({'position': 'absolute', 'z-index': '10000', 'width' : canvas.width+'px', 'height' : canvas.height+'px'}).show();

        // Notification position
        var top = canvasHeight/2 - 50;
        var left = canvasWidth/2 - 200;

        // Move elements and hide them
        $("#notification").prependTo("body").css({'position': 'absolute', 'z-index': '10001', 'top' : top+'px', 'left' : left+'px' }).show();
        $("#inventory").appendTo("body").css({'position':'absolute', 'z-index': '10000', 'top': (canvasHeight - 100)+'px', 'left': '15px'}).show();
        $("#gameProgress").appendTo('body').css({'position':'absolute', 'z-index': '10000', 'top': (canvasHeight - 40)+'px', 'left': '20px'}).show();
        $(audioDiv).appendTo('body').css({'position':'absolute', 'z-index': '10000', 'top': (canvasHeight - 70)+'px', 'left': (canvasWidth - 200) + 'px'}).show();
        notificationAnimation('fullscreenOn');

        // Continue playing
        if(audioPlaying){
            audioPlay();
        }
        else{
            audioPause();
        }

        // Reinit canvas
        initCanvas();

        fullscreen = true;

    }
}

/**
* Shows UI 
*/
function showUi(){

    $("#inventory").show();
    $("#gameProgress").show();
    $(audioButtonsDiv).show();
    $(audioDiv).css({'pointer-events': 'auto'});
}

/**
* Hides UI
*/
function hideUi(){

    $("#inventory").hide();
    $("#gameProgress").hide();
    $(audioButtonsDiv).hide();
    $(audioDiv).css({'pointer-events': 'none'});

}

/**
* Switches between screen contexts
*/
function restoreWindows(){

    if(selectedScreen != "webgl-canvas"){
        $("#"+selectedScreen).animate({ backgroundPosition: '0 45'}, "slow");
        var selectedScreenBackup = selectedScreen;
        $("#"+selectedScreen+"Window").animate({'opacity':'0.0'}, 1000, function(){
            $("#"+selectedScreenBackup+"Window").css({'z-index':'999'});
        });

    }
    else{
        $("#play").animate({ backgroundPosition: '0 45'}, "slow");
        var selectedScreenBackup = selectedScreen;
        $("#webgl-canvas").animate({'opacity':'0.0'}, 1000, function(){
            $("#webgl-canvas").css({'z-index':'999'});
        });
    }
}

/**
* Menu mouseover action
*/
function mMouseOver(e)  {  

  var id = this.id;
  if(id == selectedScreen){
    return;
  }
  if(id == "play" && selectedScreen == "webgl-canvas"){
    return;
  }
  //"background-position-y"
  $(this).stop().animate({ backgroundPosition: '0 20'}, "fast");
}  

/**
* Menu mouseout action
*/
function mMouseOut(e)  
{
  var id = this.id;
  if(id == selectedScreen){
    return;
  }
  else if(id == "play" && selectedScreen == "webgl-canvas"){
    return;
  }

  $(this)  
  // stop any animation that took place before this  
  .stop()  
  // step.1 move down navigation item  
  .animate({ backgroundPosition: '0 45'}, "slow"); 
}  

/**
* Animation executed when switching between contexts
* @param id Obsolete
*/
function windowAnimation(id){

    if(selectedScreen == "webgl-canvas"){
        $("#play").stop(true, false).animate({ backgroundPosition: '0 10'}, "fast");
        $("#webgl-canvas").css({'opacity':'0.0'}).css({'z-index':'1002'}).animate({'opacity':'1.0'}, 1000); 
    }
    else{
        $("#"+selectedScreen).stop(true, false).animate({ backgroundPosition: '0 10'}, "fast");
        $("#"+selectedScreen+"Window").css({'opacity':'0.0'}).css({'z-index':'1002'}).animate({'opacity':'1.0'}, 1000);
    }
}

/**
* Animation of invetory item
* @param item Inventory item to be animated
* @param state True/False - Show item or hide item in inventory
*/
function inventoryAnimation(item, state){

    if(log){
        console.log("Inventory Animation item:"+item+" state:"+state);
    }

    if(item == 'pickaxe'){
        $("#pickaxe").animate({'opacity' : '0.0'}, 100);
        if(state == true){
            $("#pickaxe").css({'background-image':'url("./img/pickaxeOn.png")'}).animate({'opacity':'1.0'}, 400);           
        }
        else{
            $("#pickaxe").css({'background-image':'url("./img/pickaxeOff.png")'}).animate({'opacity':'1.0'}, 400);          
        }
    }
    else if(item == 'snorchel'){
        $("#snorchel").animate({'opacity' : '0.0'}, 100);
        if(state == true){
            $("#snorchel").css({'background-image':'url("./img/snorchelOn.png")'}).animate({'opacity':'1.0'}, 400);         
        }
        else{
            $("#snorchel").css({'background-image':'url("./img/snorchelOff.png")'}).animate({'opacity':'1.0'}, 400);            
        }
    }
    else if(item == 'weight'){
        $("#weight").animate({'opacity' : '0.0'}, 100);
        if(state == true){
            $("#weight").css({'background-image':'url("./img/weightOn.png")'}).animate({'opacity':'1.0'}, 400);         
        }
        else{
            $("#weight").css({'background-image':'url("./img/weightOff.png")'}).animate({'opacity':'1.0'}, 400);            
        }
    }
    else if(item == 'strength'){
        $("#strength").animate({'opacity' : '0.0'}, 100);
        if(state == true){
            $("#strength").css({'background-image':'url("./img/strengthOn.png")'}).animate({'opacity':'1.0'}, 400);         
        }
        else{
            $("#strength").css({'background-image':'url("./img/strengthOff.png")'}).animate({'opacity':'1.0'}, 400);            
        }
    }
}

/**
* Animation of notifications
* @param image Image name shown in notification
*/
function notificationAnimation(image){

    if(log){
        console.log("Notification:" + image);
    }

    $("#notification").stop(true, true);

    $("#notification").css({'opacity':'0.0', 'background-image':'url("./img/'+ image +'.png")'});
    if(image == "loading"){
        $("#notification").animate({'opacity':'1.0'}, 500);
    }
    else if(image == 'youWin'){
        $("#notification").animate({'opacity':'1.0'}, 500).animate({'opacity':'0.0'}, 5000);
    }
    else{
        $("#notification").animate({'opacity':'1.0'}, 500).animate({'opacity':'0.0'}, 1000);
    }

}

/**
* Shows info context
*/
function showInfo() {

    restoreWindows();
    hideUi();
    selectedScreen = "info";
    windowAnimation();
}

/**
* Shows howto context
*/
function showHowTo(){

    restoreWindows();
    hideUi();
    selectedScreen = "howto";
    windowAnimation();
}

/**
* Shows controls context
*/
function showControls(){

    restoreWindows();
    hideUi();
    selectedScreen = "controls";
    windowAnimation();
}

/**
* Shows game context
*/
function showGame(){

    if(log){
        console.log("showgame");
    }

    if(useUi){
        showUi();
    }
    restoreWindows();
    selectedScreen = "webgl-canvas";
    windowAnimation();
}

/**
* Menu mouse click event handler
*/
function mClick(e)  
{  
    var id = this.id;

    if(id == "info"){
        showInfo();
    }
    else if(id == "howto"){
        showHowTo();
    }
    else if(id == "controls"){
        showControls();
    }
    else if(id == "play"){
        showGame();
    }
    /* Error */
    else{
        ;
    }
}  

/**
* Restores opacity of levels inside level choosed
*/
function restoreOpacity(){

    for(i; i <= levelCounter; i++){
        //$("#level"+i).animate({'opacity':'1.0'}, (Math.random()*1000) + 1);
        $("#level"+i).stop().css({'opacity':'0.5'});
    }
}

/**
* Bind menu mouse actions
*/
function bindMenuToMouse(){
 
  for ( i = 0; i < menu.length; i++ ) {  
    $(menu[i]).bind( 'mouseover', mMouseOver );  
    $(menu[i]).bind( 'mouseout', mMouseOut );  
    $(menu[i]).bind( 'click', mClick );  
  }

  $("#play").bind( 'mouseover', mMouseOver );  
  $("#play").bind( 'mouseout', mMouseOut );  
  $("#play").bind( 'click', mClick );  
}  

/**
* Level selector mouse click handler
*/
function chooserClick(){

    //var anim = $('#chooser').filter(':not(:animated)');
    //if(anim.length == 0) return;

    $('#chooser').stop(true, false);
    $(this).stop(true, false);

    if(chooserOpened){
        $("#chooser").stop().animate({ "margin-top" : "-200px"}, 1000);
        $(this).animate({rotate: '0deg'}, 1000);
        chooserOpened = false;
    }
    else{
        $("#chooser").stop().animate({ "margin-top" : "-40px"}, 1000);
        $(this).animate({rotate: '180deg'}, 1000);
        chooserOpened = true;
    }
}

/**
* Chooser button mouse click bind
*/
function bindChooserButton(){

    $("#chooserButton").bind( 'click', chooserClick );
}

/**
* Removes double click indication
*/
function doubleClickRemover(){
   
    click = false;
}

/**
* Removes level selector 'moving' indicator
*/
function notMoving(){

    chooserMoving = false;
}

/**
* Chooser is moving
*/
function setChooserMoving(){

    setTimeout(notMoving, 1000);
}

/**
* Chooser left arrow click handler
*/
function chooserSliderLeftClick(){

    chooserMoving = true;

    if(click){

        $("#level"+(leftLevel+3)).stop(true, true);


        /* Slide Back */
        if(leftLevel >= levelCounter - 3) {

            $("#levelList").stop(true, false);
            $("#levelList").animate({'left': (-(hack+300))+'px' }, 500, function() {
                $("#levelList").animate({'left': (-hack)+'px' }, 500);
            });
            return;
        }

        /* Move */
        var shift;
        var toMove = levelCounter - leftLevel + 1;
        
        // 1 level already moved
        var lastFullMovable = levelCounter - 2*shownLevels + 2;

        if(log){
            console.log("leftLevel: "+leftLevel+" to move: "+ toMove+" lastFullMovable: "+lastFullMovable);
        }
        if(leftLevel <= lastFullMovable){

            if(log){
                console.log("Full Move");
            }
            
            shift = shownLevels - 1;
        }
        else{
            shift = levelCounter - leftLevel - (shownLevels - 1);
            if(log){
                console.log("Partial move");
            }
        }

        if(log){
            console.log(shift);
        }

        $("#levelList").stop(false, true);
        
        var i = 1;
        for(i; i <= levelCounter; i++){
            $("#level"+i).animate({'opacity':'0.0'}, (Math.random()*200) + 1).animate({'opacity':'1.0'}, (Math.random()*1000) + 1);
        }

        if(log){
            console.log("double click left");
        }
        var leftPosition = parseInt($("#levelList").css('left'));
        leftPosition = leftPosition - (shift*170);
        $("#levelList").animate({'left':''+(leftPosition)+'px'}, 1000);

        leftLevel += shift;
        return;
    }

    click = true;

    /* Timeout for double click */
    setTimeout( doubleClickRemover, 400);

    var anim = $('#levelList').filter(':not(:animated)');
    if(anim.length == 0) return;

    var leftPosition = parseInt($("#levelList").css('left'));
    leftPosition = leftPosition - 170;
    if(leftLevel == (levelCounter - 3)){
        leftPosition += 100;
        $("#levelList").animate({'left': ''+(leftPosition)+'px' }, 500, function() {
            $("#levelList").animate({'left': ''+(leftPosition + 70)+'px' }, 500);
        });
        return;
    }

    $("#level"+leftLevel).animate({'opacity':'0.0'}, 400);
    $("#level"+(leftLevel+4)).css({'opacity':'0.0'}).animate({'opacity':'1.0'}, 1000);

    var leftLevelBackup = leftLevel;
    $("#levelList").animate({'left': ''+leftPosition+'px' }, 1000, function() {
        $("#levelList").children().css({'opacity':'1.0'});
    });
    leftLevel++;

    notMoving();
}

/**
* Chooser Right arrow click handler
*/
function chooserSliderRightClick(){

    chooserMoving = true;

    if(click){

        $("#level"+(leftLevel)).stop(true, true);

        if(log){
            console.log("double right");
        }
        /* Slide Back */
        if(leftLevel == 1) {

            $("#levelList").stop(true, false);
            $("#levelList").animate({'left': '300px' }, 500, function() {
                $("#levelList").animate({'left': '10px' }, 500);
            });
            return;
        }

        /* Move */
        var shift;      
        if(leftLevel >= shownLevels){
            if(log){
                console.log("Full Move");
            }
            shift = shownLevels - 1;
        }
        else{
            shift = leftLevel - 1;
            if(log){
                console.log("Partial move");
            }
        }

        if(log){
            console.log(shift);
        }

        $("#levelList").stop(false, true);
        
        var i = 1;
        for(i; i <= levelCounter; i++){
            $("#level"+i).animate({'opacity':'0.0'}, (Math.random()*200) + 1).animate({'opacity':'1.0'}, (Math.random()*1000) + 1);
        }

        if(log){
            console.log("double click right");
        }
        var leftPosition = parseInt($("#levelList").css('left'));
        leftPosition = leftPosition + (shift*170);
        $("#levelList").animate({'left':''+(leftPosition)+'px'}, 1000);

        leftLevel -= shift;

        if(log){
            console.log("double click right");
        }
        return;
    }

    click = true;
    setTimeout( doubleClickRemover, 400);
    
    var anim = $('#levelList').filter(':not(:animated)');
    if(anim.length == 0) return;


    var leftPosition = parseInt($("#levelList").css('left'));
    leftPosition = leftPosition + 170;
    if(leftLevel == 1){
        leftPosition -= 100;
        $("#levelList").animate({'left': ''+(leftPosition)+'px' }, 500, function() {
            $("#levelList").animate({'left': ''+(leftPosition - 70)+'px' }, 500);
        });
        return;
    }

    $("#level"+(leftLevel+3)).animate({'opacity':'0.0'}, 400);
    $("#level"+(leftLevel-1)).css({'opacity':'0.0'}).animate({'opacity':'1.0'}, 1000);

    var leftLevelBackup = leftLevel + 3;
    $("#levelList").animate({'left': ''+leftPosition+'px' }, 1000, function() {
        $("#levelList").children().css({'opacity':'1.0'});
    });
    leftLevel--;

    notMoving();
}

/**
* Chooser left arrow mouseover handler
*/
function chooserSliderLeftMouseOver(){

    $('#chooserArrowLeft').animate({ 'left' : '30px'}, 1000, function() {
        $('#chooserArrowLeft').animate({ 'left' : '39px'}, 100, function(){
            if(moveArrow){
                chooserSliderLeftMouseOver();
            }
        });
    });
}

/**
* Chooser left arrow mouseoout handler
*/
function chooserSliderLeftMouseOut(){

    moveArrow = false;
    $('#chooserArrowLeft').css({'left' : '39px'});
    $('#chooserArrowLeft').stop();
}

/**
* Chooser right arrow mouseover handler
*/
function chooserSliderRightMouseOver(){

    $('#chooserArrowRight').animate({ 'left' : '48px'}, 1000, function() {
        $('#chooserArrowRight').animate({ 'left' : '39px'}, 100, function(){ 
            if(moveArrow){
                chooserSliderRightMouseOver();
            }
        })
    });
}

/**
* Chooser left arrow mouseout handler
*/
function chooserSliderRightMouseOut(){

    moveArrow = false;
    $('#chooserArrowRight').css({'left' : '39px'});
    $('#chooserArrowRight').stop();
}

/**
* Binds event handlers for chooser left and right arrow
*/
function bindChooserSliders(){
    $("#chooserLeftButton").bind( 'click', chooserSliderRightClick );
    $("#chooserLeftButton").bind( 'mouseover', function(){
        moveArrow = true;
        chooserSliderLeftMouseOver();
    });
    $("#chooserLeftButton").bind( 'mouseout', chooserSliderLeftMouseOut );
    $("#chooserRightButton").bind( 'click', chooserSliderLeftClick );
    $("#chooserRightButton").bind( 'mouseover', function(){
        moveArrow = true;
        chooserSliderRightMouseOver();
    });
    $("#chooserRightButton").bind( 'mouseout', chooserSliderRightMouseOut );
}

/**
* Level ID parser
* @param ref Level div id
*/
function getID(ref){

    var levelID = ref.id;

    if(levelID.length == 6){
        ID = parseInt(levelID[5]);
    }
    else if(levelID.length == 7){
        var str = levelID[5] + levelID[6];
        ID = parseInt(str);
    }

    return ID;
}

/**
* Level click handler
*/
function levelClick(){
    
    moveAlongYAxis = false;

    var id = getID(this);

    if(id == 1){
        selectedLevel = "level215";
        newFlag = true;
        moveAlongYAxis = false;
    }
    
    else if(id == 2){

        selectedLevel = "level210";
        newFlag = true;
        moveAlongYAxis = false;
    }
    else if(id == 3){
        selectedLevel = "level209";
        newFlag = true;

    }
    
    else if(id == 4){
        selectedLevel = "level208";
        newFlag = true;
        moveAlongYAxis = false;
    }
    else if(id == 5){
        selectedLevel = "level218";
        newFlag = true;

        corrections = function(){
            maxCameraDistance = 26;
        }
    }
    else if(id == 6){

        selectedLevel = "level217";
        moveAlongYAxis = false;
        newFlag = true;
    }
    else if(id == 7){

        selectedLevel = "level301";
        moveAlongYAxis = false;
        newFlag = true;
        
    }
    else if(id == 8){

        selectedLevel = "level302";
        moveAlongYAxis = false;
        newFlag = true;
        
    }
    else if(id == 9){

        selectedLevel = "level322";
        moveAlongYAxis = false;
        newFlag = true;
    }
    else if(id == 10){
        selectedLevel = "level11";
        moveAlongYAxis = false;
        newFlag = true;
    }
      
    else if(id == 11){

        selectedLevel = "level0";
        newFlag = true;


        corrections = function(){
            maxCameraDistance = 22;
            minCameraDistance = 10;
            useLightmaps = true;
        }

    }  
    else if(id == 12){
        selectedLevel = "level344";
        newFlag = true;

        corrections = function(){
            logic.centerY = -55;
            maxCameraDistance = 20;
            minCameraDistance = 10;

            moveAlongYAxis = true;
        }
    }
    else if(id == 13){
        selectedLevel = "level22";
        newFlag = true;
        moveAlongYAxis = false;
    }   
    else if(id == 14){
        selectedLevel = "level1";
        moveAlongYAxis = false;
        newFlag = true;
    }
    else if(id == 15){

        selectedLevel = "level23";
        moveAlongYAxis = false;
        newFlag = true;
    }
    else if(id == 16){

        selectedLevel = "level28";
        moveAlongYAxis = false;
        newFlag = true;
        propadloUp = true;
    }
    else if(id == 17){

        selectedLevel = "level26";
        moveAlongYAxis = false;
        newFlag = true;
        
    }
    else if(id == 18){

        selectedLevel = "level5";
        moveAlongYAxis = false;
        newFlag = true;
    }
    else if(id == 19){

        selectedLevel = "level329";
        moveAlongYAxis = false;
        newFlag = true;
        
    }
    else if(id == 20){
        selectedLevel = "level21";
        moveAlongYAxis = false;
        newFlag = true;
    }

    reloadLevel();

    if(selectedScreen != "webgl-canvas"){
        $("#play").click();
    }

    // Close level chooser
    $("#chooserButton").click();
}

/**
* Rotates selected level
* @param id Which level to rotate
*/
function rotateLevelFunc(id){

    var anim = $("#level"+id).filter(':not(:animated)');

    if(rotateLevelBool){

        var leftRand = -((Math.random() * 5 + 5)) + "deg";
        var rightRand = ((Math.random() * 5 + 5)) + "deg";
        var timeRandomLeft = ((Math.random()) * 200) + 200;
        var timeRandomRight = ((Math.random()) * 200) + 200;
        $("#level"+id)
        .animate({'rotate': leftRand}, timeRandomLeft, function(){
            var thatID = id;
            rotateLevelFunc(thatID);
        })
        .animate({'rotate': rightRand}, timeRandomRight, function(){
            var thatID = id;
            rotateLevelFunc(thatID);
        }); 
    }
}

/**
* Level mouse over event handler
*/
function levelMouseOver(){

    $("#levelList").children().stop(true, true);
    $("#chooserLeftButton").stop(true, true);
    $("#chooserRightButton").stop(true, true);

    var levelID = this.id;
    var ID;
    if(levelID.length == 6){
        ID = parseInt(levelID[5]);
    }
    else if(levelID.length == 7){
        var str = levelID[5] + levelID[6];
        ID = parseInt(str);
    }

    var i = 1;
    for(i; i <= shownLevels - 1; i++){

        $("#level"+(ID - i)).animate({'left': '-10px'}, 250);
        $("#level"+(ID + i)).animate({'left': '10px'}, 250);    
    }



    rotateLevelBool = true;
    rotateLevelFunc(ID);
}

/**
* Level mouseout event handler
*/
function levelMouseOut(){

    $(this).stop(true, false);
    var levelID = this.id;
    var ID;
    if(levelID.length == 6){
        ID = parseInt(levelID[5]);
    }
    else if(levelID.length == 7){
        var str = levelID[5] + levelID[6];
        ID = parseInt(str);
    }

    var i = 1;
    for(i; i <= shownLevels - 1; i++){

        $("#level"+(ID - i)).stop().css({'left': '0px'});
        $("#level"+(ID + i)).stop().css({'left': '0px'});   
    }

    rotateLevel = false;
    $(this).rotate('0deg');
}

/**
* Binds level mouse events
*/
function bindLevels(){

    $(".level").bind( 'click', levelClick );
    $(".level").bind( 'mouseover', levelMouseOver );
    $(".level").bind( 'mouseout', levelMouseOut );
    $(".level").css( {'cursor':'pointer'});
}
 

/**
* Sets current audio track
* @param audioIndex Index of audio file to be played
*/
function audioSetTrack(audioIndex){

    audioStop();

    if(log){
        console.log("Playing track on index "+ audioIndex);
    }

    $(audioAPIDiv).jPlayer("destroy");
    
    $(audioAPIDiv).jPlayer({
        ready: function (){
            $(this).jPlayer("setMedia", {
                oga: audioPath + audioFiles[audioIndex] + audioFileType
            });
        },
        supplied: "oga"
    });
}

/**
* Starts audio player loaded file
*/
function audioPlay(){

    $(audioAPIDiv).jPlayer("play");
    audioPlaying = true;
}

/**
* Stops audio player loaded file
*/
function audioStop(){

    $(audioAPIDiv).jPlayer("stop");
}

/**
* Pauses audio player loaded file
*/
function audioPause(){

    $(audioAPIDiv).jPlayer("pause");
    audioPlaying = false;
}

/**
* Mutes audio player loaded file
*/
function audioMute(){

    $(audioAPIDiv).jPlayer("mute");
}

/**
* Unmutes audio player loaded file
*/
function audioUnMute(){

    $(audioAPIDiv).jPlayer("unmute");
}

/**
* Sets volume level of played audio file
* @param volumeLevel Volume 1-100
*/
function audioSetVolume(volumeLevel){

    var audioVolumeLevel;
    if(volumeLevel < 0){
        audioVolumeLevel = 0;
    }
    else if(volumeLevel >= 1){
        audioVolumeLevel = 1;
    }
    else{
        audioVolumeLevel = volumeLevel;
    }


    $(audioAPIDiv).jPlayer("volume", audioVolumeLevel);
}

/**
* Loads next track into audio player
*/
function audioSetNextTrack(){

    ++audioPlayingIndex;
    if(audioPlayingIndex >= audioFiles.length){
        audioPlayingIndex = 0;
    }

    audioSetTrack(audioPlayingIndex);
}

/**
* Loads previous track into audio player
*/
function audioSetPreviousTrack(){

    --audioPlayingIndex;
    if(audioPlayingIndex < 0){
        audioPlayingIndex = audioFiles.length - 1;
    }

    audioSetTrack(audioPlayingIndex);
}

/**
* Audio player buttons mouseover animation
*/
function audioMouseOverAnimation(id){

    $("#"+id).stop();
    $("#"+id).animate({'opacity' : '1.0'}, 400);

}

/**
* Audio player mouseout animation
*/
function audioMouseOutAnimation(id){

    $("#"+id).stop();
    $("#"+id).animate({'opacity' : '0.5'}, 400);

}

/**
* Audio player previous click action
*/
function audioPrewClick(){

    if(log){
        console.log("audioPrewClick");
    }
    audioSetPreviousTrack();

    if(audioPlaying){
        setTimeout(audioPlay, 500);
    }
}

/**
* Audio player previous button mouse over event handler
*/
function audioPrewMouseOver(){
    
    if(log){
        console.log("audioPrewMouseOver");
    }
    audioMouseOverAnimation(this.id);

}

/**
* Audio player previous button mouse out event handler
*/
function audioPrewMouseOut(){

    if(log){
        console.log("audioPrewMouseOut");
    }

    audioMouseOutAnimation(this.id);

}

/**
* Audio player play button mouse click event handler
*/
function audioPlayPauseClick(){

    if(log){
        console.log("audioPlayPauseClick");
    }

    if(!audioPlaying){

        audioPlay();
    }
    else{
        $(this).stop().animate({'background-image' : 'url(./img/playtrack.png)'}, 400);
        audioPause();
    }

}

/**
* Audio player play button mouse over event handler
*/
function audioPlayPauseMouseOver(){

    if(log){
        console.log("audioPlayPauseMouseOver");
    }   

    if(audioPlaying){
        $(this).css({'background-image' : 'url(./img/pausetrack.png)'});
    }
    else{
        $(this).css({'background-image' : 'url(./img/playtrack.png)'});
    }
    audioMouseOverAnimation(this.id);
}

/**
* Audio player play button mouse out event handler
*/
function audioPlayPauseMouseOut(){

    if(log){
        console.log("audioPlayPauseMouseOut");
    }

    if(audioPlaying){
        $(this).css({'background-image' : 'url(./img/playtrack.png)'});
    }
    else{
        $(this).css({'background-image' : 'url(./img/pausetrack.png)'});
    }
    audioMouseOutAnimation(this.id);
}

/**
* Audio player next button mouse click event handler
*/
function audioNextClick(){

    if(log){
        console.log("audioNextClick");
    }
    audioSetNextTrack();

    if(audioPlaying){
        setTimeout(audioPlay, 500);
    }
}

/**
* Audio player next button mouse over event handler
*/
function audioNextMouseOver(){

    if(log){
        console.log("audioNextMouseOver");
    }
    audioMouseOverAnimation(this.id);
}

/**
* Audio player next button mouse out event handler
*/
function audioNextMouseOut(){

    if(log){
        console.log("audioNextMouseOut");
    }
    audioMouseOutAnimation(this.id);
}

/**
* Binds audio player event handlers
*/
function audioBindPlayerUI(){

    audioSetTrack(audioPlayingIndex);

    $(audioPrewDiv).bind('click', audioPrewClick );
    $(audioPrewDiv).bind('mouseover', audioPrewMouseOver );
    $(audioPrewDiv).bind('mouseout', audioPrewMouseOut );
    $(audioPlayPauseDiv).bind('click', audioPlayPauseClick );
    $(audioPlayPauseDiv).bind('mouseover', audioPlayPauseMouseOver );
    $(audioPlayPauseDiv).bind('mouseout', audioPlayPauseMouseOut );
    $(audioNextDiv).bind('click', audioNextClick );
    $(audioNextDiv).bind('mouseover', audioNextMouseOver );
    $(audioNextDiv).bind('mouseout', audioNextMouseOut );

    $(audioAPIDiv).bind($.jPlayer.event.ended, function(event) { 
        audioSetNextTrack();

        setTimeout(audioPlay, 1000);
     });

}

/**
* Icon mouse over event handler
*/
function iconMouseOver(event){

    if(log){
        console.log("Icon mouse over");
    }
    $(this).stop();
    $(this).animate({'opacity' : '1.0'}, 400);  
}

/**
* Icon mouse out event handler
*/
function iconMouseOut(event){

    if(log){
        console.log("Icon mouse out");
    }

    $(this).stop();
    $(this).animate({'opacity' : '0.2'}, 400);  

}

/**
* Previous control screen mouse click event handler
*/
function prevControlScreenClick(){

    var currentLeft = parseInt($("#controlScreens").css('left'));

    if(log){
        console.log(currentLeft);
    }

    if(currentControlsScreen == 1) return;
    else{
        $("#controlScreens").stop().animate({'left' : (currentLeft + windowWidth) + 'px'}, 400);
        currentControlsScreen--;
    }
    if(currentControlsScreen == 1){
        $("#prevControlScreen").css({'visibility' : 'hidden'});
    }
    if(currentControlsScreen < controlsScreenCount){
        $("#nextControlScreen").css({'visibility' : 'visible'});
    }

}

/**
* Next control screen mouse click event handler
*/
function nextControlScreenClick(){

    var currentLeft = parseInt($("#controlScreens").css('left'));

    if(log){
        console.log(currentLeft);
    }

    if(currentControlsScreen == controlsScreenCount) return;
    else{
        $("#controlScreens").stop().animate({'left' : (currentLeft - windowWidth)+'px'}, 400);
        currentControlsScreen++;
    }
    if(currentControlsScreen == controlsScreenCount){
        $("#nextControlScreen").css({'visibility' : 'hidden'});
    }
    if(currentControlsScreen > 1){
        $("#prevControlScreen").css({'visibility' : 'visible'});
    }
}

/**
* Previous howto screen mouse click event handler
*/
function prevHowtoScreenClick(){

    var currentLeft = parseInt($("#howtoScreens").css('left'));

    if(log){
        console.log(currentLeft);
    }

    if(currentHowtoScreen == 1) return;
    else{
        $("#howtoScreens").stop().animate({'left' : (currentLeft + windowWidth) + 'px'}, 400);
        currentHowtoScreen--;
    }
    if(currentHowtoScreen == 1){
        $("#prevHowtoScreen").css({'visibility' : 'hidden'});
    }
    if(currentHowtoScreen < howtoScreenCount){
        $("#nextHowtoScreen").css({'visibility' : 'visible'});
    }
}

/**
* Next howto screen mouse click event handler
*/
function nextHowtoScreenClick(){

    var currentLeft = parseInt($("#howtoScreens").css('left'));

    if(log){
        console.log(currentLeft);
    }

    if(currentHowtoScreen == howtoScreenCount) return;
    else{
        $("#howtoScreens").stop().animate({'left' : (currentLeft - windowWidth) + 'px'}, 400);
        currentHowtoScreen++;
    }
    if(currentHowtoScreen == howtoScreenCount){
        $("#nextHowtoScreen").css({'visibility' : 'hidden'});
    }
    if(currentHowtoScreen > 1){
        $("#prevHowtoScreen").css({'visibility' : 'visible'});
    }

}

/**
* Bind icon event handlers
*/
function bindIcons(){

    $(".icon").bind('mouseover', iconMouseOver);
    $(".icon").bind('mouseout', iconMouseOut);

    $("#prevControlScreen").bind('click', prevControlScreenClick);
    $("#prevControlScreen").css({'visibility' : 'hidden'});
    $("#nextControlScreen").bind('click', nextControlScreenClick);

    $("#prevHowtoScreen").bind('click', prevHowtoScreenClick);
    $("#prevHowtoScreen").css({'visibility' : 'hidden'});
    $("#nextHowtoScreen").bind('click', nextHowtoScreenClick);
}