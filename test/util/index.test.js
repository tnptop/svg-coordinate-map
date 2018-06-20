'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const Big = require('big.js')

describe('util', () => {
  let util, viewpoint, viewBox
  let parameters, constructParametersEqualSpy, constructParametersTransformSpy

  beforeEach(() => {
    parameters = require('../../util/parameters')
    constructParametersEqualSpy = sinon.spy(parameters, 'constructParametersEqual')
    constructParametersTransformSpy = sinon.spy(parameters, 'constructParametersTransform')

    util = proxyquire('../../util', {
      './parameters': parameters
    })
  })

  afterEach(() => {
    constructParametersEqualSpy.restore()
    constructParametersTransformSpy.restore()
  })

  it('should export three functions', () => {
    assert.equal(typeof util.calculateTransformedLength, 'function')
    assert.equal(typeof util.constructDimensions, 'function')
    assert.equal(typeof util.constructParameters, 'function')
  })

  describe('calculateTransformedLength()', () => {
    let transformedLength

    before(() => {
      viewpoint = {
        width: Big(50),
        height: Big(90)
      }
      viewBox = {
        width: Big(100),
        height: Big(300)
      }
      // 100 * 90 / 300
      transformedLength = viewBox.width.mul(viewpoint.height.div(viewBox.height))
    })

    it('should accept four arguments', () => {
      assert.equal(util.calculateTransformedLength.length, 4)
    })

    it('should return an instance of big.js with a value of transformed length', () => {
      assert.deepEqual(
        util.calculateTransformedLength(viewpoint, viewBox, 'width', 'height'),
        transformedLength
      )
    })
  })

  describe('constructDimensions()', () => {
    before(() => {
      viewpoint = {
        width: 50,
        height: 90
      }
      viewBox = {
        width: 100,
        height: 300
      }
    })

    it('should accept one argument', () => {
      assert.equal(util.constructDimensions.length, 1)
    })

    it('should return an object with two properties', () => {
      let dimensions = util.constructDimensions(viewpoint)
      assert.deepEqual(Object.keys(dimensions), [ 'width', 'height' ])
    })

    it('should convert decimal numbers to instances of big.js', () => {
      let dimensions = util.constructDimensions(viewpoint)
      assert.deepEqual(dimensions, {
        width: Big(viewpoint.width),
        height: Big(viewpoint.height)
      })
    })
  })

  describe('constructParameters()', () => {
    let equalParameters, widthParameters, heightParameters

    before(() => {
      viewpoint = {
        width: Big(50),
        height: Big(90)
      }
      viewBox = {
        width: Big(100),
        height: Big(300)
      }

      // avoid using spied functions to not mess with callCount
      let {
        constructParametersEqual,
        constructParametersTransform
      } = require('../../util/parameters')
      let equalWidth = constructParametersEqual(viewpoint, viewBox, 'width')
      let equalHeight = constructParametersEqual(viewpoint, viewBox, 'height')
      let transformedWidth = constructParametersTransform(viewpoint, viewBox, 'width', 'height')
      let transformedHeight = constructParametersTransform(viewpoint, viewBox, 'height', 'width')
      equalParameters = { width: equalWidth, height: equalHeight }
      widthParameters = { width: transformedWidth, height: equalHeight }
      heightParameters = { width: equalWidth, height: transformedHeight }
    })

    it('should accept three arguments', () => {
      assert.equal(util.constructParameters.length, 3)
    })

    it('should return an object with two properties', () => {
      let params = util.constructParameters(viewpoint, viewBox, 'width')
      assert.deepEqual(Object.keys(params), [ 'width', 'height' ])
    })

    it('should call parameters.constructParametersEqual() twice', () => {
      let sides = [ 'width', 'height' ]
      util.constructParameters(viewpoint, viewBox, 'width')
      assert.equal(constructParametersEqualSpy.callCount, 2)
      sides.forEach((side, index) => {
        assert.deepEqual(constructParametersEqualSpy.args[index], [ viewpoint, viewBox, side ])
      })
    })

    it('should call parameters.constructParametersTransform() twice', () => {
      let sides = [
        [ 'width', 'height' ],
        [ 'height', 'width' ]
      ]
      util.constructParameters(viewpoint, viewBox, 'width')
      assert.equal(constructParametersTransformSpy.callCount, 2)
      sides.forEach((side, index) => {
        assert.deepEqual(
          constructParametersTransformSpy.args[index],
          [ viewpoint, viewBox, ...side ]
        )
      })
    })

    it('should return correct pair of properties - equal', () => {
      let params = util.constructParameters(viewpoint, viewBox, 'equal')
      assert.deepEqual(params, equalParameters)
    })

    it('should return correct pair of properties - width', () => {
      let params = util.constructParameters(viewpoint, viewBox, 'width')
      assert.deepEqual(params, widthParameters)
    })

    it('should return correct pair of properties - height', () => {
      let params = util.constructParameters(viewpoint, viewBox, 'height')
      assert.deepEqual(params, heightParameters)
    })
  })
})