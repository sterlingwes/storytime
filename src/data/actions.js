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
  
  startTimer(storyId) {
    Dispatcher.dispatch({
      actionType: Constants.START_TIMER,
      storyId: storyId
    });
  },
  
  stopTimer(storyId) {
    Dispatcher.dispatch({
      actionType: Constants.STOP_TIMER,
      storyId: storyId
    });
  },
  
  offsetTime(storyId, day, msecs) {
    Dispatcher.dispatch({
      actionType: Constants.OFFSET_TIMER,
      storyId: storyId,
      day: day,
      msecs: msecs
    });
  }
  
};

module.exports = Actions;