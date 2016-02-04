// simulating async request
function fetchTodo (callback) {
  var todo = {
    title: 'I want to behave!',
    items: [
      { title: 'Avoid excessive caffeine', done: true },
      { title: 'Hidden item', hidden: true },
      { title: 'Be less provocative' },
      { title: 'Be nice to people' }
    ]
  }
  setTimeout(function () {
    callback(todo)
  }, 500)
}

var defaultState = {title: '...loading', items: []}

function reducerFn (state, action) {
  state = state || defaultState
  var newState = state

  var items
  var index

  switch (action.type) {
    case 'load_todo':
      newState = action.todo
      break
    case 'add_item':
      items = state.items.concat([action.item])
      newState = Object.assign({}, state, {items: items})
      break
    case 'toggle_item_done':
      index = action.index
      var item = state.items[index]
      item = Object.assign({}, item, {done: !item.done})
      items = state.items.slice(0, index).concat([item], state.items.slice(index + 1))
      newState = Object.assign({}, state, {items: items})
      break
    case 'remove_item':
      index = action.index
      items = state.items.filter(function (_, i) {
        return i !== index
      })
      newState = Object.assign({}, state, {items: items})
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

  store.on('fetch-todo', function () {
    fetchTodo(function (todo) {
      store.dispatch({type: 'load_todo', todo: todo})
    })
  })

}

module.exports = {fn: reducerFn, init: init}
