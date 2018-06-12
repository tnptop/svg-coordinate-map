'use strict'

const Big = require('big.js')
const { constructParameters } = require('../util')

const scaleEqual = (point, parameters) => {
  const { l, L } = parameters
  return point.mul(l).div(L)
}

const scaleLeft = (point, parameters) => {
  let { L, dl, hl } = parameters
  return hl.minus(Big(1).minus(point.mul(2).div(L)).mul(hl.minus(dl)))
}

const scaleRight = (point, parameters) => {
  let { L, dl, hl } = parameters
  return hl.plus((point.mul(2).div(L)).minus(1).mul(hl.minus(dl)))
}

const scale = (point, parameters) => {
  return point.lt(parameters.hl) ?
    scaleLeft(point, parameters).toString() :
    scaleRight(point, parameters).toString()
}

module.exports = (dimensions, orientation) => {
  if (orientation === 'n/a') {
    throw new Error('Could not scale with given dimensions.')
  } else {
    const parameters = constructParameters(dimensions, orientation)
    return orientation === 'equal' ?
      (point) => scaleEqual(Big(point), parameters) :
      (point) => scale(Big(point), parameters)
  }
}