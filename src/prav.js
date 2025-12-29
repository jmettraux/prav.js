
//
// prav.js
//
// Mon Dec 29 11:02:51 JST 2025
//

var PravParser = Jaabro.makeParser(function() {

  // parse

  function pa(i) { return rex(null, i, /\(\s*/); }
  function pz(i) { return rex(null, i, /\)\s*/); }
  function cm(i) { return rex('cm', i, /(=|>|<|~)\s*/); }
  function am(i) { return rex(null, i, /&\s*/); }
  function pi(i) { return rex(null, i, /\|\s*/); }
  function co(i) { return rex(null, i, /:\s*/); }

  function nul(i) { return rex('nul', i, /nul\s*/); }
  function boo(i) { return rex('boo', i, /(false|true)\s*/); }

  function qstr(i) { return rex('qstr', i, /'(\\'|[^'])*'\s*/); }
  function dqstr(i) { return rex('dqstr', i, /"(\\"|[^"])*"\s*/); }
  function str(i) { return alt('str', i, dqstr, qstr); }

  function num(i) {
    return rex('num', i,
      /-?(\.[0-9]+|([0-9]{1,3}(,[0-9]{3})+|[0-9]+)(\.[0-9]+)?)\s*/); }

  function lab(i) { return rex('lab', i, /[a-z_][A-Za-z0-9_.]*\s*/); }

  function col(i) { return seq('col', i, lab, co, lab); }
  function sca(i) { return alt('sca', i, num, str, boo, nul); }

  function par(i) { return seq('par', i, pa, cmp, pz); }

  function exp(i) { return alt(null, i, par, col, sca); }

  function adn(i) { return jseq('adn', i, exp, am); }
  function oro(i) { return jseq('oro', i, adn, pi); }
  function cmp(i) { return jseq('cmp', i, oro, cm); }

  function root(i) { return seq(null, i, cmp); }

  // rewrite

  function rewrite_par(t) { return rewrite(t.children[1]); }

  function rewrite_lab(t) { return t.strinp(); }

  function rewrite_col(t) {
    return [ 'COL', rewrite(t.children[0]), rewrite(t.children[2]) ]; }

  function _rewrite_seq(head, t) {
    if (t.children.length === 1) return rewrite(t.children[0]);
    let a = [ head ];
    t.children.forEach(function(c) { a.push(rewrite(c)); });
    return a; }

  function rewrite_adn(t) { return _rewrite_seq('AND', t); }
  function rewrite_oro(t) { return _rewrite_seq('OR', t); }
  function rewrite_cmp(t) { return _rewrite_seq('CMP', t); } // FIXME ><=~ ...

}); // end PravParser


var Prav = (function() {

  "use strict";

  this.VERSION = '1.0.0';

  let self = this;

  //
  // protected functions

  //
  // public functions

  this.parse = function(s) {

    return PravParser.parse(s);
  };

  //
  // done.

  return this;

}).apply({}); // end Prav

