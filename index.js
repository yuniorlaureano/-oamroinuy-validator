"use strict";

var required = function required(message) {
  return function (value) {
    if (!value) {
      return message;
    }

    return null;
  };
};

var number = function number(message) {
  return function (value) {
    if (isNaN(value)) {
      return message;
    }

    return null;
  };
};

var validator = function validator(fns) {
  var normalizeFunc = function normalizeFunc(validateConfig) {
    var normalizedFunc = {};
    var confKeys = Object.keys(validateConfig);

    for (var i = 0; i < confKeys.length; i++) {
      if (!normalizedFunc[confKeys[i]]) {
        normalizedFunc[confKeys[i]] = [];
      }

      var funcKeys = Object.keys(validateConfig[confKeys[i]]);

      for (var j = 0; j < funcKeys.length; j++) {
        var message = null;
        var handler = null;
        var rule = validateConfig[confKeys[i]][funcKeys[j]];

        if (typeof rule == "string") {
          message = rule;
          handler = fns[funcKeys[j]];
        } else {
          message = rule.msg;
          handler = rule.handler || fns[funcKeys[j]];
        }

        normalizedFunc[confKeys[i]].push(handler(message));
      }
    }

    return normalizedFunc;
  };

  var validate = function validate(validateConfig, values) {
    var normalizedConf = normalizeFunc(validateConfig);
    var validated = {};
    var fields = Object.keys(normalizedConf);

    var _loop = function _loop(i) {
      var funcs = normalizedConf[fields[i]];
      validated[fields[i]] = funcs.map(function (func) {
        return func(values[fields[i]], values);
      }).filter(function (msg) {
        return msg != null;
      });
    };

    for (var i = 0; i < fields.length; i++) {
      _loop(i);
    }

    return {
      errors: validated,
      hasError: Object.keys(validated).filter(function (vf) {
        return validated[vf].length > 0;
      }).length > 0
    };
  };

  return {
    validate: validate
  };
};

module.exports = {
  required: required,
  number: number,
  validator: validator
};
