# Jiggles

Image compositing for [Jiggle](https://github.com/djalbat/Jiggle).

Since [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) supports texture mapping, so does Jiggle. A drawback of WebGL, however, is that it allows only six textures per shader. One way around this problem is to use multiple shaders, but this can become cumbersome. A better solution is to use image compositing, essentially tiling several textures to produce an image map. This is what Jiggles provides, together with a corresponding JSON representation of the image map that can be used to configure shaders to extract specific textures.

Jiggles runs on the server and not in the browser, the reason being that it depends on [Sharp](http://sharp.pixelplumbing.com/). The best way to make image maps and their corresponding JSON representations available to Jiggle applications running in a browser, therefore, is by way of a small NodeJS application implementing endpoints for each. This repository includes such an example application and an explanation of it is given below.

## Installation

You can clone the repository with [Git](https://git-scm.com/)...

    git clone https://github.com/djalbat/Jiggles.git

...and then install the necessary modules with [npm](https://www.npmjs.com/) from within the project's root directory:

    npm install

You will need to do this if you want to look at the example.

## Example

There is a small Node.js application which can be run from the root of the repository:

    node ./bin/main.js

This provides two endpoints. The `http://localhost:8000/imageMap` endpoint will serve the example image map whilst the `http://localhost:8000/` endpoint serves a blank HTML file with the image map's corresponding JSON representation embedded within it. Four example images of differing formats can be found in the `image` directory (for technical reasons they are referred to as images rather than textures from here on in). You can specify which images make up the image map with a suitable query string for both endpoints, for example `http://localhost:8000/imageMap?names=blue.jpg,green.png,red.jpg`. If you do not specify any names, all of the images will be used.

## Usage

Two routes have been set up in the [main.js](https://github.com/djalbat/Jiggles/blob/master/bin/main.js) and [routes.js](https://github.com/djalbat/Jiggles/blob/master/bin/routes.js) files in order to provide the aforementioned endpoints, each making use of one of the two functions provided by Jiggles. The blank HTML file is generated from a template HTML file in the repository's `template` directory:

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <script>

      var imageMapJSON = ${imageMapJSON};

    </script>
  </body>
</html>
```

Embedding the image map JSON within the HTML in this way will make it globally available in any JavaScript run in the browser. If you think this approach is questionable, you could provide the JSON by way of an Ajax request. It is recommended that you use the example application as a starting point should you wish to write your own service to support your Jiggle application.

Finally, the signatures of the functions that Jiggles provides:

```
function imageMapPNG(names, imageDirectoryPath, overlayImageSize, response) {
  ...
}

function imageMapJSON(names, imageDirectoryPath, callback) {
  ...
}
```

## Compiling from source

Automation is done with [npm scripts](https://docs.npmjs.com/misc/scripts), have a look at the `package.json` file. The pertinent commands are:

    npm run build-debug
    npm run watch-debug
    
## Contact

- james.smith@djalbat.com
- http://djalbat.com
