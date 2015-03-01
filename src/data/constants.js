const actions = [
  'ADD_STORY',
  'DELETE_STORY',
  'ADD_SESSION',
  'DESTROY_SESSION',
  'SET_SELECTION'
]

let constantMapping = {};

function camelize(str) {
  let words = str.split(/[^a-z]/gi);
  return words.map((word,i) => {
    return i===0 ? word.toLowerCase() : word[0] + word.substr(1).toLowerCase();
  }).join('');
}

actions.forEach(action => {
  constantMapping[action] = camelize(action);
});

module.exports = constantMapping;