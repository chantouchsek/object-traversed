#object-traversed
==============
[![Build Status](https://travis-ci.org/wmira/object-traversed.svg?branch=master)](https://travis-ci.org/wmira/object-traversed)
[![view on npm](http://img.shields.io/npm/v/object-traversed.svg)](https://www.npmjs.org/package/object-traversed)

A very simple utility on traversing object graphs using a string.

## Changelog
v0.0.1
* Initial package

## How to use

```
   npm install --save-dev object-traversed
   
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


