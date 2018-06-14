'use strict'

const { constructDimensions, calculateTransformedLength } = require('../util')

const isAspectRatioEqual = (viewpoint, viewBox) => {
  const viewPointRatio = viewpoint.width.div(viewpoint.height)
  const viewBoxRatio = viewBox.width.div(viewBox.height)

  return viewPointRatio.eq(viewBoxRatio)
}

const determineScalingMethod = (viewpoint, viewBox) => {
  const methods = {
    equal: [ true, false, false ],
    width: [ false, true, false ],
    height: [ false, false, true ]
  }
  const flags = [
    isAspectRatioEqual(viewpoint, viewBox),
    shouldScaleHorizontally(viewpoint, viewBox),
    shouldScaleVertically(viewpoint, viewBox)
  ]

  return Object.keys(methods).find(method => {
    return methods[method].every((flag, index) => flag === flags[index])
  })
}

const shouldScaleHorizontally = (viewpoint, viewBox) => {
  const transformedLength = calculateTransformedLength(viewpoint, viewBox, 'width', 'height')
  return viewpoint.width.gt(transformedLength)
}

const shouldScaleVertically = (viewpoint, viewBox) => {
  const transformedLength = calculateTransformedLength(viewpoint, viewBox, 'height', 'width')
  return viewpoint.height.gt(transformedLength)
}

const init = (viewpoint, viewBox, direction = 'pointToBox') => {
  const [ vp, vb ] = [ viewpoint, viewBox ].map(view => constructDimensions(view))
  const method = determineScalingMethod(vp, vb)
  const mapper = require(`./${direction}`).default

  return mapper(vp, vb, method)
}

module.exports = {
  default: init,
}