petrinets = require('./petrinets.coffee')

p1 = new petrinets.Place 'p-1'
p2 = new petrinets.Place 'p-2'
t1 = new petrinets.Transition 't-1'
petrinets.link p1, t1
petrinets.link t1, p2
p1.setTokens 2

console.log """

            INITIALIZED
            p1:#{p1.getTokens()}, p2:#{p2.getTokens()}

            """

setTimeout ->
  console.log """

              RESULTS
              p1:#{p1.getTokens()}, p2:#{p2.getTokens()}
              """
, 5000
