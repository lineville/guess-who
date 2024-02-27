window.matchMedia = window.matchMedia || function() {
  return {
      matches : false,
      addListener : function() {},
      removeListener: function() {}
  };
};
(global as any).setImmediate = (global as any).setTimeout;