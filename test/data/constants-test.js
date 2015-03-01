import Constants from "../../src/data/constants";
import { _, expect } from "../support/tools";

describe('Constants', function() {
  
  it('should have uniquely defined values', ()=> {
    expect(_.uniq(_.values(Constants))).to.have.length(_.values(Constants).length);
  });
  
  it('should camelcase values', ()=> {
    expect(Constants.ADD_SESSION).to.be('addSession');
  });
  
});