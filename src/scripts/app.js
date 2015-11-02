let scaleFactor
const MAX_PIXELS = 30

function setupCanvas() {
  let context, size, pixel, canvas
  canvas = $('canvas').get(0)
  context = canvas.getContext('2d')
  size = Math.min(document.body.clientWidth, document.body.clientHeight)
  console.log(size)
  // round off to be divisible by MAX_PIXELS
  size = size - size % MAX_PIXELS
  console.log(size)
  canvas.width = size
  canvas.height = size
  canvas.style.width = size
  canvas.style.height = size
  scaleFactor = size / MAX_PIXELS
  context.scale(scaleFactor, scaleFactor)
  console.log(scaleFactor)

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
  console.log(x, y)
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
  $(function() {
    let canvas = setupCanvas()
      , context = canvas.getContext('2d')

    canvas.addEventListener('click', function(evt) {
      console.log(evt)

      Math.floor(evt.offsetX / scaleFactor) * scaleFactor
      createPixel(context,
                  Math.floor(evt.offsetX / scaleFactor),
                  Math.floor(evt.offsetY / scaleFactor),
                  {})

    })

    createPixel(context, 1, 1, {
      r: 0,
      g: 0,
      b: 0,
      a: 255
    })
  })
})()
