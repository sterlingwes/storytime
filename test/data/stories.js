import moment from "moment";
import Story from "../../src/models/story";

module.exports = [{
  project: 'One',
  name: 'Planning',
  hours: [{
    start: moment('2014-01-01 09:00'),
    end: moment('2014-01-01 10:00')
  }]
},{
  project: 'One',
  name: 'Support',
  hours: [{
    start: moment('2014-01-02 13:15'),
    end: moment('2014-01-03 13:15')
  }]
},{
  project: 'Two',
  name: 'Planning',
  hours: [{
    start: moment('2014-01-05 10:15')
  }]
}];