'use strict'

const Big = require('big.js')
const { constructParameters } = require('../../../util')
const { scaleEqual, scaleTransform } = require('./scaler')

const init = (viewpoint, viewBox, method) => {
  const parameters = constructParameters(viewpoint, viewBox, method)
  const methods = {
    equal: { x: scaleEqual, y: scaleEqual },
    width: { x: scaleTransform, y: scaleEqual },
    height: { x: scaleEqual, y: scaleTransform }
  }

  return (points) => {
    const { x, y } = points
    const scaler = methods[method]
    return {
      x: scaler.x(Big(x), parameters.width).toString(),
      y: scaler.y(Big(y), parameters.height).toString()
    }
  }
}

module.exports = init

