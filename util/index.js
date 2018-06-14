'use strict'

const Big = require('big.js')

const constructDimensions = (view) => {
  const { width, height } = view
  return { width: Big(width), height: Big(height) }
}

const calculateTransformedLength = (viewpoint, viewBox, transformSide, scaleSide) => {
  const scaleFactor = viewpoint[scaleSide].div(viewBox[scaleSide])
  return viewBox[transformSide].mul(scaleFactor)
}

const constructParametersEqual = (viewpoint, viewBox, side) => {
  const [ l, L ] = [ viewpoint[side], viewBox[side] ]
  return { l, L }
}

const constructParametersTransform = (viewpoint, viewBox, transformSide, scaleSide) => {
  const [ l, L ] = [ viewpoint[transformSide], viewBox[transformSide] ]
  const [ hl, hL ] = [ l, L ].map(n => n.div(2))
  const tl = calculateTransformedLength(viewpoint, viewBox, transformSide, scaleSide)
  const dl = l.minus(tl).div(2).abs()

  return { l, L, hl, hL, dl }
}

const constructParameters = (viewpoint, viewBox, method) => {
  const equalWidth = constructParametersEqual(viewpoint, viewBox, 'width')
  const equalHeight = constructParametersEqual(viewpoint, viewBox, 'height')
  const transformedWidth = constructParametersTransform(viewpoint, viewBox, 'width', 'height')
  const transformedHeight = constructParametersTransform(viewpoint, viewBox, 'height', 'width')
  const methods = {
    equal: { width: equalWidth, height: equalHeight },
    width: { width: transformedWidth, height: equalHeight },
    height: { width: equalWidth, height: transformedHeight }
  }

  return methods[method]
}

module.exports = {
  constructDimensions,
  constructParameters,
  calculateTransformedLength,
}