export function pixels(state = {}, action) {
  switch (action.type) {
    /*
     *
     */
    case 'ADD_PIXEL':

      let clone = Object.assign({}, state)
      console.log(clone === state)
      console.log(clone, state)
      clone[action.data.coords.y] = Object.assign({}, clone[action.data.coords.y])
      clone[action.data.coords.y][action.data.coords.x] = {
        color: action.data.color
      }

      return clone
    default:
      return state
  }
}
