let scaleFactor
  , storeMemo  // the previous state of each row
  , mouseDown
const MAX_PIXELS = 30

const PADDING = 30

window.storeMemo = storeMemo
import { setupStore, pixelStore } from './store'
import * as dispatchers from './dispatchers'
import { createSelector } from 'reselect'
import { areSameColor, throttle } from './util'

let currentColor = {
  r: 245,
  g: 193,
  b: 193,
  a: 255
}

function setupCanvas() {
  let context, size, pixel, canvas
  canvas = $('canvas').get(0)
  context = canvas.getContext('2d')
  size = Math.min(document.body.clientWidth - PADDING * 2, document.body.clientHeight - PADDING * 2)
  // round off to be divisible by MAX_PIXELS
  size = size - size % MAX_PIXELS
  canvas.width = size
  canvas.height = size
  canvas.style.width = size
  canvas.style.height = size
  scaleFactor = size / MAX_PIXELS
  context.scale(scaleFactor, scaleFactor)

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
  const {r, g, b, a} = color
  // const pixel = ctx.createImageData(pixelSize, pixelSize)
  // pixel.data[0] = color.r || 0
  // pixel.data[1] = color.g || 0
  // pixel.data[2] = color.g || 0
  // pixel.data[3] = color.a || 100
  // ctx.putImageData(pixel, x, y)
  ctx.fillStyle = `rgba(${r || 0}, ${g || 0},${b || 0}, ${a || 255})`
  ctx.fillRect(x, y, 1, 1)
}

const drawBox = (function() {
  let lastCoords = {
    x: 0,
    y: 0
  }
  return function(ctx, x, y, color = {}) {
    const {r, g, b, a} = color
    // color the lastCoords based on the current state of the store
    // y == rows, x == columns
    const pixel = store.getState().pixels[lastCoords.y]
    const oldColor = (pixel && pixel[lastCoords.x] && pixel[lastCoords.x].color) || {
      r: 255,
      g: 255,
      b: 255,
      a: 255
    }

    // with old color
    ctx.fillStyle =
      `rgba(${oldColor.r || 0}, ${oldColor.g || 0},${oldColor.b || 0}, ${oldColor.a || 255})`
    ctx.fillRect(lastCoords.x, lastCoords.y, 1, 1)

    ctx.fillStyle = `rgba(${r || 0}, ${g || 0},${b || 0}, ${a || 255})`
    ctx.fillRect(x, y, 1, 1)
    lastCoords.x = x
    lastCoords.y = y
  }
})();

(function() {
  let store
  window.store = store = setupStore()
  storeMemo = store.getState()
  $(function() {
    let unsubscribe, rowSelectors, rowSelection
    let canvas = setupCanvas()
      , context = canvas.getContext('2d')

    canvas.addEventListener('click', function(evt) {
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

    canvas.addEventListener('mousedown', function(evt) {
      mouseDown = true
    })

    document.addEventListener('mouseup', function(evt) {
      mouseDown = false
    })

    canvas.addEventListener('mousemove', throttle(function(evt) {
      drawBox(context, Math.floor(evt.offsetX / scaleFactor), Math.floor(evt.offsetY / scaleFactor), currentColor)

      if (mouseDown) {
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
      }
    }, 50))

    rowSelectors = []

    for(let i=0; i < MAX_PIXELS; i++) {
      rowSelectors.push((state) => {
        return state.pixels[i]
      })
    }

    // basically just reconstructs the store. not necessary, but doing it to try
    // out selectors
    rowSelection = createSelector(rowSelectors, (...rows) => {
      let row
        , ret = {pixels: {}}
      for (let i=0; i < rows.length; i++) {
        ret.pixels[i] = rows[i]
      }
      return ret
    })

    // render and check each row individually using selectors.
    // for each row, subscribe, and select state, and on change,
    // select the row
    unsubscribe = store.subscribe(() => {
      let rowMap
      const newState = store.getState()

      // state changed, go through and update canvas
      rowMap = rowSelection(newState)
      // run through rowMap
      for (let row in rowMap.pixels) {
        if (rowMap.pixels[row] && rowMap.pixels[row] !== storeMemo.pixels[row]) {
          // for every pixel in the row, if the color hasn't changed then
          // update the color
          for (let column in rowMap.pixels[row]) {
            if (!rowMap.pixels[row]) {
              continue
            }
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
    })

  })
})()
