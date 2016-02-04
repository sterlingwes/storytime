import riot from 'riot'
import Reducer from './redux/reducers'
import ReduxMixin from './redux/riot.mixin'
import { combineReducers, createStore } from 'redux'

import './app.styl'
import './app.tag'
import './stsummary.tag'
import './stlistview.tag'
import './stsearch.tag'

var RootReducer = combineReducers({
  stories: Reducer.fn
})

var Store = ReduxMixin(createStore(RootReducer /*, initialState */))

Reducer.init(Store)

riot.mount('app')
riot.route.base('/')
riot.route.start(true)
