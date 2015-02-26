import Story from "../models/story";
import _ from "lodash";

const StoreName = 'st';

class StoryStore {
  constructor(initRecords, changeListener) {
    this.storeName = StoreName;
    this.stories = [];
    this.changeListener = changeListener;
    
    this.index = {};
    this.save(initRecords || this.read());
    
    quark.on('clearData', ()=> {
      this.clearAll();
      this.resetListener();
    });
  }
  
  setListener(changeListener) {
    this.changeListener = changeListener;
  }
  
  resetListener() {
    if(typeof this.changeListener === 'function')
      this.changeListener();
  }
  
  fetch() {
    return this.stories.slice(0).sort();
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
    let id = this.guid();
    this.index[id] = index || this.count();
    this.stories.push(new Story(storyProps, id));
    this.persist();
  }
  
  remove(id) {
    if(!this.index[id]) return false;
    this.stories.splice(this.index[id],1);
    this.persist();
  }
  
  /*
   * save(stories) saves the entire record set, hydrates the story json props
   * and sets up the index
   */
  save(stories) {
    if(stories && !_.isArray(stories)) stories = [stories];
    (stories || []).forEach( (storyProps, index) => {
      this.add(storyProps, index);
    });
    
    this.persist();
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
    localStorage.setItem(StoreName, undefined);
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
}

module.exports = StoryStore;