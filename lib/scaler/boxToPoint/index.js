'use strict'

const Big = require('big.js')
const { constructParameters } = require('../../../util')

const scaleLeft = (point, parameters) => {
  let { L, dl, hl } = parameters
  return hl.minus(Big(1).minus(point.mul(2).div(L)).mul(hl.minus(dl)))
}

const scaleRight = (point, parameters) => {
  let { L, dl, hl } = parameters
  return hl.plus((point.mul(2).div(L)).minus(1).mul(hl.minus(dl)))
}

const scaleTransform = (point, parameters) => {
  return point.lt(parameters.hl) ?
    scaleLeft(point, parameters) :
    scaleRight(point, parameters)
}

const scaleEqual = (point, parameters) => {
  const { l, L } = parameters
  return point.mul(l).div(L)
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

module.exports = init