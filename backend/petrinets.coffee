EventEmitter = require('events').EventEmitter

config =
  debug: true

link = (source, target) ->
  source.outputs.push(target);
  target.inputs.push(source);

class Place
  constructor: (@_name) ->
    @inputs = []
    @outputs = []
    @_tokens = 0
    if config.debug
      console.log "created place '#{@_name}'"

  getTokens: -> @_tokens

  getName: -> @_name

  setTokens: (n) ->
    if n>@_tokens
      if config.debug
        console.log "place '#{@_name}' has an increased amount of tokens"
      @tick()
    @_tokens = n

  tick: ->
    process.nextTick =>
      output.emit 'tick' for output in @outputs

  isReady: -> @_tokens > 0

class Transition extends EventEmitter
  constructor: (@_name) ->
    @inputs = []
    @outputs = []
    @on 'tick', ->
      if config.debug
        console.log "tick was called on '#{@_name}'"
      if @isReady()
        @fire()

  if config.debug
    console.log "created transition '#{@_name}'"

  isReady: ->
    for input in @inputs
      if not input.isReady()
        if config.debug
          console.log "transition '#{@_name}' isn't ready because of '#{input.getName()}' (#{input.getTokens()})"
        return false
    return true

  fire: ->
    if config.debug
      console.log "transition '#{@_name}' fired"
    input.setTokens input.getTokens()-1 for input in @inputs
    output.setTokens output.getTokens()+1 for output in @outputs
    @emit 'tick'

exports.Place = Place
exports.Transition = Transition
exports.link = link
exports.config = config
