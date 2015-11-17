import {combineReducers, compose, createStore} from 'redux'
import {devTools, persistState} from 'redux-devtools'
import {pixels} from './reducers'

let pixelStore, observablePixelStore

const pixelReducers = combineReducers({
  pixels
})

const createEnhancedStore = compose(
  // Provides support for DevTools:
  devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore)

/*
 * The Store should be modeled as a tree. In order to allow for efficient
 * updates to the canvas element, structure the canvas of pixels as a tree
 * of rows to columns, with the leaf nodes representing the pixel metadata.
 * {
 *   pixels: {
 *     <x>:
 *       <y>:
 *         color: <color>
 *   }
 *
 * }
 * RETURNS AN Rx OBSERVABLE to mask the store from the client
 */
export function setupStore() {
  pixelStore = createEnhancedStore(pixelReducers, {pixels: {}})
  // TODO: create and return the observablePixelStore
  return pixelStore
}

export function getStore() {
  // TODO: return an observable
  return pixelStore
}
