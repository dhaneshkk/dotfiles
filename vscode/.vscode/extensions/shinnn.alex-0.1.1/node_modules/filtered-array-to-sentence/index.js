/*!
 * filtered-array-to-sentence | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/filtered-array-to-sentence
*/
var arrayToSentence = require('array-to-sentence');
var indexedFilter = require('indexed-filter');

module.exports = function filteredArrayToSentence(arr, options, fn) {
  'use strict';

  if (fn === undefined) {
    fn = options;
    options = {};
  }

  return arrayToSentence(indexedFilter(arr, fn).map(function(el) {
    return String(el.value) + ' (index: ' + String(el.index) + ')';
  }), options);
};
