import Story from "../../src/models/story";
import expect from "expect.js";

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
  
  describe('toString', ()=> {
    it('should return the sortIndex', ()=> {
      expect(this.story.toString()).to.eql('0');
    })
  });
})