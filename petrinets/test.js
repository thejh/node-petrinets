var petrinets = require('../petrinets/petrinets.js');

var p1 = new petrinets.Place('p-1');
var p2 = new petrinets.Place('p-2');
var t1 = new petrinets.Transition('t-1');
petrinets.link(p1, t1);
petrinets.link(t1, p2);
p1.setTokens(2);

console.log('');
console.log('INITIALIZED');
console.log('p1:'+p1.getTokens()+', p2:'+p2.getTokens());
console.log('');

setTimeout(function() {
  console.log('');
  console.log('RESULTS');
  console.log('p1:'+p1.getTokens()+', p2:'+p2.getTokens());
}, 10000);
