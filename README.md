# ml-mixin

An abstract Mixin class.
Can be subclassed using:
```
var MyMixin = _.createSubclass(milo.classes.Mixin, 'MyMixin');
```
Mixin pattern is used, but ml-mixin is implemented as a separate object that is stored on the property of the host object and can create proxy methods on the host object if required. This allows more complex behavior as mixin itself can maintain a state separate from the host object.
`this` in proxy methods refers to Mixin instance, the reference to the host object is `this._hostObject`

