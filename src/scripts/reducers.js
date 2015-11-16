export function pixels(state = [], action) {
  switch (action.type) {
    /*
     *
     */
    case 'ADD_PIXEL':

      let clone = Object.assign({}, state)
      clone[action.data.coords.x] = clone[action.data.coords.x] || {}
      clone[action.data.coords.x][action.data.coords.y] = {
        color: action.data.color
      }

      return clone
    default:
      return state
  }
}
