'use strict'

const viewPoint = { width: 50, height: 90 }
const viewBox = { width: 100, height: 300 }

const Mapper = require('./')
const mapPointToBox = Mapper(viewPoint, viewBox, 'pointToBox')
const mapBoxToPoint = Mapper(viewPoint, viewBox, 'boxToPoint')

console.log('mapPointToBox, x: 32.5, y: 30', mapPointToBox({ x: 32.5, y: 30 }))
console.log('mapBoxToPoint, x: 75, y: 100', mapBoxToPoint({ x: 75, y: 100 }))