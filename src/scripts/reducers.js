export function pixels(state = {}, action) {
  switch (action.type) {
    /*
     *
     */
    case 'ADD_PIXEL':

      let clone = Object.assign({}, state)
      console.log(clone === state)
      console.log(clone, state)
      clone[action.data.row] = Object.assign({}, clone[action.data.row])
      clone[action.data.row][action.data.column] = {
        color: action.data.color
      }

      return clone
    default:
      return state
  }
}
