let scaleFactor
  , storeMemo  // the previous state of each row
const MAX_PIXELS = 30

window.storeMemo = storeMemo
import {setupStore, pixelStore} from './store'
import * as dispatchers from './dispatchers'
import { createSelector } from 'reselect'
import { areSameColor } from './util'


function setupCanvas() {
  let context, size, pixel, canvas
  canvas = $('canvas').get(0)
  context = canvas.getContext('2d')
  size = Math.min(document.body.clientWidth, document.body.clientHeight)
  // console.log(size)
  // round off to be divisible by MAX_PIXELS
  size = size - size % MAX_PIXELS
  // console.log(size)
  canvas.width = size
  canvas.height = size
  canvas.style.width = size
  canvas.style.height = size
  scaleFactor = size / MAX_PIXELS
  context.scale(scaleFactor, scaleFactor)
  // console.log(scaleFactor)

  context.imageSmoothingEnabled = false
  context.mozImageSmoothingEnabled = false
  // context.webkitImageSmoothingEnabled = false
  context.msImageSmoothingEnabled = false
  return canvas
}

function hDivisible(dividend, divisor) {
  return Math.floor(dividend / divisor) * divisor
}

function createPixel(ctx, x = 0, y = 0, color = {}) {
  // console.log(x, y)
  let {r, g, b, a} = color
  // const pixel = ctx.createImageData(pixelSize, pixelSize)
  // pixel.data[0] = color.r || 0
  // pixel.data[1] = color.g || 0
  // pixel.data[2] = color.g || 0
  // pixel.data[3] = color.a || 100
  // ctx.putImageData(pixel, x, y)
  ctx.fillStyle = `rgba(${r || 0}, ${g || 0},${b || 0}, ${a || 255})`
  ctx.fillRect(x, y, 1, 1)
}


(function() {
  let store, unsubscribe, rowSelectors
  window.store = store = setupStore()
  storeMemo = store.getState()
  $(function() {
    let canvas = setupCanvas()
      , context = canvas.getContext('2d')

    canvas.addEventListener('click', function(evt) {
      // console.log(evt)

      Math.floor(evt.offsetX / scaleFactor) * scaleFactor


      dispatchers.addPixel({
        coords: {
          x: Math.floor(evt.offsetX / scaleFactor),
          y: Math.floor(evt.offsetY / scaleFactor),
        },
        color: {
          r: 0,
          g: 0,
          b: 0,
          a: 255
        }
      })
    })


    rowSelectors = []

    for(let i=0; i < MAX_PIXELS; i++) {
      rowSelectors.push((state) => {
        // console.log(state.pixels)
        return state.pixels[i]
      })
    }

    let rowSelection
    // basically just reconstructs the store. not necessary, but doing it to try
    // out selectors
    rowSelection = createSelector(rowSelectors, (...rows) => {
      let row
        , ret = {pixels: {}}
      // console.log('hi', rows)
      for (let i=0; i < rows.length; i++) {
        ret.pixels[i] = rows[i]
      }
      return ret
    })

    // render and check each row individually using selectors.
    // for each row, subscribe, and select state, and on change,
    // select the row
    unsubscribe = store.subscribe(() => {
      console.log('this is the storememo', storeMemo)
      let rowMap
      const newState = store.getState()
      console.log(storeMemo === newState)
      console.log(storeMemo.pixels[0] === newState.pixels[0])

      // state changed, go through and update canvas
      rowMap = rowSelection(newState)
      // run through rowMap
      for (let row in rowMap.pixels) {
        // console.log(row, storeMemo.pixels)
        // console.log('here', storeMemo.pixels[row], rowMap.pixels[row])
        // console.log(rowMap.pixels[row], storeMemo.pixels[row])
        if (rowMap.pixels[row] && rowMap.pixels[row] !== storeMemo.pixels[row]) {
          // console.log(rowMap.pixels[row])

          // for every pixel in the row, if the color hasn't changed then
          // update the color
          for (let column in rowMap.pixels[row]) {
            // console.log('once')
            if (!rowMap.pixels[row]) {
              // console.log('shouldnt')
              continue
            }
            // console.log('column', column)
            let pixel1 = rowMap.pixels[row] && rowMap.pixels[row][column] || {}
              , pixel2 = storeMemo.pixels[row] && storeMemo.pixels[row][column] || {}
            if (!areSameColor(pixel1.colors, pixel2.colors)) {
              createPixel(context, column, row, rowMap.pixels[row][column])
            }
          }

        }
      }

      // for each item in the rowMap, check if it's equal to the state.

      // update the previous state
      storeMemo = newState
      console.log('new state', newState)

    })


  })
})()
