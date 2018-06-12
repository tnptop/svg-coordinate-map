'use strict'

const Big = require('big.js')
const { constructParameters } = require('../util')

const scaleEqual = (point, parameters) => {
  const { l, L } = parameters
  return point.mul(L).div(l)
}

const scaleLeft = (point, parameters) => {
  let { l, L, dl, hl } = parameters
  return (Big(1).minus(hl.minus(point).div(hl.minus(dl)))).mul(hl).mul(L).div(l)
}

const scaleRight = (point, parameters) => {
  let { l, L, dl, hl } = parameters
  return (Big(1).plus(point.minus(hl).div(hl.minus(dl)))).mul(hl).mul(L).div(l)
}

const scale = (point, parameters) => {
  return point.lt(parameters.hl) ?
    scaleLeft(point, parameters).toString() :
    scaleRight(point, parameters).toString()
}

const init = (dimensions, orientation) => {
  if (orientation === 'n/a') {
    throw new Error('Could not scale with given dimensions.')
  } else {
    const parameters = constructParameters(dimensions, orientation)
    return orientation === 'equal' ?
      (point) => scaleEqual(Big(point), parameters) :
      (point) => scale(Big(point), parameters)
  }
}

module.exports = {
  default: init,
  scale,
  scaleEqual,
  scaleLeft,
  scaleRight
}
