let canvas
function createPixel(ctx, x = 0, y = 0, color = {}) {
  const pixel = ctx.createImageData(1, 1)
  pixel.data[0] = color.r || 0
  pixel.data[1] = color.g || 0
  pixel.data[2] = color.g || 0
  pixel.data[3] = color.a || 100
  ctx.putImageData(pixel, x, y)
}
(function() {
  $(function() {
    let context, size, pixel
    window.canvas = canvas = $('canvas').get(0)
    context = canvas.getContext('2d')
    canvas.width = 50
    canvas.height = 50
    size = Math.min(document.body.clientWidth, document.body.clientHeight)
    canvas.style.width = size
    canvas.style.height = size
    context.imageSmoothingEnabled = false
    context.mozImageSmoothingEnabled = false
    // context.webkitImageSmoothingEnabled = false
    context.msImageSmoothingEnabled = false

    createPixel(context, 1, 1, {
      r: 0,
      g: 0,
      b: 0,
      a: 255
    })
  })
})()
