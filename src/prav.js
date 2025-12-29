
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

  function nul(i) { return rex('nul', i, /null\s*/); }
  function boo(i) { return rex('boo', i, /(false|true)\s*/); }

  function qstr(i) { return rex('qstr', i, /'(\\'|[^'])*'\s*/); }
  function dqstr(i) { return rex('dqstr', i, /"(\\"|[^"])*"\s*/); }
  function str(i) { return alt('str', i, dqstr, qstr); }

  function num(i) {
    return rex('num', i,
      /-?(\.[0-9]+|([0-9]{1,3}(,[0-9]{3})+|[0-9]+)(\.[0-9]+)?)\s*/); }

  function lab(i) { return rex('lab', i, /[a-z_][A-Za-z0-9_.]*\s*/); }

  function pat(i) { return jseq('pat', i, lab, co); }
  function sca(i) { return alt('sca', i, num, str, boo, nul); }

  function par(i) { return seq('par', i, pa, cmp, pz); }

  function exp(i) { return alt(null, i, par, sca, pat); }

  function adn(i) { return jseq('adn', i, exp, am); }
  function oro(i) { return jseq('oro', i, adn, pi); }
  function cmp(i) { return jseq('cmp', i, oro, cm); }

  function root(i) { return seq(null, i, cmp); }

  // rewrite

  function rewrite_nul(t) { return [ 'NUL' ]; }

  function rewrite_str(t) {
    let s = t.string();
    return [ 'STR', s.substr(1, s.length - 2) ]; }

  function rewrite_boo(t) { return [ 'BOO', t.strinp() === 'true' ]; }

  function rewrite_num(t) {
    let s = t.strinp();
    return [ 'NUM', s.indexOf('.') > -1 ? parseFloat(s) : parseInt(s, 10) ]; }

  function rewrite_sca(t) { return rewrite(t.children[0]); }

  function rewrite_par(t) { return rewrite(t.children[1]); }

  function rewrite_lab(t) { return t.strinp(); }

  function rewrite_pat(t) {
    let r = [ 'PAT' ];
    t.subgather().forEach(function(c) { r.push(rewrite(c)); });
    return r; }

  function _rewrite_seq(head, t) {
    if (t.children.length === 1) return rewrite(t.children[0]);
    let r = [ head ];
    t.subgather().forEach(function(c) { r.push(rewrite(c)); });
    return r; }

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

  let fetch = function(h, k) {
    return (typeof h === 'object') && h.hasOwnProperty(k) && h[k]; };

  const EVALS = {};

  EVALS.BOO = EVALS.NUM = EVALS.STR = EVALS.NUL =
    function(cn, ctx) { return cn[0]; };

  EVALS.PAT = function(cn, ctx) {
    let rk = cn.pop();
    let v = cn.reduce(function(r, k) { return fetch(r, k); }, ctx);
    return v === rk || fetch(v, rk); };

  EVALS.AND = function(cn, ctx) {
    for (let i = 0, l = cn.length; i < l; i++) {
      if ( ! _eval(cn[i], ctx)) return false; }
    return true; };

  EVALS.OR = function(cn, ctx) {
    for (let i = 0, l = cn.length; i < l; i++) {
      if (_eval(cn[i], ctx)) return true; }
    return false; };

  let _eval = function(tree, ctx) {
    let e; try { e = EVALS[tree[0]]; } catch(err) {}
    if ( ! e) throw new Error(`Prav failed to eval ${JSON.stringify(tree)}`);
    return e(tree.slice(1), ctx); };

  //
  // public functions

  this.parse = function(s) {

    return PravParser.parse(s);
  };

  this.eval = function(code, ctx) {

    let t = Array.isArray(code) ? code : this.parse(code);

    if ( ! t) throw new Error(`Prav failed to parse >${code}<`);

    return _eval(t, ctx);
  };

  //
  // done.

  return this;

}).apply({}); // end Prav

