'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const Big = require('big.js')

const constructView = (vpw, vph, vbw, vbh) => {
  return {
    viewpoint: { width: Big(vpw), height: Big(vph) },
    viewBox: { width: Big(vbw), height: Big(vbh) }
  }
}

describe('scaler.condition', () => {
  let util, calculateTransformedLengthSpy
  let condition

  beforeEach(() => {
    util = require('../../../util')
    calculateTransformedLengthSpy = sinon.spy(util, 'calculateTransformedLength')
    condition = proxyquire('../../../lib/scaler/condition', {
      '../../util': util
    })
  })

  afterEach(() => {
    calculateTransformedLengthSpy.restore()
  })

  it('should export three functions', () => {
    assert.equal(typeof condition.isAspectRatioEqual, 'function')
    assert.equal(typeof condition.shouldScaleHorizontally, 'function')
    assert.equal(typeof condition.shouldScaleVertically, 'function')
  })

  describe('isAspectRatioEqual()', () => {
    it('should accept two arguments', () => {
      assert.equal(condition.isAspectRatioEqual.length, 2)
    })

    it('should return true if the aspect ratios of viewpoint and viewBox are equal', () => {
      let { viewpoint, viewBox } = constructView(50, 90, 100, 180)
      assert.equal(condition.isAspectRatioEqual(viewpoint, viewBox), true)
    })

    it('should return false otherwise', () => {
      let { viewpoint, viewBox } = constructView(50, 90, 100, 300)
      assert.equal(condition.isAspectRatioEqual(viewpoint, viewBox), false)
    })
  })

  describe('shouldScaleHorizontally()', () => {
    it('should accept two arguments', () => {
      assert.equal(condition.shouldScaleHorizontally.length, 2)
    })

    it('should return true if viewpoint\'s width is greater than scaled viewBox\'s width', () => {
      let { viewpoint, viewBox } = constructView(50, 90, 100, 300)
      assert.equal(condition.shouldScaleHorizontally(viewpoint, viewBox), true)
    })

    it('should return false otherwise', () => {
      let { viewpoint, viewBox } = constructView(50, 90, 100, 150)
      assert.equal(condition.shouldScaleHorizontally(viewpoint, viewBox), false)
    })

    it('should call util.calculateTransformedLength() with correct parameters', () => {
      let { viewpoint, viewBox } = constructView(50, 90, 100, 300)
      condition.shouldScaleHorizontally(viewpoint, viewBox)
      assert.deepEqual(
        calculateTransformedLengthSpy.args[0],
        [ viewpoint, viewBox, 'width', 'height' ]
      )
    })
  })

  describe('shouldScaleVertically()', () => {
    it('should accept two arguments', () => {
      assert.equal(condition.shouldScaleVertically.length, 2)
    })

    it('should return true if viewpoint\'s height is greater than scaled viewBox\'s height', () => {
      let { viewpoint, viewBox } = constructView(50, 90, 100, 150)
      assert.equal(condition.shouldScaleVertically(viewpoint, viewBox), true)
    })

    it('should return false otherwise', () => {
      let { viewpoint, viewBox } = constructView(50, 90, 100, 300)
      assert.equal(condition.shouldScaleVertically(viewpoint, viewBox), false)
    })

    it('should call util.calculateTransformedLength() with correct parameters', () => {
      let { viewpoint, viewBox } = constructView(50, 90, 100, 150)
      condition.shouldScaleVertically(viewpoint, viewBox)
      assert.deepEqual(
        calculateTransformedLengthSpy.args[0],
        [ viewpoint, viewBox, 'height', 'width' ]
      )
    })
  })
})