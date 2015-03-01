import Dispatcher from "../../src/data/dispatcher";
import ActionHandlers from "../../src/data/action_handlers";
import Store from "../../src/data/store";
import { sinon, expect } from "../support/tools";

describe('Dispatcher', function() {
  
  before(()=> {
    this.sendSpy = sinon.spy(ActionHandlers, "send");
  });
  
  afterEach(()=> {
    this.sendSpy.reset();
  });
  
  describe('dispatch()', ()=> {
    it('should reach the called event handler', ()=> {
      let handlerSpy = sinon.spy(ActionHandlers, "addSession")
        , payload = {
            actionType: 'addSession'
          };
      Dispatcher.dispatch(payload);
      expect(this.sendSpy.called).to.be(true);
      expect(handlerSpy.firstCall.args[0]).to.eql(payload);
    });
    
    it('should throw for undefined actions', ()=> {
      let payload = { actionType: 'undefined' }
        , err = new Error('No ActionHandler found for undefined');
      try { Dispatcher.dispatch(payload); } catch(e) {}
      expect(this.sendSpy.firstCall.exception).to.eql(err);
    });
  });
  
});