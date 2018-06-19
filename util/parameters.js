'use strict'

const constructParametersEqual = (viewpoint, viewBox, side) => {
  const [ l, L ] = [ viewpoint[side], viewBox[side] ]
  return { l, L }
}

const constructParametersTransform = (viewpoint, viewBox, transformSide, scaleSide) => {
  const [ l, L ] = [ viewpoint[transformSide], viewBox[transformSide] ]
  const [ hl, hL ] = [ l, L ].map(n => n.div(2))
  const tl = viewBox[transformSide].mul(viewpoint[scaleSide].div(viewBox[scaleSide]))
  const dl = l.minus(tl).div(2).abs()

  return { l, L, hl, hL, dl }
}

module.exports = {
  constructParametersEqual,
  constructParametersTransform
}
