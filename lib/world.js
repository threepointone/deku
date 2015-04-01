
/**
 * Module dependencies.
 */

var Emitter = require('component/emitter');
var Source = require('./struct/source');

/**
 * Expose `World`.
 */

module.exports = World;

/**
 * Initialize a new `World`.
 */

function World() {
  if (!(this instanceof World)) return new World;
  this.components = {}; // registered components
  this.sources = {}; // registered io sources
  this.values = {}; // values components pull from Source `sources`.
  this.update = this.update.bind(this);
}

/**
 * Mixin `Emitter`.
 */

Emitter(World.prototype);

/**
 * Add a plugin
 *
 * @param {Function} plugin
 */

World.prototype.use = function(plugin){
  plugin(this);
  return this;
};

/**
 * Add `Source` stream.
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */

World.prototype.source = function(name, fn){
  this.sources[name] = Source(name, fn, this.update);
  return this;
};

/**
 * Send data into dataflow pipeline.
 */

World.prototype.send = function(type, data){
  this.emit(type, data);
};

/**
 * Update value.
 */

World.prototype.update = function(type, data){
  this.send('update values', data);
};

/**
 * Mount component to element in the dom.
 */

World.prototype.mount = function(component, properties, element){
  this.send('mount component', {
    properties: properties,
    component: component,
    element: element
  });
};

/**
 * Stringify world.
 *
 * Render to string.
 */

World.prototype.stringify = function(){
  var promise = new Promise;
  this.send('stringify', {}, promise);
  return promise.value();
};