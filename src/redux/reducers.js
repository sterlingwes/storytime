var defaultState = {
  active: {},
  stories: []
}

function reducerFn (state, action) {
  state = state || defaultState
  var newState = state

  var items
  var index

  switch (action.type) {
    case 'loaded':
      newState = Object.assign({}, state, {stories: action.stories})
      break
    default:
      if (!/@@redux\//.test(action.type)) console.warn('%cUnhandled action -> ' + action.type, 'color: red')
      break
  }

  if (!/@@redux\//.test(action.type)) {
    console.info('%cACTION -> ' + action.type, 'font-weight: bold')
    console.log('%cOld state', 'color: #ccc', state)
    console.log('%cNew state', 'color: blue', newState)
  }
  return newState
}

function init (store) {
  // Action creators

  store.on('fetch', function () {
    var stories = JSON.parse(localStorage.getItem('st')) || []
    store.dispatch({type: 'loaded', stories: stories})
  })

}

module.exports = {fn: reducerFn, init: init}
