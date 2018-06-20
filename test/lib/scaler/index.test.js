'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const requireScaler = (condition, pointToBox, boxToPoint) => {
  return proxyquire('../../../lib/scaler', {
    './condition': condition,
    './pointToBox': pointToBox,
    './boxToPoint': boxToPoint
  })
}

describe('scaler', () => {
  let scaler, viewpoint, viewBox
  let pointTobox, boxToPoint
  let isAspectRatioEqual, shouldScaleHorizontally, shouldScaleVertically

  beforeEach(() => {
    viewpoint = 'viewpoint'
    viewBox = 'viewBox'
    isAspectRatioEqual = sinon.stub()
    shouldScaleHorizontally = sinon.stub()
    shouldScaleVertically = sinon.stub()
    pointTobox = sinon.stub().returns((vp, vb, method) => {})
    boxToPoint = sinon.stub().returns((vp, vb, method) => {})

    scaler = requireScaler({
      isAspectRatioEqual,
      shouldScaleHorizontally,
      shouldScaleVertically
    }, pointTobox, boxToPoint)
  })

  it('should export one function', () => {
    assert.equal(typeof scaler, 'function')
  })

  describe('generateScaler()', () => {
    it('should accept three arguments', () => {
      assert.equal(scaler.length, 3)
    })

    it('should call condition flags with correct parameters', () => {
      scaler(viewpoint, viewBox, 'pointToBox')

      assert.deepEqual(isAspectRatioEqual.args[0], ['viewpoint', 'viewBox'])
      assert.deepEqual(shouldScaleHorizontally.args[0], ['viewpoint', 'viewBox'])
      assert.deepEqual(shouldScaleVertically.args[0], ['viewpoint', 'viewBox'])
    })

    describe('equal', () => {
      beforeEach(() => {
        isAspectRatioEqual.returns(true)
        shouldScaleHorizontally.returns(false)
        shouldScaleVertically.returns(false)
        scaler = requireScaler({
          isAspectRatioEqual,
          shouldScaleHorizontally,
          shouldScaleVertically
        }, pointTobox, boxToPoint)
      })

      it('should return a scaler with \'equal\' method', () => {
        let pointToBoxScaler = scaler(viewpoint, viewBox, 'pointToBox')
        let boxToPointScaler = scaler(viewpoint, viewBox, 'boxToPoint')

        assert.equal(typeof pointToBoxScaler, 'function')
        assert.deepEqual(pointTobox.args[0], ['viewpoint', 'viewBox', 'equal'])
        assert.equal(typeof boxToPointScaler, 'function')
        assert.deepEqual(boxToPoint.args[0], ['viewpoint', 'viewBox', 'equal'])
      })
    })

    describe('width', () => {
      beforeEach(() => {
        isAspectRatioEqual.returns(false)
        shouldScaleHorizontally.returns(true)
        shouldScaleVertically.returns(false)
        scaler = requireScaler({
          isAspectRatioEqual,
          shouldScaleHorizontally,
          shouldScaleVertically
        }, pointTobox, boxToPoint)
      })

      it('should return a scaler with \'width\' method', () => {
        let pointToBoxScaler = scaler(viewpoint, viewBox, 'pointToBox')
        let boxToPointScaler = scaler(viewpoint, viewBox, 'boxToPoint')

        assert.equal(typeof pointToBoxScaler, 'function')
        assert.deepEqual(pointTobox.args[0], ['viewpoint', 'viewBox', 'width'])
        assert.equal(typeof boxToPointScaler, 'function')
        assert.deepEqual(boxToPoint.args[0], ['viewpoint', 'viewBox', 'width'])
      })
    })

    describe('height', () => {
      beforeEach(() => {
        isAspectRatioEqual.returns(false)
        shouldScaleHorizontally.returns(false)
        shouldScaleVertically.returns(true)
        scaler = requireScaler({
          isAspectRatioEqual,
          shouldScaleHorizontally,
          shouldScaleVertically
        }, pointTobox, boxToPoint)
      })

      it('should return a scaler with \'height\' method', () => {
        let pointToBoxScaler = scaler(viewpoint, viewBox, 'pointToBox')
        let boxToPointScaler = scaler(viewpoint, viewBox, 'boxToPoint')

        assert.equal(typeof pointToBoxScaler, 'function')
        assert.deepEqual(pointTobox.args[0], ['viewpoint', 'viewBox', 'height'])
        assert.equal(typeof boxToPointScaler, 'function')
        assert.deepEqual(boxToPoint.args[0], ['viewpoint', 'viewBox', 'height'])
      })
    })
  })
})