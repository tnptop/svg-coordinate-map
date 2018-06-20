'use strict'

const Big = require('big.js')

const scaleEqual = (point, parameters) => {
  const { l, L } = parameters
  return point.mul(L).div(l)
}

const scaleTransform = (point, parameters) => {
  const { l, L, dl, hl } = parameters
  return point.lt(hl) ?
    (Big(1).minus(hl.minus(point).div(hl.minus(dl)))).mul(hl).mul(L).div(l) :
    (Big(1).plus(point.minus(hl).div(hl.minus(dl)))).mul(hl).mul(L).div(l)
}

module.exports = {
  scaleEqual,
  scaleTransform
}