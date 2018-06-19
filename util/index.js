'use strict'

const Big = require('big.js')
const {
  constructParametersEqual,
  constructParametersTransform
} = require('./parameters')

const calculateTransformedLength = (viewpoint, viewBox, transformSide, scaleSide) => {
  return viewBox[transformSide].mul(viewpoint[scaleSide].div(viewBox[scaleSide]))
}

const constructDimensions = (view) => {
  const { width, height } = view
  return { width: Big(width), height: Big(height) }
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
  calculateTransformedLength,
  constructDimensions,
  constructParameters,
}