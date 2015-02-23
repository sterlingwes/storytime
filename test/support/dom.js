import jsdom from "jsdom"

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.parentWindow;
global.localStorage = require('./localStorage');
global.quark = require('../../src/config/quark/shim');