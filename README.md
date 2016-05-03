# ml-mixin

[![Build Status](https://travis-ci.org/milojs/ml-mixin.svg?branch=master)](https://travis-ci.org/milojs/ml-mixin)
[![npm version](https://badge.fury.io/js/ml-mixin.svg)](https://badge.fury.io/js/ml-mixin)
[![Code Climate](https://codeclimate.com/github/milojs/ml-mixin/badges/gpa.svg)](https://codeclimate.com/github/milojs/ml-mixin)
[![Test Coverage](https://codeclimate.com/github/milojs/ml-mixin/badges/coverage.svg)](https://codeclimate.com/github/milojs/ml-mixin/coverage)

An abstract Mixin class.
Can be subclassed using:
```
var MyMixin = _.createSubclass(milo.classes.Mixin, 'MyMixin');
```
Mixin pattern is used, but ml-mixin is implemented as a separate object that is stored on the property of the host object and can create proxy methods on the host object if required. This allows more complex behavior as mixin itself can maintain a state separate from the host object.
`this` in proxy methods refers to Mixin instance, the reference to the host object is `this._hostObject`

More docs to come.
