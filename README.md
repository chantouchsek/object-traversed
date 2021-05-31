#Object Traversed
==============
[![Build Status](https://travis-ci.org/chantouch/object-traversed.svg?branch=main)](https://travis-ci.org/chantouch/object-traversed)
[![view on npm](http://img.shields.io/npm/v/object-traversed.svg)](https://www.npmjs.org/package/object-traversed)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/object-traversed.svg?style=flat-square)](https://npmjs.com/package/object-traversed)
[![npm](https://img.shields.io/npm/dm/object-traversed.svg?style=flat-square)](https://npmjs.com/package/object-traversed)

A very simple, lightweight utility on traversing object graphs using a string.

## How to use

```npm
npm install --save object-traversed
```

```yarn
yarn add  object-traversed
```

If using via normal javascript include, then it is exported as window.objectTraverse.

## API

```javascript
var traversed = require('object-traversed');

var graph = {  
   field : {
      deep : {
         x : 1,
         y: 2
      }
   },
   field2: [],
   deepFunc : { someFunc: function(arg) {} }
   
};
//get a value
traversed(graph).get('field.deep');
//get with a default
traversed(graph).get('field.deep','default return val if not found'); 

//check if something is defined
traversed(graph).has('field.deep.missing');

//sets a value
traversed(graph).set('field.deep.z',5);
   
//helpers
traversed(graph).isArray('field2');
traversed(graph).isString('field2');
traversed(graph).isObject('field2');
traversed(graph).isNumber('field2');
          
//exec
traversed(graph).exec('deepFunc.someFunc','arg');         

//delete
traversed(graph).delete('field.deep.x');

//push - add vall to the array, will create if it doesn't exists
traversed(graph).push('a.b.c',val);

//create create the given path if it doesn't exists, will skip none object types
traversed(graph).create('a.b.c');
traversed(graph).get('a.b.c'); //{ a : { b : { c: {} } }
```

## 🔑 License

MIT © [ChantouchSek](https://github.com/chantouch)
