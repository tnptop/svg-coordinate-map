'use strict'

const {
  isAspectRatioEqual,
  shouldScaleHorizontally,
  shouldScaleVertically
} = require('./condition')
const pointToBox = require('./pointToBox')
const boxToPoint = require('./boxToPoint')

const generateScaler = (viewpoint, viewBox, direction) => {
  const directions = { pointToBox, boxToPoint }
  const methods = {
    equal: [ true, false, false ],
    width: [ false, true, false ],
    height: [ false, false, true ]
  }
  const flags = [
    isAspectRatioEqual(viewpoint, viewBox),
    shouldScaleHorizontally(viewpoint, viewBox),
    shouldScaleVertically(viewpoint, viewBox)
  ]
  const method = Object.keys(methods).find(method => {
    return methods[method].every((flag, index) => flag === flags[index])
  })

  return directions[direction](viewpoint, viewBox, method)
}

module.exports = generateScaler

