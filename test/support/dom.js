import jsdom from "jsdom"

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.parentWindow;
global.navigator = window.navigator;
global.localStorage = require('./localStorage');
global.quark = require('../../src/config/quark/shim');
global.confirm = ()=>{ return true; };