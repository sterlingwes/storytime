import dom from "../support/dom";
import Store from "../../src/data/store";
import Story from "../../src/models/story";
import expect from "expect.js";
import moment from "moment";

describe('Store class', function() {
  
  beforeEach('render and locate element', ()=> {
    localStorage.clear();
    this.store = new Store;
  });
  
  describe('constructor', ()=> {
    it('should instantiate with an empty array and persist', ()=> {
      expect(this.store.stories).to.eql([]);
      expect(localStorage.getItem(this.store.storeName)).to.eql('[]');
    });
    
    it('should instantiate with provided data and persist', ()=> {
      let store = new Store([{ project:'Some Project', name:'My Story' }]);
      expect(store.count()).to.be(1);
      expect(store.get(0)).to.be.a(Story);
      expect(localStorage.getItem(store.storeName)).to.eql(JSON.stringify([store.get(0)]));
      
      // it should have a uid
      expect(store.get(0).id).to.be.a('string');
      expect(store.get(0).id.length).to.be.above(35);
    });
  });
  
  describe('add()', ()=> {
    it('should add a new story by props', ()=> {
      this.store.add({ project:'My Project', name:'Added Story' });
      expect(this.store.count()).to.be(1);
      expect(this.store.get(0)).to.be.a(Story);
      expect(localStorage.getItem(this.store.storeName)).to.eql(JSON.stringify([this.store.get(0)]));
    });
  });
  
  describe('remove()', ()=> {
    it('should return false if no story matches the id', ()=> {
      this.store.add({ project:'My Project', name:'Added Story' });
      expect(this.store.remove('nothere')).to.be(false);
    });
  });
  
  describe('getById()', ()=> {
    it('should search for an item by uid', ()=> {
      this.store.add({ project:'Some Project', name:'My Story' });
      this.store.add({ project:'Another Project', name:'Another Story' });
      let last = this.store.stories[1];
      expect(this.store.getById(last.id)).to.be(last);
      
      // undefined if does not exist
      expect(this.store.getById('idontexist')).to.be(undefined);
    });
  });
  
  describe('start()', ()=> {
    it('should open a new session story and persist the changes', ()=> {
      this.store.save({ project:'Timed', name:'Session' });
      let last = this.store.stories[0];
      expect(localStorage.getItem('st')).to.be(JSON.stringify(
        [{project:"Timed", name:"Session", hours:[]}]
      ));
      this.store.start(last.id);
      expect(localStorage.getItem('st')).to.be(JSON.stringify([{
        project: 'Timed', name: 'Session',
        hours: [{start: last.props.hours[0].start.valueOf()}]
      }]));
    });
  });
  
  describe('started()', ()=> {
    it('should return true if the story has an started timer', ()=> {
      this.store.save({ project:'Timed', name:'Session' });
      let last = this.store.stories[0];
      this.store.start(last.id);
      expect(this.store.started(last.id)).to.be(true);
      this.store.stop(last.id);
      expect(this.store.started(last.id)).to.be(false);
      expect(this.store.started('notthere')).to.be(false);
    });
  });
  
  describe('stop()', ()=> {
    it('should close an open session and persist the changes', ()=> {
      this.store.save({ project:'Timed', name:'Session' });
      let last = this.store.stories[0];
      this.store.start(last.id);
      this.store.stop(last.id);
      expect(localStorage.getItem('st')).to.be(JSON.stringify([{
        project: 'Timed', name: 'Session',
        hours: [{
          start: last.props.hours[0].start.valueOf(),
          end: last.props.hours[0].end.valueOf()
        }]
      }]));
    });
  });
  
  describe('offsetOn()', ()=> {
    beforeEach(() => {
      let added = this.store.save({
        project: 'Misc', name: 'Offset',
        hours: [{
          start: moment(new Date(2015,02,03,01,0)),
          end: moment(new Date(2015,02,03,01,5))
        },{
          start: moment(new Date(2015,02,03,01,7)),
          end: moment(new Date(2015,02,03,01,20))
        }]
      });
      this.offsetStory = added[0];
    });
    
    it('should add time to sessions', ()=> {
      let story = this.offsetStory
        , dayVal = story.getDayValue(story.props.hours[0].start)
        , hoursBefore = Math.round((5 + 13) / 60 * 100) / 100
        , timeInfo = story.consolidateTime();
        
      expect(timeInfo[dayVal].hours).to.be(hoursBefore);
      this.store.offsetOn(story.id, moment(dayVal), 600000);
      story = this.store.getById(story.id);
      let hoursAfter = Math.round((5 + 13 + 10) / 60 * 100) / 100;
      timeInfo = story.consolidateTime();
      expect(timeInfo[dayVal].hours).to.be(hoursAfter);
    });
  });
  
  describe('clearAll()', ()=> {
    it('should clear the localstorage', ()=> {
      this.store.save({name:'something'});
      expect(localStorage.getItem('st')).to.eql(JSON.stringify([{
        name: 'something', hours: []
      }]));
      this.store.clearAll();
      expect(localStorage.getItem('st')).to.eql('[]');
    });
  });
})