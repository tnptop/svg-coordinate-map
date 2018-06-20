'use strict'

const { calculateTransformedLength } = require('../../util')

const isAspectRatioEqual = (viewpoint, viewBox) => {
  const viewPointRatio = viewpoint.width.div(viewpoint.height)
  const viewBoxRatio = viewBox.width.div(viewBox.height)

  return viewPointRatio.eq(viewBoxRatio)
}

const shouldScaleHorizontally = (viewpoint, viewBox) => {
  const transformedLength = calculateTransformedLength(viewpoint, viewBox, 'width', 'height')
  return viewpoint.width.gt(transformedLength)
}

const shouldScaleVertically = (viewpoint, viewBox) => {
  const transformedLength = calculateTransformedLength(viewpoint, viewBox, 'height', 'width')
  return viewpoint.height.gt(transformedLength)
}

module.exports = {
  isAspectRatioEqual,
  shouldScaleHorizontally,
  shouldScaleVertically
}

