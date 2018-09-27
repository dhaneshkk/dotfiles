# indexed-filter

[![NPM version](https://img.shields.io/npm/v/indexed-filter.svg)](https://www.npmjs.org/package/indexed-filter)
[![Bower version](https://img.shields.io/bower/v/indexed-filter.svg)](https://github.com/shinnn/indexed-filter/releases)
[![Build Status](https://travis-ci.org/shinnn/indexed-filter.svg?branch=master)](https://travis-ci.org/shinnn/indexed-filter)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/indexed-filter.svg)](https://coveralls.io/r/shinnn/indexed-filter)
[![devDependency Status](https://david-dm.org/shinnn/indexed-filter/dev-status.svg)](https://david-dm.org/shinnn/indexed-filter#info=devDependencies)

[`Array#filter`](https://es5.github.io/#x15.4.4.20) with also detecting indexes of filtered values

```javascript
const arr = [1, 'foo', 2, 'bar'];

arr.filter(v => typeof v === 'string');
//=> ['foo', 'bar']

indexedFilter(arr, v => typeof v === 'string');
//=> [{index: 1, value: 'foo'}, {index: 3, value: 'bar'}]
```

## Installation

### Package managers

#### [npm](https://www.npmjs.com/)

```
npm install indexed-filter
```

#### [Bower](http://bower.io/) 

```
bower install indexed-filter
```

### Standalone

[Download the script file directly.](https://raw.githubusercontent.com/shinnn/indexed-filter/master/browser.js "view raw")

## API

### indexedFilter(*array*, *filterFn* [, *thisObject*])

*array*: `Array`  
*filterFn*: `Function`  
*thisObject*: (Any value)  
Return: `Array`

The API is vely similar to ECMAScript's built-in [`Array#filter`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter). There are only two differences:

* You pass in the array as the first argument instead of calling the `.filter()` method on the array instance.
* Each filtered result is an object with tow properties, `index` (array index) and `value` (array element).

```javascript
indexedFilter([0, [1], [2], '3', [5]], function(val, index, arr) {
  return this.isArray(val) && index % 2 === 0 && index < arr.length * 0.5;
}, Array);
//=> [{index: 2, value: [2]}]
```

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
