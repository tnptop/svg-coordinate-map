'use strict'

const Big = require('big.js')
const { constructParameters } = require('../../../util')

const scaleLeft = (point, parameters) => {
  const { l, L, dl, hl } = parameters
  return (Big(1).minus(hl.minus(point).div(hl.minus(dl)))).mul(hl).mul(L).div(l)
}

const scaleRight = (point, parameters) => {
  const { l, L, dl, hl } = parameters
  return (Big(1).plus(point.minus(hl).div(hl.minus(dl)))).mul(hl).mul(L).div(l)
}

const scaleTransform = (point, parameters) => {
  return point.lt(parameters.hl) ?
    scaleLeft(point, parameters) :
    scaleRight(point, parameters)
}

const scaleEqual = (point, parameters) => {
  const { l, L } = parameters
  return point.mul(L).div(l)
}

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

module.exports = {
  default: init,
}