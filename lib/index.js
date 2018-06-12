'use strict'

const { constructDimensions } = require('../util')

const isAspectRatioEqual = (dimensions) => {
  const { width, height } = dimensions
  const viewPointRatio = width.viewPoint.div(height.viewPoint)
  const viewBoxRatio = width.viewBox.div(height.viewBox)

  return viewPointRatio.eq(viewBoxRatio)
}

const shouldScaleHorizontally = (dimensions) => {
  const { width, height } = dimensions
  return width.viewPoint.gt(height.viewPoint.div(height.viewBox).mul(width.viewBox))
}

const shouldScaleVertically = (dimensions) => {
  const { width, height } = dimensions
  return height.viewPoint.gt(width.viewPoint.div(width.viewBox).mul(height.viewBox))
}

const init = (viewPoint, viewBox, direction = 'pointToBox') => {
  const dimensions = constructDimensions(viewPoint, viewBox)
  const orientation = isAspectRatioEqual(dimensions) ? 'equal' :
    shouldScaleHorizontally(dimensions) ? 'width' :
      shouldScaleVertically(dimensions) ? 'height' : 'n/a'
  const mapper = require(`./${direction}`).default

  return mapper(dimensions, orientation)
}

module.exports = {
  default: init,
  isAspectRatioEqual,
  shouldScaleHorizontally,
  shouldScaleVertically
}
