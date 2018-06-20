'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const Big = require('big.js')

describe('pointToBox', () => {
  let constructParameters, parameters
  let scaleEqual, scaleTransform
  let equalPoint, transformPoint, viewpoint, viewBox
  let init

  beforeEach(() => {
    parameters = {
      width: 'width',
      height: 'height'
    }
    equalPoint = Big(42)
    transformPoint = Big(84)
    viewpoint = 'viewpoint'
    viewBox = 'viewBox'
    constructParameters = sinon.stub().returns(parameters)
    scaleEqual = sinon.stub().returns(equalPoint)
    scaleTransform = sinon.stub().returns(transformPoint)
    init = proxyquire('../../../../lib/scaler/pointToBox', {
      '../../../util': { constructParameters },
      './scaler': { scaleEqual, scaleTransform }
    })
  })

  it('should export one function', () => {
    assert.equal(typeof init, 'function')
  })

  describe('init()', () => {
    it('should accept three arguments', () => {
      assert.equal(init.length, 3)
    })

    it('should return a function', () => {
      let transformer = init(viewpoint, viewBox, 'equal')
      assert.equal(typeof transformer, 'function')
    })

    it('should call util.constructParameters() with correct parameters', () => {
      init(viewpoint, viewBox, 'equal')
      assert.deepEqual(constructParameters.args[0], [ 'viewpoint', 'viewBox','equal' ])
    })

    describe('transformer', () => {
      let points, transformer
      let xParameters, yParameters

      beforeEach(() => {
        points = { x: 4, y: 2 }
        xParameters = [ Big(points.x), parameters.width ]
        yParameters = [ Big(points.y), parameters.height ]
      })

      describe('equal', () => {
        beforeEach(() => transformer = init(viewpoint, viewBox, 'equal'))

        it('should return a coordinate pair', () => {
          let transformedPoints = transformer(points)
          assert.deepEqual(transformedPoints, { x: '42', y: '42' })
        })

        it('should call scaler.scaleEqual twice', () => {
          transformer(points)
          assert.deepEqual(scaleEqual.args[0], xParameters)
          assert.deepEqual(scaleEqual.args[1], yParameters)
        })
      })

      describe('scaler.width', () => {
        beforeEach(() => transformer = init(viewpoint, viewBox, 'width'))

        it('should return a coordinate pair', () => {
          let transformedPoints = transformer(points)
          assert.deepEqual(transformedPoints, { x: '84', y: '42' })
        })

        it('should call scaler.scaleTransform on \'points.x\'', () => {
          transformer(points)
          assert.deepEqual(scaleTransform.args[0], xParameters)
        })

        it('should call scaler.scaleEqual on \'points.y\'', () => {
          transformer(points)
          assert.deepEqual(scaleEqual.args[0], yParameters)
        })
      })

      describe('scaler.height', () => {
        beforeEach(() => transformer = init(viewpoint, viewBox, 'height'))

        it('should return a coordinate pair', () => {
          let transformedPoints = transformer(points)
          assert.deepEqual(transformedPoints, { x: '42', y: '84' })
        })

        it('should call scaler.scaleEqual on \'points.x\'', () => {
          transformer(points)
          assert.deepEqual(scaleEqual.args[0], xParameters)
        })

        it('should call scaler.scaleTransform on \'points.y\'', () => {
          transformer(points)
          assert.deepEqual(scaleTransform.args[0], yParameters)
        })
      })
    })

  })
})