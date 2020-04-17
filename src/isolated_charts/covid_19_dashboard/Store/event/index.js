export default function Event() {};

Event.prototype.on = function(eventName, handler) {
  const self = this;
  if (!self._eventHandlers) self._eventHandlers = {};
  if (!self._eventHandlers[eventName]) {
    self._eventHandlers[eventName] = [];
  }
  self._eventHandlers[eventName].push(handler);
}
Event.prototype.off = function(eventName, handler) {
  const self = this;
  let handlers = self._eventHandlers && self._eventHandlers[eventName];
  if (!handlers) return;
  for (let i = 0; i < handlers.length; i++) {
    if (handlers[i] === handler) {
      handlers.splice(i--, 1);
    }
  }
}
Event.prototype.trigger = function(eventName, ...args) {
  const self = this;
  if (!self._eventHandlers || !self._eventHandlers[eventName]) return;
  self._eventHandlers[eventName].forEach(handler => handler.apply(self, args));
}
Event.prototype.getSubscribers = function(eventName) {
  const self = this;
  if (!self._eventHandlers || !self._eventHandlers[eventName]) return;
  return self._eventHandlers[eventName]
}
