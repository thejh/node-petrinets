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
      outputs[i].emit('tick');
    }
  }

  function isReady() {
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
    for (var i=0; i<inputs.length; i++) {
      if (!inputs[i].isReady()) {
        return false;
      }
    }
    return true;
  }

  function fire() {
    for (var i=0; i<inputs.length; i++) {
      inputs[i].setTokens(inputs[i].getTokens()-1);
    }
    for (var i=0; i<outputs.length; i++) {
      outputs[i].setTokens(outputs[i].getTokens()+1);
    }
  }

  this.on('tick', function() {
   if (isReady()) {
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
