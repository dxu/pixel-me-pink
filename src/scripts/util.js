export function areSameColor(color1, color2) {
  if (!(color1 && color2)) {
    return false
  }
  let a = color1.r === color2.r && color1.g === color2.g &&
    color1.b === color2.b && color1.a === color2.a
  console.log('a', a)
  return a
}
