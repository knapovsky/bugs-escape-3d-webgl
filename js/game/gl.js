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
 * This file contains functions used in WebGL initialization of 
 * Berusky 2 WebGL game.
 *
 */

/**
* Loading of shaders from HTML page
* @param gl WebGL object
* @param id Shader type
* @return Compiled shader
*/
function getShader(gl, id) {

    // Shader script loading
    var shaderScript = document.getElementById(id);

    if (!shaderScript) {

        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {

        if (k.nodeType == 3) {

            str += k.textContent;
        }
        k = k.nextSibling;
    }

    // Type of shader
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {

        // Creating Fragment shader
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {

        // Creating Vertex shader
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    // Shader Compilation
    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

/**
* Shader initialization
*/
function initShaders() {

    // Loading shaders from HTML
    var fragmentShader = getShader(gl, "per-fragment-lighting-fs");
    var vertexShader = getShader(gl, "per-fragment-lighting-vs");

    // Creating shader program
    shaderProgram = gl.createProgram();
    // Attaching Vertex Shader
    gl.attachShader(shaderProgram, vertexShader);
    // Attaching fragment shader
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    // Using curretly created shader program
    gl.useProgram(shaderProgram);

    // Getting reference to Vertex position attribute
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // Getting reference to Vertex normal attribute
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    // Getting reference to Texture coordination attribute
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    
    // Getting reference to Lightmap coordination attribute
    shaderProgram.lightmapCoordAttribute = gl.getAttribLocation(shaderProgram, "vLightmapCoord");
    gl.enableVertexAttribArray(shaderProgram.lightmapCoordAttribute);

    // Reference to Projection Matrix
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

    // Reference to Model-View Matrix
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    // Reference to Normal Matrix
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

    // Reference to Texture Sampler
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    // Reference to Material Specular value
    shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");

    // Reference to variable used for enabling specular highlights
    shaderProgram.showSpecularHighlightsUniform = gl.getUniformLocation(shaderProgram, "uShowSpecularHighlights");

    // Reference to variable used for enabling usage of textures
    shaderProgram.useTexturesUniform = gl.getUniformLocation(shaderProgram, "uUseTextures");

    // Reference to variable used for enabling usage of lightning
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");

    // Reference to ambient color value
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");

    // Location of Point Light in the scene
    shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");

    // Point light specular color
    shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingSpecularColor");

    // Point light diffuse color
    shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingDiffuseColor");
    shaderProgram.alphaUniform = gl.getUniformLocation(shaderProgram, "uAlpha");
    
    // These variables are not used - used for more lights in the scene
    //shaderProgram.pointLightningLocationUniform1 = gl.getUniformLocation(shaderProgram, "uPointLightingLocationArray");
    //shaderProgram.lightCount = gl.getUniformLocation(shaderProgram, "lightCount");
    
    // Lightmap sampler
    shaderProgram.lightmapSamplerUniform = gl.getUniformLocation(shaderProgram, "uLightmapSampler");

    // Enabling lightmaps
    shaderProgram.useLightmapUniform = gl.getUniformLocation(shaderProgram, "uUseLightmap");
}

/**
* Initialization of main WebGL context
* @param Canvas Reference to canvas DOM object
*/
function initGL(canvas) {
    
    // Not all of browser are supporting WebGL
    try {

        // Gettings context
        gl = canvas.getContext("experimental-webgl");

        // Settings draw buffer width and height
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        glInitialized = true;
    } 
    catch (e) {}

    // WebGL cannot be initialised
    if (!gl) {

        alert("Could not initialise WebGL. Use diffent browser or upgrade your graphic hardware.");
    }
}

/**
* Pushes mvMatrix into stack
*/
function mvPushMatrix() {

    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

/**
* Pops mvMatrix from stack
*/
function mvPopMatrix() {

    if (mvMatrixStack.length == 0) {

        if(log){
            console.log("Invalid popMatrix");
        }
        //throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

/**
* Loads mvMatrix, pMatrix and normalMatrix into shaders
*/
function setMatrixUniforms() {

    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}