'use strict';

var sharp = require('sharp'),
    necessary = require('necessary');

var namesUtilities = require('./utilities/names');

var asynchronousUtilities = necessary.asynchronousUtilities,
    fileSystemUtilities = necessary.fileSystemUtilities,
    whilst = asynchronousUtilities.whilst,
    readDirectory = fileSystemUtilities.readDirectory,
    dimensionFromNames = namesUtilities.dimensionFromNames;


function imageMapPNG(imageDirectoryPath, overlayImageSize, response) {
  var names = readDirectory(imageDirectoryPath),
      dimension = dimensionFromNames(names);

  createImageMap(dimension, overlayImageSize, function (imageBuffer) {
    var context = {
      names: names,
      dimension: dimension,
      imageBuffer: imageBuffer,
      overlayImageSize: overlayImageSize,
      imageDirectoryPath: imageDirectoryPath
    };

    whilst(overlayCallback, function () {
      response.writeHead(200, { 'Content-Type': 'image/png; charset=utf-8' });

      var imageBuffer = context.imageBuffer;


      sharp(imageBuffer).pipe(response);
    }, context);
  });
}

module.exports = imageMapPNG;

function createImageMap(dimension, overlayImageSize, callback) {
  var width = dimension * overlayImageSize,
      height = dimension * overlayImageSize,
      channels = 4,
      background = { r: 0, g: 0, b: 0, alpha: 0 },
      options = {
    width: width,
    height: height,
    channels: channels,
    background: background
  },
      textureMap = sharp({
    create: options ///
  });

  textureMap.png().toBuffer().then(function (imageBuffer) {
    callback(imageBuffer);
  });
}

function overlayCallback(next, done, context, index) {
  var names = context.names,
      dimension = context.dimension,
      imageBuffer = context.imageBuffer,
      overlayImageSize = context.overlayImageSize,
      imageDirectoryPath = context.imageDirectoryPath,
      namesLength = names.length,
      lastIndex = namesLength - 1;


  if (index > lastIndex) {
    done();

    return;
  }

  var name = names[index],
      path = imageDirectoryPath + '/' + name;

  resizeImage(path, overlayImageSize, function (resizedImageBuffer) {
    var top = (dimension - 1 - Math.floor(index / dimension)) * overlayImageSize,
        left = index % dimension * overlayImageSize,
        options = {
      top: top,
      left: left
    };

    sharp(imageBuffer).overlayWith(resizedImageBuffer, options).toBuffer().then(function (imageBuffer) {
      Object.assign(context, {
        imageBuffer: imageBuffer
      });

      next();
    });
  });
}

