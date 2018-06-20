'use strict'

const Big = require('big.js')

const scaleEqual = (point, parameters) => {
  const { l, L } = parameters
  return point.mul(l).div(L)
}

const scaleTransform = (point, parameters) => {
  const { L, dl, hl, hL } = parameters
  return point.lt(hL) ?
    hl.minus(Big(1).minus(point.mul(2).div(L)).mul(hl.minus(dl))) :
    hl.plus((point.mul(2).div(L)).minus(1).mul(hl.minus(dl)))
}

module.exports = {
  scaleEqual,
  scaleTransform
}