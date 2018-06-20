'use strict'

const assert = require('chai').assert
const Big = require('big.js')

describe('boxToPoint.scaler', () => {
  let scaler, scaleEqual, scaleTransform
  let points, parameters

  beforeEach(() => {
    points = [ Big(25), Big(50), Big(75) ]
    parameters = {
      l: Big(50),
      L: Big(100),
      hl: Big(25),
      hL: Big(50),
      dl: Big(10) // absolute(50 - (100 * 90 / 300)) / 2
    }
    scaler = require('../../../../lib/scaler/boxToPoint/scaler')
    scaleEqual = scaler.scaleEqual
    scaleTransform = scaler.scaleTransform
  })

  it('should export two functions', () => {
    assert.equal(typeof scaleEqual, 'function')
    assert.equal(typeof scaleTransform, 'function')
  })

  describe('scaleEqual', () => {
    it('should accept two arguments', () => {
      assert.equal(scaleEqual.length, 2)
    })

    it('should calculate the scaled value correctly', () => {
      let { l, L } = parameters
      let expectedScaledPoints = points.map(point => {
        return point.mul(l).div(L)
      })
      let actualScaledPoints = points.map(point => {
        return scaleEqual(point, parameters)
      })

      for (let i = 0; i < points.length; i++) {
        assert.equal(expectedScaledPoints[i].eq(actualScaledPoints[i]), true)
      }
    })
  })

  describe('scaleTransform()', () => {
    it('should accept two arguments', () => {
      assert.equal(scaleTransform.length, 2)
    })

    describe('viewpoint: 0%-49%', () => {
      it('should calculate the scaled value correctly', () => {
        let { L, dl, hl } = parameters
        let expectedScaledPoints = points.map(point => {
          return hl.minus(Big(1).minus(point.mul(2).div(L)).mul(hl.minus(dl)))
        })
        let actualScaledPoints = points.map(point => {
          return scaleTransform(point, parameters)
        })

        for (let i = 0; i < points.length; i++) {
          assert.equal(expectedScaledPoints[i].eq(actualScaledPoints[i]), true)
        }
      })
    })

    describe('viewpoint: 50%-100%', () => {
      it('should calculate the scaled value correctly', () => {
        let { L, dl, hl } = parameters
        let expectedScaledPoints = points.map(point => {
          return hl.plus((point.mul(2).div(L)).minus(1).mul(hl.minus(dl)))
        })
        let actualScaledPoints = points.map(point => {
          return scaleTransform(point, parameters)
        })

        for (let i = 0; i < points.length; i++) {
          assert.equal(expectedScaledPoints[i].eq(actualScaledPoints[i]), true)
        }
      })
    })
  })
})