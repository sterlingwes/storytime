import EventEmitter from "events";
import assign from "object-assign";
import Dispatcher from "./dispatcher";
import Story from "../models/story";
import moment from "moment";
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
    this.storiesByDate = {};
    this.prefs = {};
    this.changeListener = changeListener;
    
    this.index = {};
    this.save(initRecords || this.read());
    
    quark.on('clearData', ()=> {
      this.clearAll();
      this.emitChange();
    });
    
    this.buildDateLookup();
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
  
  getByDate(month, day) {
    if(!month)
      return this.storiesByDate;
    else {
      let data = this.storiesByDate
        , stories = data[month] && data[month][day] && data[month][day].stories || [];
      return stories;
    }
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
  
  update(newStory) {
    if(typeof this.index[newStory.id] === 'undefined') return false;
    this.stories.splice(this.index[newStory.id],1,newStory);
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
  
  offsetOn(storyId, dayMoment, msecs) {
    let story = this.getById(storyId);
    if(!story) return; // TODO: error handling
    story.offsetTime(dayMoment, msecs);
    this.update(story);
  }
  
  closeOpenSessions() {
    this.stories.forEach(story => {
      story.closeAllSessions();
    });
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
  
  getOrSet(obj,key,defaultVal) {
    return obj[key] = obj[key] || defaultVal;
  }
  
  addData(base, month, day, hours, story) {
    let monthData = this.getOrSet(base,month,{})
      , dayData = this.getOrSet(monthData,day,{ stories: [] });
    
    dayData.stories.push({
      hours: hours,
      name: story.get('name'),
      project: story.get('project'),
      id: story.id
    });
  }
  
  /*
   * create a mapping of total project hours for a given day
   * indexed first by month, then date
   * each value contains this.addData structure
   *
   * TODO: add year to month key
   */
  buildDateLookup() {
    let data = {};
      
    this.stories.forEach(story => {
      let storyHours = story.consolidateTime();
      Object.keys(storyHours).forEach(timestamp => {
        let m = moment(parseInt(timestamp));
        this.addData(data, m.month(), m.date(), storyHours[timestamp].hours, story);
      });
    });
    
    Object.keys(data).forEach(mNo => {
      Object.keys(data[mNo]).forEach(dNo => {
        let target = data[mNo][dNo]
          , totalHours = target.stories.reduce((memo,o)=> {
              memo += o.hours;
              return memo;
            }, 0);
        target.hours = Math.round(totalHours * 10) / 10;
        
        // sort stories by descending hours value
        target.stories.sort((a,b) => {
          return b.hours - a.hours;
        });
      });
    });
    
    this.storiesByDate = data;
  }
  
  //
  // Flux Event Handling =======================================================
  //

  preChange() {
    this.buildDateLookup();
  }

  emitChange() {
    this.preChange();
    
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