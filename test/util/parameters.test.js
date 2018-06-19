'use strict'

const assert = require('chai').assert
const Big = require('big.js')

describe('util.parameters', () => {
  let parameters, viewpoint, viewBox

  beforeEach(() => {
    viewpoint = {
      width: Big(50),
      height: Big(90)
    }
    viewBox = {
      width: Big(100),
      height: Big(300)
    }
    parameters = require('../../util/parameters')
  })

  it('should export two functions', () => {
    assert.equal(typeof parameters.constructParametersEqual, 'function')
    assert.equal(typeof parameters.constructParametersTransform, 'function')
  })

  describe('constructParametersEqual()', () => {
    it('should accept three arguments', () => {
      assert.equal(parameters.constructParametersEqual.length, 3)
    })

    it('should return an object with two properties', () => {
      let width = parameters.constructParametersEqual(viewpoint, viewBox, 'width')
      let height = parameters.constructParametersEqual(viewpoint, viewBox, 'height')

      assert.deepEqual(width, {
        l: viewpoint.width,
        L: viewBox.width
      })
      assert.deepEqual(height, {
        l: viewpoint.height,
        L: viewBox.height
      })
    })
  })

  describe('constructParametersTransform()', () => {
    it('should accept four arguments', () => {
      assert.equal(parameters.constructParametersTransform.length, 4)
    })

    it('should return an object with five properties', () => {
      let parameter = parameters.constructParametersTransform(viewpoint, viewBox, 'width', 'height')
      assert.deepEqual(Object.keys(parameter), [ 'l', 'L', 'hl', 'hL', 'dl' ])
    })

    it('should calculate each parameter\'s values correctly - transform width', () => {
      let expectedParameters = {
        l: Big(50),
        L: Big(100),
        hl: Big(25),
        hL: Big(50),
        dl: Big(10) // absolute(50 - (100 * 90 / 300)) / 2
      }
      let actualParameters = parameters.constructParametersTransform(viewpoint, viewBox, 'width', 'height')
      assert.deepEqual(actualParameters, expectedParameters)
    })

    it('should calculate each parameter\'s values correctly - transform height', () => {
      let expectedParameters = {
        l: Big(90),
        L: Big(300),
        hl: Big(45),
        hL: Big(150),
        dl: Big(30) // absolute(90 - (300 * 50 / 100)) / 2
      }
      let actualParameters = parameters.constructParametersTransform(viewpoint, viewBox, 'height', 'width')
      assert.deepEqual(actualParameters, expectedParameters)
    })
  })
})