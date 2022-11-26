# Bugs Escape 3D WebGL
Implementation of a 3D logical game in JavaScript and WebGL

## Directory structure:

- ./audio ............Game music
- ./css ..............Stylesheets
- ./doc ..............Documentation source code
- ./dochtml ..........Documentation in HTML
- ./graphics .........Graphics sources
- ./img ..............Graphics for web
- ./js ...............Game implementation
- ./levels ...........Game levels
- ./lightmaps ........Lightmaps
- ./textures .........Textures
- ./favicon.ico ......Web Icon
- ./ibp.pdf ..........Theses
- ./index.html .......Game index with GLSL shader description

## Warning

Some browsers block loading from local storage. You can enable it in Google Chrome by adding these parameters for launching the browser:
```
--allow-file-access-from-files --disable-web-security
```

WebGL hardware acceleration is possible on on GPUs supporting shader model 2.0. If your hardware doesn't support this technology, it's usually possible to use software rendering. It's also necessary to check if your browser supports WebGL and if this technology is enabled in the browser.

In a situation when it seems like the game should be working, but the screen is still black, you might have chosen a first person view and you've disabled rendering of the game levell. Information about the usable keys are available in the right bottom corner. 

Martin Knapovský (martin@knapovsky.com)
Brno 2012


 