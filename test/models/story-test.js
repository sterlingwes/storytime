import Story from "../../src/models/story";
import expect from "expect.js";
import moment from "moment";

describe('Story model class', function() {
  
  beforeEach(()=> {
    this.story = new Story;
  });
  
  describe('constructor', ()=> {
    let story = new Story({
      project: 'Project', name: 'Story',
      hours: [{
        start: (new Date).valueOf()
      }]
    });
    expect(story.props.hours[0].start._isAMomentObject).to.be(true);
  });
  
  describe('lastSession()', ()=> {
    it('should return the last session', ()=> {
      this.story.newSession();
      
      expect(this.story.lastSession()).to.eql(this.story.props.hours[this.story.sessionCount()-1]);
    });
    
    it('should return an empty object if no sessions', ()=> {
      expect(this.story.lastSession()).to.eql({});
    });
  });
  
  describe('hasOpenSession', ()=> {
    it('should return false if there is no sessions', ()=> {
      expect(this.story.hasOpenSession()).to.be(false);
    });
    
    it('should return false if there is no open sessions', ()=> {
      this.story.newSession();
      this.story.endSession();
      
      expect(this.story.hasOpenSession()).to.be(false);
    });
    
    it('should return true if there is an open session', ()=> {
      this.story.newSession();
      
      expect(this.story.hasOpenSession()).to.be(true);
    });
  });
  
  describe('consolidateTime()', ()=> {
    it('should return the hour totals for each day by iterating sessions', () => {
      this.story.props.hours = [{
        start: moment(new Date(2015,01,01)),
        end: moment(new Date(2015,01,02))
      },{
        start: moment(new Date(2015,01,03,1)),
        end: moment(new Date(2015,01,03,3,30))
      },{
        start: moment(new Date(2015,0,01))
      },{
        start: moment(new Date(2015,0,02,1,0,0)),
        end: moment(new Date(2015,0,02,1,0,5))
      },{
        start: moment(new Date(2015,01,10,1)),
        end: moment(new Date(2015,01,10,2))
      },{
        start: moment(new Date(2015,01,10,3))
      }];
      
      let dayVal = this.story.getDayValue;
      
      let firstKey = dayVal(this.story.props.hours[0].start)
        , secondKey = dayVal(this.story.props.hours[1].start)
        , thirdKey = dayVal(this.story.props.hours[2].start)
        , fifthKey = dayVal(this.story.props.hours[4].start)
        , openDif = (moment() - this.story.props.hours[2].start) / 3600000
        , consolidatedTime = this.story.consolidateTime();
        
      expect(consolidatedTime[firstKey]).to.eql({ hours: 24, minutes: 24*60, isOpen: false });
      expect(consolidatedTime[secondKey]).to.eql({ hours: 2.5, minutes: 2.5*60, isOpen: false });
      expect(consolidatedTime[thirdKey].isOpen).to.be(true);
      expect(consolidatedTime[thirdKey].hours - openDif).to.be.lessThan(0.1);
      expect(moment(firstKey).format('L')).to.be('02/01/2015');
      expect(consolidatedTime[fifthKey].isOpen).to.be(true);
      expect(Object.keys(consolidatedTime).length).to.be(4);
    });
  });
  
  describe('toString', ()=> {
    it('should return the sortIndex', ()=> {
      expect(this.story.toString()).to.eql('0');
    })
  });
})