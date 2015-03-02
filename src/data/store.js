import EventEmitter from "events";
import assign from "object-assign";
import Dispatcher from "./dispatcher";
import Story from "../models/story";
import _ from "lodash";
import ActionHandlers from "./action_handlers";
import Actions from "./constants";

const StoreName = 'st'
    , Events = { CHANGE: 'change' };

class StoryStore {
  constructor(initRecords, changeListener) {
    assign(this, EventEmitter.EventEmitter.prototype);
    
    this.storeName = StoreName;
    this.stories = [];
    this.prefs = {};
    this.changeListener = changeListener;
    
    this.index = {};
    this.save(initRecords || this.read());
    
    quark.on('clearData', ()=> {
      this.clearAll();
      this.emitChange();
    });
    
    this.registerDispatcher();
  }
  
  fetch() {
    return this.stories.slice(0).sort().reverse();
  }
  
  count() {
    return this.stories.length;
  }
  
  get(index) {
    return this.stories[index];
  }
  
  getById(id) {
    return this.stories[this.index[id]];
  }
  
  add(storyProps, index) {
    let id = this.guid()
      , story = new Story(storyProps, id);
    this.index[id] = index || this.count();
    this.stories.push(story);
    this.persist();
    return story;
  }
  
  remove(id) {
    if(typeof this.index[id] === 'undefined') return false;
    this.stories.splice(this.index[id],1);
    this.reindex();
    this.persist();
  }
  
  reindex() {
    this.index = {};
    this.stories.forEach((story,indx) => {
      this.index[story.id] = indx;
    });
  }
  
  getPref(key) {
    return localStorage.getItem([StoreName,key].join('-'));
  }
  
  setPref(key,val) {
    localStorage.setItem([StoreName,key].join('-'), val);
  }
  
  /*
   * save(stories) saves the entire record set, hydrates the story json props
   * and sets up the index
   */
  save(stories) {
    let addedStories = [];
    if(stories && !_.isArray(stories)) stories = [stories];
    (stories || []).forEach( (storyProps, index) => {
      addedStories.push(this.add(storyProps, index));
    });
    
    this.persist();
    return addedStories;
  }
  
  persist() {
    localStorage.setItem(StoreName, JSON.stringify(this.stories));
  }
  
  /*
   * start(storyId) starts a new session timer for the targeted story
   */
  start(id) {
    let story = this.getById(id);
    if(story) story.newSession();
    this.persist();
  }
  
  /*
   * stop(storyId) stops the open session timer for the targeted story
   */
  stop(id) {
    let story = this.getById(id);
    if(story) story.endSession();
    this.persist();
  }
  
  started(id) {
    let story = this.getById(id);
    if(!story) return false;
    return story.hasOpenSession();
  }
  
  clearAll() {
    this.stories = [];
    localStorage.setItem(StoreName, '[]');
    this.emitChange();
  }
  
  read() {
    let records = [];
    try {
      records = JSON.parse(localStorage.getItem(StoreName));
    } catch(e) {}
    return records;
  }
  
  /*
   * Generate unique ids for records so that we can sort, add and remove and
   * persist references
   * http://stackoverflow.com/a/2117523/986611
   */
  guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
  
  //
  // Flux Event Handling =======================================================
  //

  emitChange() {
    let args = Array.prototype.slice.call(arguments);
    args.unshift(Events.CHANGE);
    this.emit.apply(this,args);
    quark.emit.apply(quark,args);
  }
  
  addChangeListener(cb) {
    this.on(Events.CHANGE, cb);
  }
  
  removeChangeListener(cb) {
    this.removeListener(Events.CHANGE, cb);
  }
  
  registerDispatcher() {
    this.dispatcherIndex = Dispatcher.register(payload => {
      let isChange = ActionHandlers.send(this, payload);
      if(isChange !== false) this.emitChange(payload);
    });
  }
  
}

module.exports = StoryStore;