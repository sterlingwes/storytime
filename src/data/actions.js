import Dispatcher from "./dispatcher";
import Constants from "./constants";

let Actions = {
  
  setSelection(id) {
    Dispatcher.dispatch({
      actionType: Constants.SET_SELECTION,
      id: id
    });
  },
  
  addStory(project, name) {
    Dispatcher.dispatch({
      actionType: Constants.ADD_STORY,
      project: project,
      name: name
    });
  },
  
  deleteStory(storyId) {
    Dispatcher.dispatch({
      actionType: Constants.DELETE_STORY,
      storyId: storyId
    });
  },
  
};

module.exports = Actions;