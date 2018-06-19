'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('lib', () => {
  let constructDimensionsStub, generateScalerStub
  let viewpoint, viewBox
  let lib

  beforeEach(() => {
    viewpoint = 'viewpoint'
    viewBox = 'viewBox'
    constructDimensionsStub = sinon.stub()
    constructDimensionsStub.withArgs(viewpoint).returns(viewpoint)
    constructDimensionsStub.withArgs(viewBox).returns(viewBox)
    generateScalerStub = sinon.stub().returns((p1, p2, p3) => {})
    lib = proxyquire('../../lib', {
      '../util': { constructDimensions: constructDimensionsStub },
      './scaler': generateScalerStub
    })
  })

  it('should export one function', () => {
    assert.equal(typeof lib, 'function')
  })

  it('should accept two arguments, with one optional argument', () => {
    assert.equal(lib.length, 2)
  })

  it('should call constructDimensions() with correct parameters', () => {
    lib(viewpoint, viewBox, 'pointToBox')

    assert.deepEqual(
      constructDimensionsStub.args,
      [ [ 'viewpoint' ], [ 'viewBox' ] ]
    )
  })

  it('should call generateScaler() with correct parameters', () => {
    lib(viewpoint, viewBox, 'boxToPoint')
    lib(viewpoint, viewBox)

    assert.deepEqual(
      generateScalerStub.args[0],
      [ 'viewpoint', 'viewBox', 'boxToPoint' ]
    )
    assert.deepEqual(
      generateScalerStub.args[1],
      [ 'viewpoint', 'viewBox', 'pointToBox' ]
    )
  })
})