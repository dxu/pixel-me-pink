import {pixelStore} from './store'
import {ADD_PIXEL, REMOVE_PIXEL} from './actions'

export const addPixel = (options) => {
  const {color = {}, coords = {}} = options
  // assign defaults
  color.r = color.r || 0
  color.g = color.g || 0
  color.b = color.b || 0
  color.a = color.a || 255

  coords.x = coords.x || 0
  coords.y = coords.y || 0

  pixelStore.dispatch({
    type: ADD_PIXEL,
    data: {
      color,
      coords
    }
  })
}
