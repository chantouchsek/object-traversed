/* global require, describe,it */

var assert = require("assert");
var traverse = require('../index');

describe('object traverse tests', function(){

    var obj = {
        sample : {
            another : {
                anArray : []
            },
            andAnother : {
                anObject : {}
            }
        },
        subField : {
            field: 2,
            field1: 0,
            field2: 1.2
        },
        sub : {
            field : "ABC",
            empty: ""

        }

    };

    it('should return object properly', function(){

        assert.notStrictEqual(traverse(obj).get('sample.andAnother.anObject'),{});
        assert.equal(traverse(obj).get('subField.field'),2);
        assert.notStrictEqual(traverse(obj).get('subField'),{field: 2});
        assert.equal(traverse(obj).get('a.b.c'),undefined);
        assert.equal(traverse(obj).get('a.lo.ha','ALOHA'),'ALOHA');

        assert.equal(traverse(obj).has('x.b.c'),false);
        assert.equal(traverse(obj).has('sample.another'),true);
    });



    it('should properly check strings', function(){
        assert.equal(traverse(obj).isString('sub.field'),true);
        assert.equal(traverse(obj).isString('sub.empty'),true);
        assert.equal(traverse(obj).isString('sub.a'),false);
        assert.equal(traverse(obj).isString('x'),false);
    });

    it('should properly check array', function(){
        assert.equal(traverse(obj).isArray('sub.field'),false);
        assert.equal(traverse(obj).isArray('sub.empty'),false);
        assert.equal(traverse(obj).isArray('sample.another.anArray'),true);
        assert.equal(traverse(obj).isArray('sample.andAnother.anObject'),false);
        assert.equal(traverse(obj).isArray('xy.z'),false);
    });


    it('should properly check obj', function(){
        assert.equal(traverse(obj).isObject('sub.field'),false);
        assert.equal(traverse(obj).isObject('sub.empty'),false);
        assert.equal(traverse(obj).isObject('sample.another.anArray'),true);
        assert.equal(traverse(obj).isObject('sample.andAnother.anObject'),true);
        assert.equal(traverse(obj).isObject('xy.z'),false);
    });

    it('should properly check number', function(){
        assert.equal(traverse(obj).isNumber('sub.field'),false);
        assert.equal(traverse(obj).isNumber('sub.empty'),false);
        assert.equal(traverse(obj).isNumber('subField.field'),true);
        assert.equal(traverse(obj).isNumber('subField.field1'),true);
        assert.equal(traverse(obj).isNumber('subField.field2'),true);
    });

    var objMod = {
        hey : 1,
        subField : {
            subField2 : {
                last: 3
            }
        }
    };
    it('should properly set value', function(){
        assert.equal(traverse(objMod).set('hey',1),1);
        assert.equal(traverse(objMod).get('hey'),1);

        assert.equal(traverse(objMod).get('hey2',undefined));
        assert.equal(traverse(objMod).set('hey2','X'),'X');
        assert.equal(traverse(objMod).get('hey2'),'X');

        assert.equal(traverse(objMod).set('subField.subField2.last',5),5);
        assert.equal(traverse(objMod).get('subField.subField2.last'),5);

        assert.notStrictEqual(traverse(objMod).set('subField.newPath',{ x: 'x', y:'y'}),{ x: 'x', y:'y'} );
        assert.equal(traverse(objMod).get('subField.newPath.x'),'x');
        assert.equal(traverse(objMod).get('subField.newPath.y'),'y');
    });

    var objFunc = {
        field: function(a) {
            return 1 + a;
        },
        deep: {
            fieldThis : function(x) {
                return this.field(x);
            },
            field: function(c) {
                return c + 5;
            }
        },
        notAFunc: 5,
        notAFunc2 : { x : 'x' },
        noArg : {  noArg: function() {return 'noarg'} }
    };
    it('should properly execute functions', function() {
        assert.equal(traverse(objFunc).exec('field',1),2);
        assert.equal(traverse(objFunc).exec('noArg.noArg'),'noarg');
        assert.equal(traverse(objFunc).exec('deep.field',1),6);
        assert.equal(traverse(objFunc).exec('deep.fieldThis',1),6);
        assert.equal(traverse(objFunc).exec('notAFunc'),undefined);
        assert.equal(traverse(objFunc).exec('notAFunc2.x'),undefined);
    });

    var deleteObj = {
        x : 'y',
        nested: { x : 'y'}
    };
    it ( 'should properly delete path' , function() {
        assert.equal(traverse(deleteObj).delete('x'));
        assert.equal(traverse(deleteObj).get('x'),undefined);
        assert.equal(traverse(deleteObj).get('nested.x'),'y');
        assert.equal(traverse(deleteObj).delete('nested.x'));
        assert.equal(traverse(deleteObj).get('nested.x'),undefined);
    });

    var pushTest = {
        x : 'y',
        nested: {
            x : 'y',
            z : {
            }
        }
    };

    it ( 'should push properly' ,function() {

        traverse(pushTest).push('nested.z.k',1);
        assert.equal(traverse(pushTest).isArray('nested.z.k'),true);
        traverse(pushTest).push('nested.z.k',2);
        assert.equal(traverse(pushTest).get('nested.z.k').length,2);
        traverse(pushTest).push('nested.l.m.n',2);
        assert.equal(traverse(pushTest).has('nested.l.m.n'),false);

        //ensure it won't replace a non array that is defined
        traverse(pushTest).push('nested.x',1);
        assert.equal(traverse(pushTest).get('nested.x'),'y');
    });
    var createTest = {
        x :  { y : [] }
    };
    it ( 'should create properly', function() {
        traverse(createTest).create('x.y.z');
        assert.equal(traverse(createTest).has('x.y.z'),false); //it will not overwrite an array
        traverse(createTest).create('x.b.z');
        assert.equal(traverse(createTest).has('x.b.z'),true);
    });
});