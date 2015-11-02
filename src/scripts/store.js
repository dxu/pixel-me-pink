import {combineReducers, compose, createStore} from 'redux'
import {devTools, persistState} from 'redux-devtools'
import {pixels} from './reducers'

export let pixelStore

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
 * The Store:
 * {
 *   pixels: [
 *
 *   ]
 * }
 */
export function setupStore() {
  pixelStore = createEnhancedStore(pixelReducers, {pixels: []})
}
