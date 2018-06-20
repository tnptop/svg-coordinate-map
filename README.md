# svg-coordinate-map [![CircleCI](https://circleci.com/gh/tnptop/svg-coordinate-map.svg?style=svg)](https://circleci.com/gh/tnptop/svg-coordinate-map) [![Coverage Status](https://coveralls.io/repos/github/tnptop/svg-coordinate-map/badge.svg?branch=master)](https://coveralls.io/github/tnptop/svg-coordinate-map?branch=master)

> Map coordinate values in viewpoint to viewBox (and vice versa)

## Purpose

As aspect ratios of the viewpoint (derived from `width` and `height` property) and the viewBox (derived from `width` and `height` parameters of `viewbox` property) can be different, this library helps mapping coordinate values from viewpoint (or viewBox) to those of the other system.  

This library tries to solve a problem of correctly rendering changes in an SVG made by a user on any device screens regardless of their aspect ratios. An example of an application utilizing this functionality is image annotation, with known fixed viewBox parameters. Since a set of coordination obtained from an user interaction will have to be relative to viewpoint (as a screen size and aspect ratio of the user's device are unknown), the coordination has to be stored relative to viewBox to ensure proper rendering on devices with different screen sizes and aspect ratios.  

Currently support only SVG with viewBox having parameters `min-width` and `min-height` of zero (e.g. `viewBox="0 0 width height"`).

## Installation

Using package manager:  
```bash
# NPM
$ npm install --save svg-coordinate-map

# Yarn
$ yarn add svg-coordinate-map
```

Browser-friendly version is planned, but not available yet.

## Usage
```js
const Mapper = require('svg-coordinate-map')

/**
 * Convert properties in <svg> to JSON as shown below
 * The original SVG here is: <svg width="50" height="90" viewBox="0 0 100 300">
 * 
 * Support for automatically parsing SVG element planned
 */
const viewpoint = { width: 50, height: 90 }
const viewBox = { width: 100, height: 300 }

// Create mapper with default mapping direction of 'boxToPoint'
const map = Mapper(viewpoint, viewBox)
// Create mapper with specified mapping direction of {'boxToPoint', 'pointToBox'}
const map = Mapper(viewpoint, viewBox, 'boxToPoint')

map({ x: 17.5, y: 54 }) // returns { x: 25, y: 180 } 
```

## License
This library is under an [MIT License](https://github.com/tnptop/svg-coordinate-map/blob/master/LICENSE).
