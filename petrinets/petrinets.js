var EventEmitter = require('events').EventEmitter;

var config = {
  debug:true
};

function Place(name) {
  var that = this;
  this.inputs = [];
  this.outputs = [];
  var tokens = 0;

  this.getTokens = function() {
    return tokens;
  }

  this.getName = function() {
    return name;
  }

  this.setTokens = function(n) {
    if (n>tokens) {
      if (config.debug) {
        console.log('place "'+name+'" has an increased amount of tokens');
      }
      tick();
    }
    tokens = n;
  }

  function tick() {
    for (var i=0; i<that.outputs.length; i++) {
      that.outputs[i].emit('tick');
    }
  }

  this.isReady = function() {
    return tokens>0;
  }

  if (config.debug) {
    console.log('created place "'+name+'"');
  }
}

function Transition(name) {
  this.__proto__ = EventEmitter.prototype;

  this.inputs = [];
  this.outputs = [];

  this.isReady = function() {
    for (var i=0; i<this.inputs.length; i++) {
      if (!this.inputs[i].isReady()) {
        if (config.debug) {
          console.log('transition "'+name+'" isn\'t ready because of "'+this.inputs[i].getName()+'" ('+this.inputs[i].getTokens()+')');
        }
        return false;
      }
    }
    return true;
  }

  function fire() {
    if (config.debug) {
      console.log('transition "'+name+'" fired');
    }
    for (var i=0; i<this.inputs.length; i++) {
      this.inputs[i].setTokens(this.inputs[i].getTokens()-1);
    }
    for (var i=0; i<outputs.length; i++) {
      this.outputs[i].setTokens(this.outputs[i].getTokens()+1);
    }
  }

  this.on('tick', function() {
    if (config.debug) {
      console.log('tick was called on "'+name+'"');
    }
    if (this.isReady()) {
     fire();
    }
  });

  if (config.debug) {
    console.log('created transition "'+name+'"');
  }
}

function link(source, target) {
  source.outputs.push(target);
  target.inputs.push(source);
}

exports.Place = Place;
exports.Transition = Transition;
exports.link = link;
exports.config = config;
