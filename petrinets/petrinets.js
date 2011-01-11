function Place() {
  this.inputs = [];
  this.outputs = [];
  var tokens = 0;

  get tokens() {
   return tokens;
  }

  set tokens(n) {
   tokens = n;
   tick();
  }

  function tick() {
    for (var i=0; i<outputs.length; i++) {
      outputs[i].fire('tick');
    }
  }

  function isReady() {
    return tokens>0;
  }
}

function Transition() {
  EventEmitter.call(this);

  this.inputs = [];
  this.outputs = [];

  function isReady() {
    for (var i=0; i<inputs.length; i++) {
      if (!inputs[i].isReady()) {
        return false;
      }
    }
    return true;
  }

  function fireMove() {
    for (var i=0; i<inputs.length; i++) {
      inputs[i].tokens--;
    }
    for (var i=0; i<outputs.length; i++) {
      outputs[i].tokens++;
    }
  }

  on("tick", function() {
   if (isReady()) {
    fireMove();
   }
  });
}
