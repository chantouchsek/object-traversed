/* global module, require */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.objectTraverse = factory();
  }
})(this, function () {
  'use strict';
  //we need to exclude '' or 0, false
  const nullOrUndefined = function (obj) {
    return (obj === null || obj === undefined)
  }
  const traverse = function (obj, path) {
    return path.split(".").reduce(function (prev, current) {
      if (prev) {
        return prev[current];
      }
    }, obj);
  }

  /**
   * Returns parent: somePath/field, child : another
   * when passed somePath/field/another
   *
   * @param path
   * @returns {{parent: string, child: *}}
   */
  const parseAsParentChild = function (path) {
    const pathArr = path.split(".");
    return {
      parent: pathArr.length > 1 ?
        pathArr.splice(0, pathArr.length - 1).join('.') : '',
      child: pathArr.length > 0 ? pathArr[pathArr.length - 1] : ''
    }
  };

  /**
   *  Traverse but only up to the second to the last path
   *
   *  returns { traversed: theParent traversed before the last, childPath: the child path }
   */
  const traverseAlmost = function (obj, path) {
    const subPath = parseAsParentChild(path);
    if (subPath.parent) {
      return { traversed: traverse(obj, subPath.parent), childPath: subPath.child }
    }
    return undefined;
  };
  const doNothing = () => {};

  const noop = {
    get: doNothing, has: doNothing, set: doNothing, push: doNothing,
    create: doNothing, delete: doNothing, exec: doNothing, isArray: doNothing,
    isString: doNothing, isNumber: doNothing
  };
  return function (obj) {
    if (!obj) {
      return noop;
    }
    return {
      get: function (path, defaultVal) {
        const traversed = traverse(obj, path);
        if (!nullOrUndefined(traversed)) {
          return traversed;
        }
        return defaultVal;
      },

      /**
       * Helper method to check if the path exists
       *
       * @returns {boolean}
       */
      has: function (path) {
        const object = traverse(obj, path)
        return !nullOrUndefined(object);
      },

      /**
       * Set the path's value to be val
       *
       * @param path
       * @param val
       * @returns {*}
       */
      set: function (path, val) {
        //we will retrieve only up to the last path
        const traversedAlmost = traverseAlmost(obj, path);
        if (traversedAlmost) {
          return traversedAlmost.traversed[traversedAlmost.childPath] = val;
        } else if (obj) {
          return obj[path] = val;
        }
      },

      /**
       * Appends the val to the array denoted by path.
       * If the path is not present, then an array is created and then the value is created
       *
       * If the path is present but it is not of type null or undefined,
       * then nothing gets appended
       *
       *
       * @param path
       * @param val
       */
      push: function (path, val, create) {
        let traversed;
        const traversedAlmost = traverseAlmost(obj, path);
        if (traversedAlmost && traversedAlmost.traversed) {
          traversed = traversedAlmost.traversed[traversedAlmost.childPath];
          if (!traversed && nullOrUndefined(traversed)) {
            traversedAlmost.traversed[traversedAlmost.childPath] = [];
          }
          if (Array.isArray(traversedAlmost.traversed[traversedAlmost.childPath])) {
            traversedAlmost.traversed[traversedAlmost.childPath].push(val);
          }
        }

      },

      /**
       * Create the specified path as empty objects if not exists
       *
       */
      create: function (path) {
        let walked = obj;
        let stopIt = false;
        path.split('.').forEach(function (p) {
          if (!stopIt) { //traverse until its ok
            if (!walked[p]) {
              walked[p] = {};
            }
            walked = walked[p];
            if (Array.isArray(walked) || typeof walked !== 'object') {
              stopIt = true;
            }
            if (!walked) {
              walked = walked[p] = {};
            }
          }
        });
      },

      /**
       * Remove this path
       *
       * @param path
       */
      delete: function (path) {
        const traversedAlmost = traverseAlmost(obj, path);
        if (traversedAlmost && traversedAlmost.traversed) {
          delete traversedAlmost.traversed[traversedAlmost.childPath];
        } else if (obj) {
          delete obj[path];
        }
      },

      /**
       *
       *
       * @param path
       */
      exec: function (path) {
        //we will retrieve only up to the last path
        const traversedAlmost = traverseAlmost(obj, path);
        const args = Array.prototype.slice.call(arguments).splice(1);
        if (traversedAlmost && typeof traversedAlmost.traversed[traversedAlmost.childPath] === 'function') {
          return traversedAlmost.traversed[traversedAlmost.childPath].apply(traversedAlmost.traversed, args);
        } else if (obj && typeof obj[path] === 'function') {
          return obj[path].apply(obj, args);
        }
      },

      /**
       *
       *
       * @param path
       * @returns {boolean}
       */
      isArray: function (path) {
        return Array.isArray(traverse(obj, path));
      },

      /**
       *
       * @param path
       * @returns {boolean}
       */
      isObject: function (path) {
        return typeof traverse(obj, path) === 'object';
      },

      /**
       *
       *
       * @param path
       * @returns {boolean}
       */
      isString: function (path) {
        return typeof traverse(obj, path) === 'string';
      },

      /**
       *
       *
       * @param path
       * @returns {boolean}
       */
      isNumber: function (path) {
        return typeof traverse(obj, path) === 'number';
      }
    };
  };
});
