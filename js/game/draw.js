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
 * This file contains several functions used for Berusky 2 WebGL rendering.
 *
 */

/**
* This function is called in every frame.
* Used only when browser window visible
*/
function tick() {

    // Plan next tick
    requestAnimFrame(tick);

    // Handle mouse pointer
    handlePointer();

    // Draw next frame
    drawScene();

    // Do animation
    //animate();
}

/**
* This function is used for rendering scene throught WebGL
* 1. set mvMatrix
* 2. set frustrum
* 3. draw floor
* 4. draw static objects
* 5. draw dynamic objects
* 6. draw blended objects
*/
function drawScene() {
    
    if(!draw) return;

    // Array for blended objects
    var blendedObjects = [];

    // FPS counter
    fps++;

    // Set viewport    
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    // Clear buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set perspective
    mat4.perspective(projectionAngle, gl.viewportWidth / gl.viewportHeight, 0.1, 400.0, pMatrix);
    
    // Camera Matrix
    var cameraMatrix = mat4.create();
    mat4.identity(cameraMatrix);

    // Model-View Matrix
    var mvMatrixStatic = mat4.create();
    mat4.identity(mvMatrixStatic);

    //
    // Set camera matrix
    //

    // Center camera - rotation and elevation on
    if(cameraMode == "centerCamera" || logic.gameOver){
        
        var Y = 0;
        if(moveAlongYAxis){
            Y = logic.centerY;
        }

        // X, Z translation
        mat4.translate(cameraMatrix, [logic.centerX, Y, logic.centerZ]);  

        // Rotation
        mat4.rotate(cameraMatrix, degToRad(-currentRotation), [0, 1, 0]);

        // Elevation
        if(useTopCamera){
            mat4.rotate(cameraMatrix, degToRad(-90), [1, 0, 0]);
        }
        else{
            mat4.rotate(cameraMatrix, degToRad(-currentElevation), [1, 0, 0]);  
        }

        // Distance from scene
        mat4.translate(cameraMatrix, [0, 0, distanceFromScene]);

    }

    // FPS Camera - rotation, elevation off
    else if(cameraMode == "fpsCamera"){

        var bugPosition = logic.dynamicItems[logic.selectedBugID].position;

        // Translate camera to bugs position
        mat4.translate(cameraMatrix, [ -logic.startX - (bugPosition[0] * logic.itemSize + 1),  
                                        logic.startY + (bugPosition[2] + 0.7), 
                                        logic.startZ + (bugPosition[1] * logic.itemSize + 1)]);
        
        // No distance
        var distance = 0;
        var rotation;

        // Camera rotation according to bugs rotation
        switch(logic.dynamicItems[logic.selectedBugID].direction){

            case "up":
                rotation = 90;
                break;
            case "right":
                rotation = 180;
                break;
            case "down":
                rotation = 270;
                break;
            case "left":
                rotation = 360;
                break;
        }

        // Hack :)
        rotation += 180;

        // Prepared for FPS camera rotation
        /*if(useRotationInFPS){
            mat4.rotate(cameraMatrix, degToRad(-currentRotation), [0, 1, 0]);
            mat4.rotate(cameraMatrix, degToRad(-currentElevation), [1, 0, 0]);  
            mat4.translate(cameraMatrix, [0, 0, distance]); 
        }*/
        //else{
            mat4.rotate(cameraMatrix, degToRad(-rotation), [0, 1, 0]);
            mat4.rotate(cameraMatrix, degToRad(-15), [1, 0, 0]);  
            mat4.translate(cameraMatrix, [0, 0, distance]);
        //}

    }

    // Follow camera - rotation, elevation on
    else if(cameraMode == "followCamera"){

        var bugPosition = logic.dynamicItems[logic.selectedBugID].position;

        // Translate to bugs position
        mat4.translate(cameraMatrix, [ -logic.startX - (bugPosition[0] * logic.itemSize) - 1,  
                                        logic.startY, 
                                        logic.startZ + (bugPosition[1] * logic.itemSize) + 1]);

        // Use current rotation
        mat4.rotate(cameraMatrix, degToRad(-currentRotation), [0, 1, 0]);

        // Use current elevation
        if(useTopCamera){
            mat4.rotate(cameraMatrix, degToRad(-90), [1, 0, 0]);
        }
        else{
            mat4.rotate(cameraMatrix, degToRad(-currentElevation), [1, 0, 0]);  
        }

        // Move from scene
        mat4.translate(cameraMatrix, [0, 0, distanceFromScene]);
    }

    // Behind camera - rotation, elevation off
    else if(cameraMode == "behindCamera"){

        var bugPosition = logic.dynamicItems[logic.selectedBugID].position;

        // Translate to bugs position
        mat4.translate(cameraMatrix, [ -logic.startX - (bugPosition[0] * logic.itemSize + 1),  
                                        logic.startY + (bugPosition[2]), 
                                        logic.startZ + (bugPosition[1] * logic.itemSize + 1)]);
        
        var distance = 3;
        var rotation;

        // Camera rotation according to bug current rotation
        switch(logic.dynamicItems[logic.selectedBugID].direction){

            case "up":
                rotation = 90;
                break;
            case "right":
                rotation = 180;
                break;
            case "down":
                rotation = 270;
                break;
            case "left":
                rotation = 360;
                break;
        }

        // HACK :D
        rotation += 180;

        // Make transformations
        mat4.rotate(cameraMatrix, degToRad(-rotation), [0, 1, 0]);
        mat4.rotate(cameraMatrix, degToRad(-20), [1, 0, 0]);  
        mat4.translate(cameraMatrix, [0, 0, distance]); 
    }
    
    // Set Model-View matrix
    mat4.identity(mvMatrix);
    mat4.inverse(cameraMatrix, cameraMatrix);
    mat4.multiply(mvMatrix, cameraMatrix, mvMatrix);
    mat4.multiply(mvMatrix, mvMatrixStatic, mvMatrixStatic);

    //
    // Frustrum culling
    // Not working yet
    //
    if(useClipping){

        var clip = [];

        /* Combine the two matrices (multiply projection by modelview) */
        clip[ 0] = mvMatrix[ 0] * pMatrix[ 0] + mvMatrix[ 1] * pMatrix[ 4] + mvMatrix[ 2] * pMatrix[ 8] + mvMatrix[ 3] * pMatrix[12];
        clip[ 1] = mvMatrix[ 0] * pMatrix[ 1] + mvMatrix[ 1] * pMatrix[ 5] + mvMatrix[ 2] * pMatrix[ 9] + mvMatrix[ 3] * pMatrix[13];
        clip[ 2] = mvMatrix[ 0] * pMatrix[ 2] + mvMatrix[ 1] * pMatrix[ 6] + mvMatrix[ 2] * pMatrix[10] + mvMatrix[ 3] * pMatrix[14];
        clip[ 3] = mvMatrix[ 0] * pMatrix[ 3] + mvMatrix[ 1] * pMatrix[ 7] + mvMatrix[ 2] * pMatrix[11] + mvMatrix[ 3] * pMatrix[15];

        clip[ 4] = mvMatrix[ 4] * pMatrix[ 0] + mvMatrix[ 5] * pMatrix[ 4] + mvMatrix[ 6] * pMatrix[ 8] + mvMatrix[ 7] * pMatrix[12];
        clip[ 5] = mvMatrix[ 4] * pMatrix[ 1] + mvMatrix[ 5] * pMatrix[ 5] + mvMatrix[ 6] * pMatrix[ 9] + mvMatrix[ 7] * pMatrix[13];
        clip[ 6] = mvMatrix[ 4] * pMatrix[ 2] + mvMatrix[ 5] * pMatrix[ 6] + mvMatrix[ 6] * pMatrix[10] + mvMatrix[ 7] * pMatrix[14];
        clip[ 7] = mvMatrix[ 4] * pMatrix[ 3] + mvMatrix[ 5] * pMatrix[ 7] + mvMatrix[ 6] * pMatrix[11] + mvMatrix[ 7] * pMatrix[15];

        clip[ 8] = mvMatrix[ 8] * pMatrix[ 0] + mvMatrix[ 9] * pMatrix[ 4] + mvMatrix[10] * pMatrix[ 8] + mvMatrix[11] * pMatrix[12];
        clip[ 9] = mvMatrix[ 8] * pMatrix[ 1] + mvMatrix[ 9] * pMatrix[ 5] + mvMatrix[10] * pMatrix[ 9] + mvMatrix[11] * pMatrix[13];
        clip[10] = mvMatrix[ 8] * pMatrix[ 2] + mvMatrix[ 9] * pMatrix[ 6] + mvMatrix[10] * pMatrix[10] + mvMatrix[11] * pMatrix[14];
        clip[11] = mvMatrix[ 8] * pMatrix[ 3] + mvMatrix[ 9] * pMatrix[ 7] + mvMatrix[10] * pMatrix[11] + mvMatrix[11] * pMatrix[15];

        clip[12] = mvMatrix[12] * pMatrix[ 0] + mvMatrix[13] * pMatrix[ 4] + mvMatrix[14] * pMatrix[ 8] + mvMatrix[15] * pMatrix[12];
        clip[13] = mvMatrix[12] * pMatrix[ 1] + mvMatrix[13] * pMatrix[ 5] + mvMatrix[14] * pMatrix[ 9] + mvMatrix[15] * pMatrix[13];
        clip[14] = mvMatrix[12] * pMatrix[ 2] + mvMatrix[13] * pMatrix[ 6] + mvMatrix[14] * pMatrix[10] + mvMatrix[15] * pMatrix[14];
        clip[15] = mvMatrix[12] * pMatrix[ 3] + mvMatrix[13] * pMatrix[ 7] + mvMatrix[14] * pMatrix[11] + mvMatrix[15] * pMatrix[15];

        var frustum = [];
        /* Extract the numbers for the RIGHT plane */
        frustum[0] = [];
        frustum[0][0] = clip[ 3] - clip[ 0];
        frustum[0][1] = clip[ 7] - clip[ 4];
        frustum[0][2] = clip[11] - clip[ 8];
        frustum[0][3] = clip[15] - clip[12];

        if(normalizeFrustum){

            /* Normalize the result */
            var t = Math.sqrt( frustum[0][0] * frustum[0][0] + frustum[0][1] * frustum[0][1] + frustum[0][2] * frustum[0][2] );
            frustum[0][0] /= t;
            frustum[0][1] /= t;
            frustum[0][2] /= t;
            frustum[0][3] /= t;
        }

        /* Extract the numbers for the LEFT plane */
        frustum[1] = [];
        frustum[1][0] = clip[ 3] + clip[ 0];
        frustum[1][1] = clip[ 7] + clip[ 4];
        frustum[1][2] = clip[11] + clip[ 8];
        frustum[1][3] = clip[15] + clip[12];

        if(normalizeFrustum){

            /* Normalize the result */
            t = Math.sqrt( frustum[1][0] * frustum[1][0] + frustum[1][1] * frustum[1][1] + frustum[1][2] * frustum[1][2] );
            frustum[1][0] /= t;
            frustum[1][1] /= t;
            frustum[1][2] /= t;
            frustum[1][3] /= t;
        }

        /* Extract the BOTTOM plane */
        frustum[2] = [];
        frustum[2][0] = clip[ 3] + clip[ 1];
        frustum[2][1] = clip[ 7] + clip[ 5];
        frustum[2][2] = clip[11] + clip[ 9];
        frustum[2][3] = clip[15] + clip[13];

        if(normalizeFrustum){

            /* Normalize the result */
            t = Math.sqrt( frustum[2][0] * frustum[2][0] + frustum[2][1] * frustum[2][1] + frustum[2][2] * frustum[2][2] );
            frustum[2][0] /= t;
            frustum[2][1] /= t;
            frustum[2][2] /= t;
            frustum[2][3] /= t;
        }

        /* Extract the TOP plane */
        frustum[3] = [];
        frustum[3][0] = clip[ 3] - clip[ 1];
        frustum[3][1] = clip[ 7] - clip[ 5];
        frustum[3][2] = clip[11] - clip[ 9];
        frustum[3][3] = clip[15] - clip[13];

        if(normalizeFrustum){

            /* Normalize the result */
            t = Math.sqrt( frustum[3][0] * frustum[3][0] + frustum[3][1] * frustum[3][1] + frustum[3][2] * frustum[3][2] );
            frustum[3][0] /= t;
            frustum[3][1] /= t;
            frustum[3][2] /= t;
            frustum[3][3] /= t;
        }

        /* Extract the FAR plane */
        frustum[4] = [];
        frustum[4][0] = clip[ 3] - clip[ 2];
        frustum[4][1] = clip[ 7] - clip[ 6];
        frustum[4][2] = clip[11] - clip[10];
        frustum[4][3] = clip[15] - clip[14];

        if(normalizeFrustum){

            /* Normalize the result */
            t = Math.sqrt( frustum[4][0] * frustum[4][0] + frustum[4][1] * frustum[4][1] + frustum[4][2] * frustum[4][2] );
            frustum[4][0] /= t;
            frustum[4][1] /= t;
            frustum[4][2] /= t;
            frustum[4][3] /= t;
        }

        /* Extract the NEAR plane */
        frustum[5] = [];
        frustum[5][0] = clip[ 3] + clip[ 2];
        frustum[5][1] = clip[ 7] + clip[ 6];
        frustum[5][2] = clip[11] + clip[10];
        frustum[5][3] = clip[15] + clip[14];

        if(normalizeFrustum){

            /* Normalize the result */
            t = Math.sqrt( frustum[5][0] * frustum[5][0] + frustum[5][1] * frustum[5][1] + frustum[5][2] * frustum[5][2] );
            frustum[5][0] /= t;
            frustum[5][1] /= t;
            frustum[5][2] /= t;
            frustum[5][3] /= t;
        }
    }

    // Set specular
    gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, useSpecular);
    gl.uniform1f(shaderProgram.materialShininessUniform, 30);

    // Set lightning
    gl.uniform1i(shaderProgram.useLightingUniform, useLightning);

    //
    // Draw floor
    //
    if(drawOnlyGameField && drawFloor && !useOpacity && !drawJustBug){

        mvPushMatrix();

        // Translate floor
        mat4.translate(mvMatrix, [-(logic.startX + (logic.itemSize * logic.sizeX) - 1), 
                                    logic.startY, 
                                   (logic.startZ + logic.sizeZ * logic.itemSize - 1)]);

        // Load vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, logic.floorPlaneBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                               logic.floorPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Load texture coords
        gl.bindBuffer(gl.ARRAY_BUFFER, logic.floorPlaneTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 
                               logic.floorPlaneTextureCoordBuffer.itemSize, 
                               gl.FLOAT, false, 0, 0);

        // Load texture
        gl.uniform1i(shaderProgram.useTexturesUniform, true);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, materials["floor_texture"].textures[0]);
        gl.uniform1i(shaderProgram.samplerUniform, 0);       
        
        // Set Matrices
        setMatrixUniforms();
        
        // Draw floor
        if(renderMode == "triangles"){
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, logic.floorPlaneBuffer.numItems);
        }
        else if(renderMode == "points"){
            gl.drawArrays(gl.POINTS, 0, logic.floorPlaneBuffer.numItems);
        }
        else if(renderMode == "lineStrip"){
            gl.drawArrays(gl.LINE_STRIP, 0, logic.floorPlaneBuffer.numItems);
        }

        mvPopMatrix();
    }
    
    //
    // DRAW STATIC
    //
    for (staticObject in staticObjects) {
        
        if(drawJustBug){
            continue;
        }

        // FOR LIGHTMAPS
        if(staticObjects[staticObject].isItPoly){
            //gl.uniform1i(shaderProgram.useLightingUniform, true);
        }
        else{
            //gl.uniform1i(shaderProgram.useLightingUniform, false);
        }

        // Draw only game field
        if(drawOnlyGameField && !staticObjects[staticObject].gameField){

            continue;
        }

        // Drawing models from container
        for (object in staticObjects[staticObject].objects) {

            // Transformed center of model
            var newCenter = [0, 0, 0];

            // Transform center according to bounding box
            mat4.multiplyVec3(mvMatrix, staticObjects[staticObject].objects[object].center, newCenter);

            // Frustrum culling
            if(useClipping){

                var clipped = false;
                
                var thisObject = staticObjects[staticObject].objects[object];
                var envelope = thisObject.envelopePoints;

                // Is this model inside clipping frustrum?
                var outsidePoints = 0;
                var i;
                for( i = 0; i < 8; i++){

                    var p;
                    for( p = 0; p < 6; p++ ){

                        var testedVector = [0, 0, 0];
                        mat4.multiplyVec3(mvMatrix, envelope[i], testedVector);
                        if( frustum[p][0] * testedVector[0] 
                            + frustum[p][1] * testedVector[1] 
                            + frustum[p][2] * testedVector[2] 
                            + frustum[p][3] <= clippingThreshold ){

                            // Point outside
                            outsidePoints++;
                            
                        }
                    }   

                }

                // If all point of bounding box outside clipping frustrum,
                // there is no reason to draw this model
                if(outsidePoints >= envelope.length){

                    clippedObjects++;
                    continue;
                }
            }

            // Blending enabled
            if(useOpacity && staticObjects[staticObject].gameField){
                
                // Add model into array and continue
                blendedObjects.push(new BlendedObject(staticObjects[staticObject].objects[object], 
                                                      newCenter[2], 
                                                      object, 
                                                      true));
                continue;
            }

            // Set pipeline
            gl.disable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
            gl.uniform1f(shaderProgram.alphaUniform, 1);

            // Load vertices
            gl.bindBuffer(gl.ARRAY_BUFFER, staticObjects[staticObject].objects[object].vertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                                   staticObjects[staticObject].objects[object].vertexPositionBuffer.itemSize, 
                                   gl.FLOAT, false, 0, 0);

            // Load texture coords
            gl.bindBuffer(gl.ARRAY_BUFFER, staticObjects[staticObject].objects[object].vertexTextureCoordBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 
                                   staticObjects[staticObject].objects[object].vertexTextureCoordBuffer.itemSize, 
                                   gl.FLOAT, false, 0, 0);

            // If textures enabled, load textures
            if(useTextures){

                gl.uniform1i(shaderProgram.useTexturesUniform, true);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, materials[staticObjects[staticObject].objects[object].material].textures[0]);
                gl.uniform1i(shaderProgram.samplerUniform, 0);
            }
            else{

                gl.uniform1i(shaderProgram.useTexturesUniform, false);
            }
            
            // If lightmaps enabled, load lightmaps
            if(useLightmaps && staticObjects[staticObject].isItPoly){
                
                gl.uniform1i(shaderProgram.useLightmapUniform, 1);

                gl.bindBuffer(gl.ARRAY_BUFFER, staticObjects[staticObject].objects[object].vertexLightmapCoordBuffer);
                gl.vertexAttribPointer(shaderProgram.lightmapCoordAttribute, 
                                       staticObjects[staticObject].objects[object].vertexLightmapCoordBuffer.itemSize, 
                                       gl.FLOAT, false, 0, 0);
                
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, lightmaps[staticObjects[staticObject].polyID].lightmap );
                gl.uniform1i(shaderProgram.lightmapSamplerUniform, 1);
            }

            // Load normals
            gl.bindBuffer(gl.ARRAY_BUFFER, staticObjects[staticObject].objects[object].vertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, staticObjects[staticObject].objects[object].vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            // Load indices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, staticObjects[staticObject].objects[object].vertexIndexBuffer);

            // Set matrices
            setMatrixUniforms();

            // Draw model according to selected mode
            if(renderMode == "triangles"){
                gl.drawElements(gl.TRIANGLES, staticObjects[staticObject].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "points"){
                gl.drawElements(gl.POINTS, staticObjects[staticObject].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "lineStrip"){
                gl.drawElements(gl.LINE_STRIP, staticObjects[staticObject].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "lineLoop"){
                gl.drawElements(gl.LINE_LOOP, staticObjects[staticObject].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "lines"){
                gl.drawElements(gl.LINES, staticObjects[staticObject].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "triangleStrip"){
                gl.drawElements(gl.TRIANGLE_STRIP, staticObjects[staticObject].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "triangleFan"){
                gl.drawElements(gl.TRIANGLE_FAN, staticObjects[staticObject].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "quadStrip"){
                gl.drawElements(gl.QUAD_STRIP, staticObjects[staticObject].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "quads"){
                gl.drawElements(gl.QUADS, staticObjects[staticObject].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "polygon"){
                gl.drawElements(gl.POLYGON, staticObjects[staticObject].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else{
                gl.drawElements(gl.TRIANGLES, staticObjects[staticObject].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }

            // Lightmaps off
            gl.uniform1i(shaderProgram.useLightmapUniform, 0);
            gl.uniform1i(shaderProgram.lightmapSamplerUniform, 0);
        }
    }
    
    //
    // DRAW DYNAMIC OBJECTS
    //
    for (dynamic in dynamicObjects) {

        // Drawing only game field
        if(drawOnlyGameField && !dynamicObjects[dynamic].gameField){
            continue;
        }

        // Bug only
        if(drawJustBug){

            if(!logic.dynamicItems[dynamic]) continue;
            else if(logic.dynamicItems[dynamic].itemClass != 1) continue;
        }

        // Drawing models of this envelope
        for (object in dynamicObjects[dynamic].objects) {

            // Setting matrices
            setMatrixUniforms();

            // Center of bounding box
            var newCenter = [0, 0, 0];

            // Transform center according to model-view matrix
            mat4.multiplyVec3(mvMatrix, dynamicObjects[dynamic].objects[object].center, 
                              newCenter);

            // Frustrum culling
            if(useClipping){
                
                var clipped = false;
                
                var thisObject = dynamicObjects[dynamic].objects[object];
                var envelope = thisObject.envelopePoints;

                // Check whether points of bounding box are inside frustrum
                var outsidePoints = 0;
                var i;
                for( i = 0; i < 8; i++){

                    var p;
                    for( p = 0; p < 6; p++ ){

                        var testedVector = [0, 0, 0];
                        mat4.multiplyVec3(mvMatrix, envelope[i], testedVector);

                        if( frustum[p][0] * testedVector[0] + 
                            frustum[p][1] * testedVector[1] + 
                            frustum[p][2] * testedVector[2] + 
                            frustum[p][3] <= clippingThreshold ){

                            // Point of bounding box outside frustrum
                            outsidePoints++;
                            
                        }
                    }   

                }

                // All points outside?
                if(outsidePoints >= envelope.length){

                    clippedObjects++;
                    continue;

                }
            }

            // Blending
            if(useOpacity && staticObjects[staticObject].gameField && logic.dynamicItems[dynamic].itemClass != 1){

                // Draw this model later
                blendedObjects.push(new BlendedObject(dynamicObjects[dynamic].objects[object], 
                                                      newCenter[2], dynamic, false));
                continue;
            }


            // Transparent material?
            try{

                // Check material
                if((materials[dynamicObjects[dynamic].objects[object].material].blending == true) && 
                    (materials[dynamicObjects[dynamic].objects[object].material] != "(null)" )){

                    // Draw this model later
                    blendedObjects.push(new BlendedObject(dynamicObjects[dynamic].objects[object], 
                                                          newCenter[2], dynamic, false));
                    continue;
                } 
            }
            catch(error){

            }

            // Set pipeline
            gl.disable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
            gl.uniform1f(shaderProgram.alphaUniform, 1);

            // Save mvMatrix - IMPORTANT
            mvPushMatrix();

            // Translate model according to logic representation
            try {

                var position = logic.dynamicItems[dynamic].position;
                mat4.translate(mvMatrix, [-((logic.startX + 1) + logic.itemSize * position[0] + xAdjust), 
                                           (logic.startY + (position[2] - 1) + yAdjust), 
                                           ((logic.startZ + 1) + position[1] * logic.itemSize + zAdjust)]);

                // If direction set, rotate
                if (logic.dynamicItems[dynamic].direction != "left") {

                    if (logic.dynamicItems[dynamic].direction == "up") {

                        mat4.rotate(mvMatrix, degToRad(-90), [0, 1, 0]);
                    } 
                    else if (logic.dynamicItems[dynamic].direction == "right") {

                        mat4.rotate(mvMatrix, degToRad(-180), [0, 1, 0]);
                    } 
                    else if (logic.dynamicItems[dynamic].direction == "down") {

                        mat4.rotate(mvMatrix, degToRad(90), [0, 1, 0]);
                    }
                }
                
                // Sinking floor adjustement
                if(propadloUp && logic.dynamicItems[dynamic].itemClass == 15){
                    mat4.translate(mvMatrix, [0, logic.itemSize, 0]);
                }

                // Do not draw bug, when fps camera selected
                if(cameraMode == "fpsCamera" && logic.dynamicItems[dynamic].itemClass == 1){

                    mvPopMatrix();
                    continue;
                }

            } catch (error) {}

            // Load vertices
            gl.bindBuffer(gl.ARRAY_BUFFER, dynamicObjects[dynamic].objects[object].vertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                                   dynamicObjects[dynamic].objects[object].vertexPositionBuffer.itemSize, 
                                   gl.FLOAT, false, 0, 0);

            // Load texture coords
            gl.bindBuffer(gl.ARRAY_BUFFER, dynamicObjects[dynamic].objects[object].vertexTextureCoordBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 
                                   dynamicObjects[dynamic].objects[object].vertexTextureCoordBuffer.itemSize, 
                                   gl.FLOAT, false, 0, 0);

            // Load textures
            if (dynamicObjects[dynamic].objects[object].material != "(null)" && 
                dynamicObjects[dynamic].id != logic.selectedObjectID && useTextures) {

                gl.uniform1i(shaderProgram.useTexturesUniform, true);
                gl.activeTexture(gl.TEXTURE0);

                // Red bug
                if(paintSelectedBugRed && dynamicObjects[dynamic].id == logic.selectedBugID){

                    gl.bindTexture(gl.TEXTURE_2D, materials["beruska_chosen"].textures[0]); 
                }
                else{

                    gl.bindTexture(gl.TEXTURE_2D, materials[dynamicObjects[dynamic].objects[object].material].textures[0]);
                }
                gl.uniform1i(shaderProgram.samplerUniform, 0);

            } else {
                gl.uniform1i(shaderProgram.useTexturesUniform, false);
            }

            // Load normals
            gl.bindBuffer(gl.ARRAY_BUFFER, dynamicObjects[dynamic].objects[object].vertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
                                   dynamicObjects[dynamic].objects[object].vertexNormalBuffer.itemSize, 
                                   gl.FLOAT, false, 0, 0);

            // Load indices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dynamicObjects[dynamic].objects[object].vertexIndexBuffer);
            
            // Load matrices into pipeline
            setMatrixUniforms();

            // Draw model according to selected mode
            if(renderMode == "triangles"){
                gl.drawElements(gl.TRIANGLES, dynamicObjects[dynamic].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
            }
            else if(renderMode == "points"){
                gl.drawElements(gl.POINTS, dynamicObjects[dynamic].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "lineStrip"){
                gl.drawElements(gl.LINE_STRIP, dynamicObjects[dynamic].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "lineLoop"){
                gl.drawElements(gl.LINE_LOOP, dynamicObjects[dynamic].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "lines"){
                gl.drawElements(gl.LINES, dynamicObjects[dynamic].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "triangleStrip"){
                gl.drawElements(gl.TRIANGLE_STRIP, dynamicObjects[dynamic].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "triangleFan"){
                gl.drawElements(gl.TRIANGLE_FAN, dynamicObjects[dynamic].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "quadStrip"){
                gl.drawElements(gl.QUAD_STRIP, dynamicObjects[dynamic].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "quads"){
                gl.drawElements(gl.QUADS, dynamicObjects[dynamic].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "polygon"){
                gl.drawElements(gl.POLYGON, dynamicObjects[dynamic].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
            }
            else{
                gl.drawElements(gl.TRIANGLES, dynamicObjects[dynamic].objects[object].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
            }

            // Draw model envelope
            if(drawEnvelopes){

                gl.bindBuffer(gl.ARRAY_BUFFER, dynamicObjects[dynamic].objects[object].frontPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, dynamicObjects[dynamic].objects[object].frontPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, dynamicObjects[dynamic].objects[object].frontPlaneBuffer.numItems);

                gl.bindBuffer(gl.ARRAY_BUFFER, dynamicObjects[dynamic].objects[object].topPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, dynamicObjects[dynamic].objects[object].topPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, dynamicObjects[dynamic].objects[object].topPlaneBuffer.numItems);

                gl.bindBuffer(gl.ARRAY_BUFFER, dynamicObjects[dynamic].objects[object].leftPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, dynamicObjects[dynamic].objects[object].leftPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, dynamicObjects[dynamic].objects[object].leftPlaneBuffer.numItems);

                gl.bindBuffer(gl.ARRAY_BUFFER, dynamicObjects[dynamic].objects[object].rightPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, dynamicObjects[dynamic].objects[object].rightPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, dynamicObjects[dynamic].objects[object].rightPlaneBuffer.numItems);

                gl.bindBuffer(gl.ARRAY_BUFFER, dynamicObjects[dynamic].objects[object].backPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, dynamicObjects[dynamic].objects[object].backPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, dynamicObjects[dynamic].objects[object].backPlaneBuffer.numItems);

                gl.bindBuffer(gl.ARRAY_BUFFER, dynamicObjects[dynamic].objects[object].bottomPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, dynamicObjects[dynamic].objects[object].bottomPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, dynamicObjects[dynamic].objects[object].bottomPlaneBuffer.numItems);
            }

            // Return original mvMatrix - IMPORTANT
            mvPopMatrix();
        }
    }

    //
    // DRAW BLENDED
    //
    // When there are some models with blending enabled,
    // then they must be draw here and they also have 
    // to be ordered by distance from the viewer - Z-Ordering

    // Ordering
    if(blendedObjects.length > 0){

        blendedObjects.sort(sortObjectsByZOrder);
    }

    // Drawing
    for (item in blendedObjects) {

        var geometryObject = blendedObjects[item].geometryObject;

        // Enable blending
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.enable(gl.BLEND);

        // Set depth test
        if(useOpacity){
            gl.disable(gl.DEPTH_TEST);
        }
        else{
            gl.enable(gl.DEPTH_TEST);
        }

        // Set opacity level
        gl.uniform1f(shaderProgram.alphaUniform, opacityLevel);
        
        // Dynamic item
        if(blendedObjects[item].staticObject == false){

            dynamicCounter++;

            // Save mvMatrix - Important
            mvPushMatrix();

            // Translate, rotate model according to logic representation
            try{
                
                var position = logic.dynamicItems[blendedObjects[item].id].position;
                
                // Translate
                mat4.translate(mvMatrix, [-((logic.startX + 1) + logic.itemSize * position[0]), 
                                           (logic.startY + (position[2] - 1)), 
                                           ((logic.startZ + 1) + position[1] * logic.itemSize)]);
                
                // Rotate
                if (logic.dynamicItems[blendedObjects[item].id].direction != "left") {

                    if (logic.dynamicItems[blendedObjects[item].id].direction == "up") {

                        mat4.rotate(mvMatrix, degToRad(-90), [0, 1, 0]);
                    } 
                    else if (logic.dynamicItems[blendedObjects[item].id].direction == "right") {

                        mat4.rotate(mvMatrix, degToRad(-180), [0, 1, 0]);
                    } 
                    else if (logic.dynamicItems[blendedObjects[item].id].direction == "down") {

                        mat4.rotate(mvMatrix, degToRad(90), [0, 1, 0]);
                    }
                }
                
                // Sinking floor adjustement
                if(logic.dynamicItems[blendedObjects[item].id].itemClass == 15){

                    mat4.translate(mvMatrix, [0, logic.itemSize, 0]);
                }

                // Bug not shown when FPSCamera selected
                if(cameraMode == "fpsCamera" && logic.dynamicItems[blendedObjects[item].id].itemClass == 1){

                    mvPopMatrix();
                    continue;
                }

            } 
            catch(error){};

            // Load vertices
            gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.vertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                                   geometryObject.vertexPositionBuffer.itemSize, 
                                   gl.FLOAT, false, 0, 0);

            // Load texture coords
            gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.vertexTextureCoordBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 
                                   geometryObject.vertexTextureCoordBuffer.itemSize, 
                                   gl.FLOAT, false, 0, 0);

            // Load textures
            if (useTextures && geometryObject.material != "(null)") {

                gl.uniform1i(shaderProgram.useTexturesUniform, true);
                gl.activeTexture(gl.TEXTURE0);

                // Red bug
                if(paintSelectedBugRed && item.id == logic.selectedBugID){

                    gl.bindTexture(gl.TEXTURE_2D, materials["beruska_chosen"].textures[0]); 
                }
                else{

                    gl.bindTexture(gl.TEXTURE_2D, materials[geometryObject.material].textures[0]);
                }
                gl.uniform1i(shaderProgram.samplerUniform, 0);

            } 
            else {

                gl.uniform1i(shaderProgram.useTexturesUniform, false);
            }

            // Load normals
            gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.vertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
                                   geometryObject.vertexNormalBuffer.itemSize, 
                                   gl.FLOAT, false, 0, 0);

            // Load indices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometryObject.vertexIndexBuffer);
            
            // Load matrices into pipeline
            setMatrixUniforms();

            // Draw model according to render mode
            if(renderMode == "triangles"){
                gl.drawElements(gl.TRIANGLES, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
            }
            else if(renderMode == "points"){
                gl.drawElements(gl.POINTS, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "lineStrip"){
                gl.drawElements(gl.LINE_STRIP, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "lineLoop"){
                gl.drawElements(gl.LINE_LOOP, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "lines"){
                gl.drawElements(gl.LINES, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "triangleStrip"){
                gl.drawElements(gl.TRIANGLE_STRIP, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "triangleFan"){
                gl.drawElements(gl.TRIANGLE_FAN, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "quadStrip"){
                gl.drawElements(gl.QUAD_STRIP, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "quads"){
                gl.drawElements(gl.QUADS, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 

            }
            else if(renderMode == "polygon"){
                gl.drawElements(gl.POLYGON, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
            }
            else{
                gl.drawElements(gl.TRIANGLES, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
            }

            // Draw model envelopes
            if(drawEnvelopes){

                gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.frontPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, geometryObject.frontPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, geometryObject.frontPlaneBuffer.numItems);

                gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.topPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, geometryObject.topPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, geometryObject.topPlaneBuffer.numItems);

                gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.leftPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, geometryObject.leftPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, geometryObject.leftPlaneBuffer.numItems);

                gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.rightPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, geometryObject.rightPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, geometryObject.rightPlaneBuffer.numItems);

                gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.backPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, geometryObject.backPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, geometryObject.backPlaneBuffer.numItems);

                gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.bottomPlaneBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, geometryObject.bottomPlaneBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, geometryObject.bottomPlaneBuffer.numItems);
            }

            // Load original mvMatrix
            mvPopMatrix();
        }

        // Static item
        else{
            
            staticCounter++;

            mvPushMatrix();

            // Load vertices
            gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.vertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                                   geometryObject.vertexPositionBuffer.itemSize, 
                                   gl.FLOAT, false, 0, 0);

            // Load texture coords
            gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.vertexTextureCoordBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 
                                   geometryObject.vertexTextureCoordBuffer.itemSize, 
                                   gl.FLOAT, false, 0, 0);

            // Load textures
            if(useTextures){

                gl.uniform1i(shaderProgram.useTexturesUniform, true);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, materials[geometryObject.material].textures[0]);
                gl.uniform1i(shaderProgram.samplerUniform, 0);
            }
            else{

                gl.uniform1i(shaderProgram.useTexturesUniform, false);
            }
            
            // Load lightmaps
            if(useLightmaps && geometryObject.isItPoly){
                
                gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.vertexLightmapCoordBuffer);
                gl.vertexAttribPointer(shaderProgram.lightmapCoordAttribute, 
                                       geometryObject.vertexLightmapCoordBuffer.itemSize, 
                                       gl.FLOAT, false, 0, 0);
                
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, lightmaps[staticObjects[staticObject].polyID].lightmap );
                gl.uniform1i(shaderProgram.lightmapSamplerUniform, 1)
            }

            // Load normals
            gl.bindBuffer(gl.ARRAY_BUFFER, geometryObject.vertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
                                   geometryObject.vertexNormalBuffer.itemSize, 
                                   gl.FLOAT, false, 0, 0);

            // Load indices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometryObject.vertexIndexBuffer);
            
            // Load matrices into pipeline
            setMatrixUniforms();

            // Draw model according to selected mode
            if(renderMode == "triangles"){
                gl.drawElements(gl.TRIANGLES, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "points"){
                gl.drawElements(gl.POINTS, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "lineStrip"){
                gl.drawElements(gl.LINE_STRIP, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "lineLoop"){
                gl.drawElements(gl.LINE_LOOP, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "lines"){
                gl.drawElements(gl.LINES, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "triangleStrip"){
                gl.drawElements(gl.TRIANGLE_STRIP, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "triangleFan"){
                gl.drawElements(gl.TRIANGLE_FAN, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "quadStrip"){
                gl.drawElements(gl.QUAD_STRIP, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "quads"){
                gl.drawElements(gl.QUADS, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if(renderMode == "polygon"){
                gl.drawElements(gl.POLYGON, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else{
                gl.drawElements(gl.TRIANGLES, geometryObject.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }

            // Load original matrices
            mvPopMatrix();

        }
    }    
}

/**
* This function used for walking inside scene
  OBSOLETE BUT USABLE FOR FUTURE DEVELOPMENT

//var xPos = 0;
//var yPos = 20;
//var zPos = 0;

//var yaw = 0;
//var pitch = 0;

//var speed = 0;

var lastTime = 0;
var joggingAngle = 0;

function animate() {

    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        angle += 0.05 * elapsed;

        if (speed != 0) {

            xPos -= Math.sin(degToRad(yaw)) * speed * elapsed;
            zPos -= Math.cos(degToRad(yaw)) * speed * elapsed;
            joggingAngle += elapsed * 0.6;
            // 0.6 "fiddle factor" -- makes it feel more realistic :-)
            yPos = Math.sin(degToRad(joggingAngle)) / 20 + 20
        }
        yaw += yawRate * elapsed;
        pitch += pitchRate * elapsed;
    }
    lastTime = timeNow;
}*/