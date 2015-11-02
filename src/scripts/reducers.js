export function pixels(state = [], action) {
  switch (action.type) {
    case 'ADD_PIXEL':
      return [
        ...state.slice(0),
        action.data
      ]
    default:
      return state
  }
}
