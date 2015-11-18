import {getStore} from './store'
import {ADD_PIXEL, REMOVE_PIXEL} from './actions'

export const addPixel = (options) => {
  const {color = {}, coords = {}} = options
  // assign defaults
  color.r = color.r || 0
  color.g = color.g || 0
  color.b = color.b || 0
  color.a = color.a || 255

  coords.column = coords.x || 0
  coords.row = coords.y || 0

  getStore().dispatch({
    type: ADD_PIXEL,
    data: {
      color,
      row: coords.y,
      column: coords.x
    }
  })
}

