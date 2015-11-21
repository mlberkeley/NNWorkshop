// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
      var formatted = this;
      for (var i = 0; i < arguments.length; i++) {
          var regexp = new RegExp('\\{'+i+'\\}', 'gi');
          formatted = formatted.replace(regexp, arguments[i]);
      }
      return formatted;
  };
}
function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message;
    }
}
