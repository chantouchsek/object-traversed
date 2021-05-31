/* global require, describe,it */

const assert = require("assert");
const traverse = require('../index');

describe('object traverse tests', function () {
    const obj = {
        sample: {
            another: {
                anArray: []
            },
            andAnother: {
                anObject: {}
            }
        },
        subField: {
            field: 2,
            field1: 0,
            field2: 1.2
        },
        sub: {
            field: "ABC",
            empty: ""
        }
    };
    it('should return object properly', function () {
        assert.notStrictEqual(traverse(obj).get('sample.andAnother.anObject'), {});
        assert.strictEqual(traverse(obj).get('subField.field'), 2);
        assert.notStrictEqual(traverse(obj).get('subField'), {field: 2});
        assert.strictEqual(traverse(obj).get('a.b.c'), undefined);
        assert.strictEqual(traverse(obj).get('a.lo.ha', 'ALOHA'), 'ALOHA');
        assert.strictEqual(traverse(obj).has('x.b.c'), false);
        assert.strictEqual(traverse(obj).has('sample.another'), true);
    });
    it('should properly check strings', function () {
        assert.strictEqual(traverse(obj).isString('sub.field'), true);
        assert.strictEqual(traverse(obj).isString('sub.empty'), true);
        assert.strictEqual(traverse(obj).isString('sub.a'), false);
        assert.strictEqual(traverse(obj).isString('x'), false);
    });
    it('should properly check array', function () {
        assert.strictEqual(traverse(obj).isArray('sub.field'), false);
        assert.strictEqual(traverse(obj).isArray('sub.empty'), false);
        assert.strictEqual(traverse(obj).isArray('sample.another.anArray'), true);
        assert.strictEqual(traverse(obj).isArray('sample.andAnother.anObject'), false);
        assert.strictEqual(traverse(obj).isArray('xy.z'), false);
    });
    it('should properly check obj', function () {
        assert.strictEqual(traverse(obj).isObject('sub.field'), false);
        assert.strictEqual(traverse(obj).isObject('sub.empty'), false);
        assert.strictEqual(traverse(obj).isObject('sample.another.anArray'), true);
        assert.strictEqual(traverse(obj).isObject('sample.andAnother.anObject'), true);
        assert.strictEqual(traverse(obj).isObject('xy.z'), false);
    });
    it('should properly check number', function () {
        assert.strictEqual(traverse(obj).isNumber('sub.field'), false);
        assert.strictEqual(traverse(obj).isNumber('sub.empty'), false);
        assert.strictEqual(traverse(obj).isNumber('subField.field'), true);
        assert.strictEqual(traverse(obj).isNumber('subField.field1'), true);
        assert.strictEqual(traverse(obj).isNumber('subField.field2'), true);
    });
    const objMod = {
        hey: 1,
        subField: {
            subField2: {
                last: 3
            }
        }
    };
    it('should properly set value', function () {
        assert.strictEqual(traverse(objMod).set('hey', 1), 1);
        assert.strictEqual(traverse(objMod).get('hey'), 1);
        assert.strictEqual(traverse(objMod).get('hey2', undefined), undefined);
        assert.strictEqual(traverse(objMod).set('hey2', 'X'), 'X');
        assert.strictEqual(traverse(objMod).get('hey2'), 'X');
        assert.strictEqual(traverse(objMod).set('subField.subField2.last', 5), 5);
        assert.strictEqual(traverse(objMod).get('subField.subField2.last'), 5);
        assert.notStrictEqual(traverse(objMod).set('subField.newPath', {x: 'x', y: 'y'}), {x: 'x', y: 'y'});
        assert.strictEqual(traverse(objMod).get('subField.newPath.x'), 'x');
        assert.strictEqual(traverse(objMod).get('subField.newPath.y'), 'y');
    });
    it('should not allow proto_path overwrite', function () {
        traverse({}).set('__proto__.polluted', true);
        assert.strictEqual({}.polluted, undefined);
        traverse({}).set('constructor.prototype.polluted', true);
        assert.strictEqual({}.polluted, undefined);
    })
    const objFunc = {
        field: function (a) {
            return 1 + a;
        },
        deep: {
            fieldThis: function (x) {
                return this.field(x);
            },
            field: function (c) {
                return c + 5;
            }
        },
        notAFunc: 5,
        notAFunc2: {x: 'x'},
        noArg: {
            noArg: function () {
                return 'noarg'
            }
        }
    };
    it('should properly execute functions', function () {
        assert.strictEqual(traverse(objFunc).exec('field', 1), 2);
        assert.strictEqual(traverse(objFunc).exec('noArg.noArg'), 'noarg');
        assert.strictEqual(traverse(objFunc).exec('deep.field', 1), 6);
        assert.strictEqual(traverse(objFunc).exec('deep.fieldThis', 1), 6);
        assert.strictEqual(traverse(objFunc).exec('notAFunc'), undefined);
        assert.strictEqual(traverse(objFunc).exec('notAFunc2.x'), undefined);
    });

    const deleteObj = {
        x: 'y',
        nested: {x: 'y'}
    };
    it('should properly delete path', function () {
        assert.strictEqual(traverse(deleteObj).delete('x'), undefined);
        assert.strictEqual(traverse(deleteObj).get('x'), undefined);
        assert.strictEqual(traverse(deleteObj).get('nested.x'), 'y');
        assert.strictEqual(traverse(deleteObj).delete('nested.x'), undefined);
        assert.strictEqual(traverse(deleteObj).get('nested.x'), undefined);
    });

    const pushTest = {
        x: 'y',
        nested: {
            x: 'y',
            z: {}
        }
    };
    it('should push properly', function () {
        traverse(pushTest).push('nested.z.k', 1);
        assert.strictEqual(traverse(pushTest).isArray('nested.z.k'), true);
        traverse(pushTest).push('nested.z.k', 2);
        assert.strictEqual(traverse(pushTest).get('nested.z.k').length, 2);
        traverse(pushTest).push('nested.l.m.n', 2);
        assert.strictEqual(traverse(pushTest).has('nested.l.m.n'), false);

        //ensure it won't replace a non array that is defined
        traverse(pushTest).push('nested.x', 1);
        assert.strictEqual(traverse(pushTest).get('nested.x'), 'y');
    });
    const createTest = {
        x: {y: []}
    };
    it('should create properly', function () {
        traverse(createTest).create('x.y.z');
        assert.strictEqual(traverse(createTest).has('x.y.z'), false); //it will not overwrite an array
        traverse(createTest).create('x.b.z');
        assert.strictEqual(traverse(createTest).has('x.b.z'), true);
    });
});
