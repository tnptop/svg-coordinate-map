'use strict'

const { constructDimensions } = require('../util')
const generateScaler = require('./scaler')

const init = (viewpoint, viewBox, direction = 'pointToBox') => {
  const [ vp, vb ] = [ viewpoint, viewBox ].map(view => constructDimensions(view))
  const scaler = generateScaler(vp, vb, direction)

  return scaler
}

module.exports = init

