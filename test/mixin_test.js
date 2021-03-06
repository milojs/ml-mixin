'use strict';

var Mixin = require('../lib/mixin')
    ,  assert = require('assert')
    , _ = require('protojs');


describe('Mixin', function() {
    var MixinSubclass = _.createSubclass(Mixin, 'MixinSubclass', true /* true is by default */);

    _.extendProto(MixinSubclass, {
        init: initMixinSubclass,
        method0: mixinMethod0,
        method1: mixinMethod1,
        method2: mixinMethod2,
        method3: mixinMethod3
    });

    function mixinMethod0() { this.executed = 'mixinMethod0'; }
    function mixinMethod1() { this.executed = 'mixinMethod1'; }
    function mixinMethod2() { this.executed = 'mixinMethod2'; }
    function mixinMethod3() { this.executed = 'mixinMethod3'; }

    function initMixinSubclass(hostObject, proxyMethods, extra1, extra2) {
        this.extra1 = extra1;
        this.extra2 = extra2;
    }

    function createHostObject() {
        function MyClass() {};
        MyClass.prototype.methodOnProto = function() {};
        var obj = new MyClass;
        obj.methodOnObject = 'property on object';
        return obj;
    }

    var myHostObject;

    beforeEach(function() {
        myHostObject = createHostObject();
    });

    it('should create proxy methods on host object when Mixin subclassed', function() {
        var proxyMethods = {
            do0: 'method0',
            do1: 'method1'
        };

        var myMixin = new MixinSubclass(myHostObject, proxyMethods, 'param 1', 'param 2');

        myHostObject._myMixin = myMixin;

        assert.equal(myMixin.extra1, 'param 1', 'init method of direct subclass was called');
        assert.equal(myMixin.extra2, 'param 2', 'init method of direct subclass was called');

        assert(typeof myHostObject.do0 == 'function', 'proxied methods (bound to mixin) should be created in host object');
        assert(typeof myHostObject.do1 == 'function', 'proxied methods (bound to mixin) should be created in host object');
        assert.notEqual(myHostObject.do0, myMixin.method0, 'proxied methods are bound versions of mixin methods');
        assert.notEqual(myHostObject.do1, myMixin.method1, 'proxied methods are bound versions of mixin methods');

        myHostObject.do0();
        assert.equal(myMixin.executed, 'mixinMethod0', 'mixin method should be executed when proxy method is called');
    });

    it('should also allow array of proxy methods', function () {
        var proxyMethods = ['method0', 'method1'];
        var myMixin = new MixinSubclass(myHostObject, proxyMethods, 'param 1', 'param 2');
        assert.equal(myMixin.extra1, 'param 1', 'init method of direct subclass was called');
        assert.equal(myMixin.extra2, 'param 2', 'init method of direct subclass was called');
        assert(typeof myHostObject.method0 == 'function', 'proxied methods (bound to mixin) should be created in host object');
        assert(typeof myHostObject.method1 == 'function', 'proxied methods (bound to mixin) should be created in host object');
        assert.notEqual(myHostObject.method0, myMixin.method0, 'proxied methods are bound versions of mixin methods');
        assert.notEqual(myHostObject.method1, myMixin.method1, 'proxied methods are bound versions of mixin methods');
        myHostObject.method0();
        assert.equal(myMixin.executed, 'mixinMethod0', 'mixin method should be executed when proxy method is called');
    });

    it('should not allow overwriting host object methods', function() {
        var proxyMethods = {
            do0: 'method0',
            do1: 'method1',
            methodOnObject: 'method2'
        };

        assert.throws(function() {
            var myMixin = new MixinSubclass(myHostObject, proxyMethods);
            myHostObject._myMixin = myMixin;
        }, 'should not allow overwriting host object methods');
    });

    it('should not allow shadowing host object methods', function() {
        var proxyMethods = {
            do0: 'method0',
            do1: 'method1',
            methodOnProto: 'method3'
        };

        assert.throws(function() {
            var myMixin = new MixinSubclass(myHostObject, proxyMethods);
            myHostObject._myMixin = myMixin;
        }, 'should not allow shadowing host object prototype methods');
    });

    it('should throw when proxying non-existent mixin methods', function() {
        var proxyMethods = {
            do0: 'method0',
            do1: 'method1',
            doIt: 'iDontHaveIt'
        };

        assert.throws(function() {
            var myMixin = new MixinSubclass(myHostObject, proxyMethods);
            myHostObject._myMixin = myMixin;
        }, 'should throw');
    });

    it('should define useWith static method to define methods on host class prototype with hashmap', function () {
        var proxyMethods = {
            do0: 'method0',
            do1: 'method1'
        };
        var HostClass = myHostObject.constructor;
        MixinSubclass.useWith(HostClass, '_myMixin', proxyMethods);
        var inst = new HostClass;
        inst.do0();
        assert(inst.executed == 'mixinMethod0')
        assert.doesNotThrow(inst.methodOnProto);
    });

    it('should define useWith static method to define methods on host class prototype with array', function () {
        var proxyMethods = ['method0', 'method1'];
        var HostClass = myHostObject.constructor;
        MixinSubclass.useWith(HostClass, '_myMixin', proxyMethods);
        var inst = new HostClass;
        inst.method0();
        assert(inst.executed == 'mixinMethod0')
        assert.doesNotThrow(inst.methodOnProto);
    });
});
