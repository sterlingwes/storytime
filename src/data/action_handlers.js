import _ from "lodash";

const ActionHandler = {
  
  /*
   * "Gatekeeper" method for handlers to first ensure it's been defined and
   *  warn if it's not. context is the Store context to bind to the handler.
   */
  send(context, payload) {
    let actionName = payload.actionType;
    if(typeof ActionHandler[actionName] !== 'function') {
      throw new Error('No ActionHandler found for ' + actionName);
    }
    return ActionHandler[actionName].call(context, payload);
  },
  
  //
  // Action Handlers, bound to Store context ===================================
  //
  
  // LISTVIEW STATE
  
  setSelection(payload) {
    this.setPref('selection', payload.id);
  },
  
  // STORIES
  
  addStory(payload) {
    let added = this.save(_.pick(payload, 'project', 'name'));
    this.setPref('selection', added[0].id);
  },
  
  deleteStory(payload) {
    this.remove(payload.storyId);
  },
  
  addSession(payload) {

  }
  
}

module.exports = ActionHandler;