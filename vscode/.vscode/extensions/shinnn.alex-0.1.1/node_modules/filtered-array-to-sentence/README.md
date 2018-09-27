# filtered-array-to-sentence

[![NPM version](https://img.shields.io/npm/v/filtered-array-to-sentence.svg)](https://www.npmjs.com/package/filtered-array-to-sentence)
[![Bower version](https://img.shields.io/bower/v/filtered-array-to-sentence.svg)](https://github.com/shinnn/filtered-array-to-sentence/releases)
[![Build Status](https://travis-ci.org/shinnn/filtered-array-to-sentence.svg?branch=master)](https://travis-ci.org/shinnn/filtered-array-to-sentence)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/filtered-array-to-sentence.svg)](https://coveralls.io/r/shinnn/filtered-array-to-sentence)
[![Dependency Status](https://img.shields.io/david/shinnn/filtered-array-to-sentence.svg?label=deps)](https://david-dm.org/shinnn/filtered-array-to-sentence)
[![devDependency Status](https://img.shields.io/david/dev/shinnn/filtered-array-to-sentence.svg?label=devDeps)](https://david-dm.org/shinnn/filtered-array-to-sentence#info=devDependencies)


Filter an array and produce a human-readable result as a string

```javascript
const isString = v => typeof v === 'string';

filteredArrayToSentence([null, 'apple', 999, 'orange'], isString);
//=> 'apple (index: 1) and orange (index: 3)'
```

## Installation

### Package managers

#### [npm](https://www.npmjs.com/)

```
npm install filtered-array-to-sentence
```

#### [bower](http://bower.io/)

```
bower install filtered-array-to-sentence
```

## API

### filteredArrayToSentence(*array* [, *options*], *filterFn*)

*array*: `Array` of any values  
*options*: `Object` (directly passed to [array-to-sentence](https://github.com/shinnn/array-to-sentence#arraytosentencearray--options))  
*filterFn*: `Function`  
Return: `String`

It [filters](https://developer.mozilla.org/jdocs/Web/JavaScript/Reference/Global_Objects/Array/filter) `array` with `filterFn` function, and returns a string that shows a filtered values and those original array indexes with a human-readable format.

```javascript
filteredArrayToSentence([45, -1, 0, Infinity, 2], v => v > 0);
//=> '45 (index: 0), Infinity (index: 3) and 2 (index: 4)'

filteredArrayToSentence(['ramen', 'udon', 'soba'], {lastSeparator: '&'}, s => s.length < 5);
//=> 'udon (index: 1) & soba (index: 2)'

arrayToSentence([], () => true);
//=> ''
```

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
