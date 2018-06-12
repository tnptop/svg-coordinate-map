'use strict'

const Big = require('big.js')

const constructDimensions = (viewPoint, viewBox) => {
  const big = {
    width: {
      viewPoint: Big(viewPoint.width),
      viewBox: Big(viewBox.width)
    },
    height: {
      viewPoint: Big(viewPoint.height),
      viewBox: Big(viewBox.height)
    }
  }
  return Object.assign({}, big, {
    widthScale: big.height.viewPoint.div(big.height.viewBox).mul(big.width.viewBox),
    heightScale: big.width.viewPoint.div(big.width.viewBox).mul(big.height.viewBox)
  })
}

const constructParameters = (dimensions, orientation) => {
  const value = dimensions[orientation]
  const scaledValue = dimensions[`${orientation}Scale`]
  return {
    l: value.viewPoint,
    hl: value.viewPoint.div(2),
    L: value.viewBox,
    hL: value.viewBox.div(2),
    dl: value.viewPoint.minus(scaledValue).abs().div(2),
  }
}

module.exports = { constructDimensions, constructParameters }