function resizeImage(path, overlayImageSize, callback) {
  var width = overlayImageSize,
      ///
  height = overlayImageSize; ///

  sharp(path).resize(width, height).toBuffer().then(function (imageBuffer) {
    var resizedImageBuffer = imageBuffer; ///

    callback(resizedImageBuffer);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9pbWFnZU1hcFBORy5qcyJdLCJuYW1lcyI6WyJzaGFycCIsInJlcXVpcmUiLCJuZWNlc3NhcnkiLCJuYW1lc1V0aWxpdGllcyIsImFzeW5jaHJvbm91c1V0aWxpdGllcyIsImZpbGVTeXN0ZW1VdGlsaXRpZXMiLCJ3aGlsc3QiLCJyZWFkRGlyZWN0b3J5IiwiZGltZW5zaW9uRnJvbU5hbWVzIiwiaW1hZ2VNYXBQTkciLCJpbWFnZURpcmVjdG9yeVBhdGgiLCJvdmVybGF5SW1hZ2VTaXplIiwicmVzcG9uc2UiLCJuYW1lcyIsImRpbWVuc2lvbiIsImNyZWF0ZUltYWdlTWFwIiwiaW1hZ2VCdWZmZXIiLCJjb250ZXh0Iiwib3ZlcmxheUNhbGxiYWNrIiwid3JpdGVIZWFkIiwicGlwZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJjYWxsYmFjayIsIndpZHRoIiwiaGVpZ2h0IiwiY2hhbm5lbHMiLCJiYWNrZ3JvdW5kIiwiciIsImciLCJiIiwiYWxwaGEiLCJvcHRpb25zIiwidGV4dHVyZU1hcCIsImNyZWF0ZSIsInBuZyIsInRvQnVmZmVyIiwidGhlbiIsIm5leHQiLCJkb25lIiwiaW5kZXgiLCJuYW1lc0xlbmd0aCIsImxlbmd0aCIsImxhc3RJbmRleCIsIm5hbWUiLCJwYXRoIiwicmVzaXplSW1hZ2UiLCJyZXNpemVkSW1hZ2VCdWZmZXIiLCJ0b3AiLCJNYXRoIiwiZmxvb3IiLCJsZWZ0Iiwib3ZlcmxheVdpdGgiLCJPYmplY3QiLCJhc3NpZ24iLCJyZXNpemUiXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkO0FBQUEsSUFDTUMsWUFBWUQsUUFBUSxXQUFSLENBRGxCOztBQUdBLElBQU1FLGlCQUFpQkYsUUFBUSxtQkFBUixDQUF2Qjs7SUFFUUcscUIsR0FBK0NGLFMsQ0FBL0NFLHFCO0lBQXVCQyxtQixHQUF3QkgsUyxDQUF4QkcsbUI7SUFDdkJDLE0sR0FBV0YscUIsQ0FBWEUsTTtJQUNBQyxhLEdBQWtC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QUtBLEdBREc7QUFFUkcsWUFBTUE7QUFGRSxLQUZoQjs7QUFPQW5ELFVBQU1nQixXQUFOLEVBQ0dvQyxXQURILENBQ2VMLGtCQURmLEVBQ21DZixPQURuQyxFQUVHSSxRQUZILEdBR0dDLElBSEgsQ0FHUSxVQUFTckIsV0FBVCxFQUFzQjtBQUMxQnFDLGFBQU9DLE1BQVAsQ0FBY3JDLE9BQWQsRUFBdUI7QUFDckJELHFCQUFhQTtBQURRLE9BQXZCOztBQUlBc0I7QUFDRCxLQVRIO0FBVUQsR0FsQkQ7QUFtQkQ7O0FBRUQsU0FBU1EsV0FBVCxDQUFxQkQsSUFBckIsRUFBMkJsQyxnQkFBM0IsRUFBNkNZLFFBQTdDLEVBQXVEO0FBQ3JELE1BQU1DLFFBQVFiLGdCQUFkO0FBQUEsTUFBZ0M7QUFDMUJjLFdBQVNkLGdCQURmLENBRHFELENBRW5COztBQUVsQ1gsUUFBTTZDLElBQU4sRUFDR1UsTUFESCxDQUNVL0IsS0FEVixFQUNpQkMsTUFEakIsRUFFR1csUUFGSCxHQUdHQyxJQUhILENBR1EsVUFBU3JCLFdBQVQsRUFBc0I7QUFDMUIsUUFBTStCLHFCQUFxQi9CLFdBQTNCLENBRDBCLENBQ2M7O0FBRXhDTyxhQUFTd0Isa0JBQVQ7QUFDRCxHQVBIO0FBUUQiLCJmaWxlIjoiaW1hZ2VNYXBQTkcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHNoYXJwID0gcmVxdWlyZSgnc2hhcnAnKSxcbiAgICAgIG5lY2Vzc2FyeSA9IHJlcXVpcmUoJ25lY2Vzc2FyeScpO1xuXG5jb25zdCBuYW1lc1V0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL25hbWVzJyk7XG5cbmNvbnN0IHsgYXN5bmNocm9ub3VzVXRpbGl0aWVzLCBmaWxlU3lzdGVtVXRpbGl0aWVzIH0gPSBuZWNlc3NhcnksXG4gICAgICB7IHdoaWxzdCB9ID0gYXN5bmNocm9ub3VzVXRpbGl0aWVzLFxuICAgICAgeyByZWFkRGlyZWN0b3J5IH0gPSBmaWxlU3lzdGVtVXRpbGl0aWVzLFxuICAgICAgeyBkaW1lbnNpb25Gcm9tTmFtZXMgfSA9IG5hbWVzVXRpbGl0aWVzO1xuXG5mdW5jdGlvbiBpbWFnZU1hcFBORyhpbWFnZURpcmVjdG9yeVBhdGgsIG92ZXJsYXlJbWFnZVNpemUsIHJlc3BvbnNlKSB7XG4gIGNvbnN0IG5hbWVzID0gcmVhZERpcmVjdG9yeShpbWFnZURpcmVjdG9yeVBhdGgpLFxuICAgICAgICBkaW1lbnNpb24gPSBkaW1lbnNpb25Gcm9tTmFtZXMobmFtZXMpO1xuXG4gIGNyZWF0ZUltYWdlTWFwKGRpbWVuc2lvbiwgb3ZlcmxheUltYWdlU2l6ZSwgZnVuY3Rpb24oaW1hZ2VCdWZmZXIpIHtcbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgbmFtZXM6IG5hbWVzLFxuICAgICAgZGltZW5zaW9uOiBkaW1lbnNpb24sXG4gICAgICBpbWFnZUJ1ZmZlcjogaW1hZ2VCdWZmZXIsXG4gICAgICBvdmVybGF5SW1hZ2VTaXplOiBvdmVybGF5SW1hZ2VTaXplLFxuICAgICAgaW1hZ2VEaXJlY3RvcnlQYXRoOiBpbWFnZURpcmVjdG9yeVBhdGhcbiAgICB9O1xuICAgIFxuICAgIHdoaWxzdChvdmVybGF5Q2FsbGJhY2ssIGZ1bmN0aW9uKCkge1xuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKDIwMCwgeydDb250ZW50LVR5cGUnOiAnaW1hZ2UvcG5nOyBjaGFyc2V0PXV0Zi04J30pO1xuXG4gICAgICBjb25zdCB7IGltYWdlQnVmZmVyIH0gPSBjb250ZXh0O1xuXG4gICAgICBzaGFycChpbWFnZUJ1ZmZlcikucGlwZShyZXNwb25zZSk7XG4gICAgfSwgY29udGV4dCk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGltYWdlTWFwUE5HO1xuXG5mdW5jdGlvbiBjcmVhdGVJbWFnZU1hcChkaW1lbnNpb24sIG92ZXJsYXlJbWFnZVNpemUsICBjYWxsYmFjaykge1xuICBjb25zdCB3aWR0aCA9IGRpbWVuc2lvbiAqIG92ZXJsYXlJbWFnZVNpemUsXG4gICAgICAgIGhlaWdodCA9IGRpbWVuc2lvbiAqIG92ZXJsYXlJbWFnZVNpemUsXG4gICAgICAgIGNoYW5uZWxzID0gNCxcbiAgICAgICAgYmFja2dyb3VuZCA9IHsgcjogMCwgZzogMCwgYjogMCwgYWxwaGE6IDAgfSxcbiAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgY2hhbm5lbHM6IGNoYW5uZWxzLFxuICAgICAgICAgIGJhY2tncm91bmQ6IGJhY2tncm91bmRcbiAgICAgICAgfSxcbiAgICAgICAgdGV4dHVyZU1hcCA9IHNoYXJwKHtcbiAgICAgICAgICBjcmVhdGU6IG9wdGlvbnMgLy8vXG4gICAgICAgIH0pO1xuXG4gIHRleHR1cmVNYXBcbiAgICAucG5nKClcbiAgICAudG9CdWZmZXIoKVxuICAgIC50aGVuKGZ1bmN0aW9uKGltYWdlQnVmZmVyKSB7XG4gICAgICBjYWxsYmFjayhpbWFnZUJ1ZmZlcilcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gb3ZlcmxheUNhbGxiYWNrKG5leHQsIGRvbmUsIGNvbnRleHQsIGluZGV4KSB7XG4gIGNvbnN0IHsgbmFtZXMsIGRpbWVuc2lvbiwgaW1hZ2VCdWZmZXIsIG92ZXJsYXlJbWFnZVNpemUsIGltYWdlRGlyZWN0b3J5UGF0aCB9ID0gY29udGV4dCxcbiAgICAgICAgbmFtZXNMZW5ndGggPSBuYW1lcy5sZW5ndGgsXG4gICAgICAgIGxhc3RJbmRleCA9IG5hbWVzTGVuZ3RoIC0gMTtcblxuICBpZiAoaW5kZXggPiBsYXN0SW5kZXgpIHtcbiAgICBkb25lKCk7XG4gICAgXG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBjb25zdCBuYW1lID0gbmFtZXNbaW5kZXhdLFxuICAgICAgICBwYXRoID0gYCR7aW1hZ2VEaXJlY3RvcnlQYXRofS8ke25hbWV9YDtcblxuICByZXNpemVJbWFnZShwYXRoLCBvdmVybGF5SW1hZ2VTaXplLCBmdW5jdGlvbihyZXNpemVkSW1hZ2VCdWZmZXIpIHtcbiAgICBjb25zdCB0b3AgPSAoKGRpbWVuc2lvbiAtIDEpIC0gTWF0aC5mbG9vcihpbmRleCAvIGRpbWVuc2lvbikgKSAqIG92ZXJsYXlJbWFnZVNpemUsXG4gICAgICAgICAgbGVmdCA9IChpbmRleCAlIGRpbWVuc2lvbikgKiBvdmVybGF5SW1hZ2VTaXplLFxuICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0b3A6IHRvcCxcbiAgICAgICAgICAgIGxlZnQ6IGxlZnRcbiAgICAgICAgICB9O1xuXG4gICAgc2hhcnAoaW1hZ2VCdWZmZXIpXG4gICAgICAub3ZlcmxheVdpdGgocmVzaXplZEltYWdlQnVmZmVyLCBvcHRpb25zKVxuICAgICAgLnRvQnVmZmVyKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGltYWdlQnVmZmVyKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oY29udGV4dCwge1xuICAgICAgICAgIGltYWdlQnVmZmVyOiBpbWFnZUJ1ZmZlclxuICAgICAgICB9KTtcblxuICAgICAgICBuZXh0KCk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc2l6ZUltYWdlKHBhdGgsIG92ZXJsYXlJbWFnZVNpemUsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHdpZHRoID0gb3ZlcmxheUltYWdlU2l6ZSwgLy8vXG4gICAgICAgIGhlaWdodCA9IG92ZXJsYXlJbWFnZVNpemU7ICAvLy9cbiAgXG4gIHNoYXJwKHBhdGgpXG4gICAgLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KVxuICAgIC50b0J1ZmZlcigpXG4gICAgLnRoZW4oZnVuY3Rpb24oaW1hZ2VCdWZmZXIpIHtcbiAgICAgIGNvbnN0IHJlc2l6ZWRJbWFnZUJ1ZmZlciA9IGltYWdlQnVmZmVyOyAvLy9cbiAgICAgIFxuICAgICAgY2FsbGJhY2socmVzaXplZEltYWdlQnVmZmVyKTtcbiAgICB9KTtcbn1cbiJdfQ==