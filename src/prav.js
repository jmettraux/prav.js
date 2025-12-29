
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

  function par(i) { return seq('par', i, pa, adn, pz); }

  function exp(i) { return alt(null, i, par, col, sca); }

  function cmp(i) { return jseq('cmp', i, exp, cm); }
  function oro(i) { return jseq('oro', i, cmp, pi); }
  function adn(i) { return jseq('adn', i, oro, am); }

  function root(i) { return seq(null, i, adn); }

  // rewrite

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
  function rewrite_cmp(t) { return _rewrite_seq('CMP', t); } // FIXME

//  function rewrite_cmp(t) {
//
//    if (t.children.length === 1) return rewrite(t.children[0]);
//
//    return [
//      'cmp',
//      t.children[1].children[0].strinp(),
//      rewrite(t.children[0]),
//      rewrite(t.children[1].children[1])
//    ];
//  }
//
//  const MODS = { '-': 'opp', '/': 'inv' };
//
//  function rewrite_add(t) {
//
//    if (t.children.length === 1) return rewrite(t.children[0]);
//
//    let cn = t.children.slice(); // dup array
//    let a = [ t.name === 'add' ? 'plus' : 'MUL' ];
//    if (cn[1] && cn[1].strinp() === '&') a = [ 'amp' ]
//    let mod = null;
//    let c = null;
//
//    while (c = cn.shift()) {
//      let v = rewrite(c);
//      if (mod) v = [ mod, v ];
//      a.push(v);
//      c = cn.shift();
//      if ( ! c) break;
//      mod = MODS[c.strinp()];
//    }
//
//    return a;
//  }
//  let rewrite_mul = rewrite_add;
//
//  function rewrite_fun(t) {
//
//    let a = [ t.children[0].strinp() ];
//    t.children[1].children.forEach(function(c) {
//      if (c.name) a.push(rewrite(c));
//    });
//
//    a._source = t.strinp();
//
//    return a;
//  }
//
//  function rewrite_exp(t) { return rewrite(t.children[0]); }
//
//  function rewrite_par(t) { return rewrite(t.children[1]); }
//
//  function rewrite_arr(t) {
//    let a = [ 'arr' ];
//    for (let i = 0, l = t.children.length; i < l; i++) { let c = t.children[i];
//      if (c.name) a.push(rewrite(c)); }
//    return a; }
//
//  function rewrite_var(t) { return [ 'var', t.strinp() ]; }
//
//  function rewrite_number(t) { return [ 'num', t.strinp() ]; }
//
//  function rewrite_string(t) {
//
//    let s = t.children[0].strinp();
//    let q = s[0];
//    s = s.slice(1, -1);
//
//    return [
//      'str', q === '"' ? s.replace(/\\\"/g, '"') : s.replace(/\\'/g, "'") ];
//  }
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

