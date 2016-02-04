import riot from 'riot'
import Reducer from './redux/reducers'
import ReduxMixin from './redux/riot.mixin'
import { combineReducers, createStore } from 'redux'

import './app.tag'
import './todo.tag'

var RootReducer = combineReducers({
  todo: Reducer.fn
})

var Store = ReduxMixin(createStore(RootReducer /*, initialState */))

Reducer.init(Store)

riot.mount('app')
riot.route.base('/')
riot.route.start(true)
