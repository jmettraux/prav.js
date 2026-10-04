
//
// prav.js
//
// Mon Dec 29 11:02:51 JST 2025
//

var PravParser = Jaabro.makeParser(function() {


  // parse

  function pa(i) { return rex(null, i, /\(\s*/); }
  function pz(i) { return rex(null, i, /\)\s*/); }
  function no(i) { return rex(null, i, /!\s*/); }
  function lt(i) { return rex(null, i, /<\s*/); }
  function gt(i) { return rex(null, i, />\s*/); }
  function le(i) { return rex(null, i, /<=\s*/); }
  function ge(i) { return rex(null, i, />=\s*/); }
  function nq(i) { return rex(null, i, /!=\s*/); }
  function eq(i) { return rex(null, i, /==?\s*/); }
  function am(i) { return rex(null, i, /&\s*/); }
  function pi(i) { return rex(null, i, /\|\s*/); }

  function az(i) { return rex(null, i, /=\s*/); }
  function co(i) { return rex(null, i, /:\s*/); }
  function sc(i) { return rex(null, i, /;\s*/); }

  function bq(i) { return str(null, i, "`"); }
  function dq(i) { return str(null, i, '"'); }
  function sq(i) { return str(null, i, "'"); }

  function ba(i) { return rex(null, i, /\{\s*/); }
  function bz(i) { return str(null, i, '}'); }

  function ws(i) { return rex(null, i, /\s*/); }

  function sbo(i) { return rex(null, i, /\[\s*/); }
  function sbc(i) { return rex(null, i, /\]\s*/); }

  function nul(i) { return rex('nul', i, /null\s*/); }
  function boo(i) { return rex('boo', i, /(false|true)\s*/); }

  function itr(i) { return seq('itr', i, ba, edw, bz); }
    //
  function bqtxt(i) { return rex('txt', i, /(\\[`{]|[^`{])+/); }
  function dqtxt(i) { return rex('txt', i, /(\\["{]|[^"{])+/); }
  function sqtxt(i) { return rex('txt', i, /(\\['{]|[^'{])+/); }
    //
  function bqtoi(i) { return alt(null, i, bqtxt, itr); }
  function dqtoi(i) { return alt(null, i, dqtxt, itr); }
  function sqtoi(i) { return alt(null, i, sqtxt, itr); }
    //
  function bqstr(i) { return seq('qstr', i, bq, bqtoi, '*', bq, ws); }
  function dqstr(i) { return seq('qstr', i, dq, dqtoi, '*', dq, ws); }
  function sqstr(i) { return seq('qstr', i, sq, sqtoi, '*', sq, ws); }
    //
  function str(i) { return alt(null, i, sqstr, dqstr, bqstr); }

  function num(i) {
    return rex('num', i,
      /-?(\.[0-9]+|([0-9]{1,3}(,[0-9]{3})+|[0-9]+)(\.[0-9]+)?)\s*/); }

  function lab(i) { return rex('nod', i, /[-a-zA-Z0-9_.]+\s*/); }
  function patq(i) { return rex('nod', i, /:\s*\*(any|none)\s*/); }
  function pnod(i) { return alt(null, i, itr, lab, str); }
  function path(i) { return jseq(null, i, pnod, co); }
    //
  function pat(i) { return seq('pat', i, path, patq, '?'); }

  function sca(i) { return alt('sca', i, num, str, boo, nul); }

  function par(i) { return seq('par', i, pa, eqa, pz); }

  function exp(i) { return alt(null, i, par, sca, pat); }

  function not(i) { return seq('not', i, no, '?', exp); }

  function adn(i) { return jseq('adn', i, not, am); }
  function oro(i) { return jseq('oro', i, adn, pi); }

  function lth(i) { return jseq('lth', i, oro, lt); }
  function gth(i) { return jseq('gth', i, lth, gt); }
  function lte(i) { return jseq('lte', i, gth, le); }
  function gte(i) { return jseq('gte', i, lte, ge); }
  function nqa(i) { return jseq('nqa', i, gte, nq); }
  function eqa(i) { return jseq('eqa', i, nqa, eq); }

  function stw(i) { return jseq('stw', i, eqa, sbo); }
  function edw(i) { return jseq('edw', i, stw, sbc); }

  function ass(i) { return seq('ass', i, pat, az, sca, sc); }

  function root(i) { return seq('root', i, ass, '*', edw); }


  // rewrite

  let isArr = function(v) { return Array.isArray(v); };
  let isStr = function(v) { return (typeof v) === 'string'; };

  function rewrite_nul(t) { return [ 'NUL' ]; }

  function rewrite_itr(t) { return rewrite(t.children[1]); }
  function rewrite_txt(t) { return t.string(); }

  function rewrite_qstr(t) { return _rewrite_seq('STR', t); }

  function rewrite_boo(t) { return [ 'BOO', t.strinp() === 'true' ]; }

  function rewrite_num(t) {
    let s = t.strinp();
    return [ 'NUM', s.indexOf('.') > -1 ? parseFloat(s) : parseInt(s, 10) ]; }

  function rewrite_sca(t) { return rewrite(t.children[0]); }

  function rewrite_par(t) { return rewrite(t.children[1]); }

  function rewrite_nod(t) {
    let s = t.strinp();
    return s.startsWith(':') ? s.substr(1) : s; }

  function rewrite_pat(t) {
    let r = [ 'PAT' ];
    t.subgather().forEach(function(c) {
      let rc = rewrite(c);
      if (isArr(rc) && rc.length == 2 && rc[0] === 'STR' && isStr(rc[1])) {
        rc = rc[1];
      }
      r.push(rc);
    });
    return r; }

  function _rewrite_seq(head, t) {
    if (t.children.length === 1) return rewrite(t.children[0]);
    let r = [ head ];
    t.subgather().forEach(function(c) { r.push(rewrite(c)); });
    return r; }

  function rewrite_adn(t) { return _rewrite_seq('AND', t); }
  function rewrite_oro(t) { return _rewrite_seq('OR', t); }

  function rewrite_not(t) {
    if (t.children.length === 1) return rewrite(t.children[0]);
    return [ 'NOT', rewrite(t.children[1]) ]; }

  function rewrite_lth(t) { return _rewrite_seq('LT', t); }
  function rewrite_gth(t) { return _rewrite_seq('GT', t); }
  function rewrite_lte(t) { return _rewrite_seq('LTE', t); }
  function rewrite_gte(t) { return _rewrite_seq('GTE', t); }
  function rewrite_nqa(t) { return _rewrite_seq('NEQ', t); }
  function rewrite_eqa(t) { return _rewrite_seq('EQ', t); }

  function rewrite_edw(t) { return _rewrite_seq('EDW', t); }
  function rewrite_stw(t) { return _rewrite_seq('STW', t); }

  function rewrite_ass(t) { return _rewrite_seq('ASS', t); }

  function rewrite_root(t) { return _rewrite_seq('ROOT', t); }

}); // end PravParser


var Prav = (function() {

  "use strict";

  this.VERSION = '1.4.0';

  let self = this;

  //
  // protected functions

  let isArr = function(v) { return Array.isArray(v); };
  let isNum = function(v) { return (typeof v) === 'number'; };
  let isObj = function(v) { return (typeof v) === 'object'; };
  let isStr = function(v) { return (typeof v) === 'string'; };

  let _eval = function(tree, ctx) {
    let e; try { e = EVALS[tree[0]]; } catch(err) {}
    if ( ! e) throw new Error(`Prav failed to eval ${JSON.stringify(tree)}`);
    return e(tree.slice(1), ctx); };

  let fetchFromArray = function(a, k) {
    if (k === '*any') return a.length > 0;
    if (k === '*none') return a.length < 1;
    return k.match(/^\d+$/) ? a[k] : a.includes(k); };
      //
  let fetchFromObject = function(h, k) {
    if (k === '*any') return Object.keys(h).length > 0;
    if (k === '*none') return Object.keys(h).length < 1;
    return h.hasOwnProperty(k) && h[k]; };
      //
  let elseFetch = function(x, k) {
    //if ( ! isStr(x)) return false;
    if (k === '*any') return x.length > 0;
    if (k === '*none') return x.length < 1;
    return x === k; };
      //
  let fetch = function(h, k, ctx) {
    if (isArr(k)) k = _eval(k, ctx);
    if (h === k) return true;
    if (h === null || h === undefined) return false;
    if (isArr(h)) return fetchFromArray(h, k);
    if (isObj(h)) return fetchFromObject(h, k);
    return elseFetch(h, k); };

  const EVALS = {};

  EVALS.BOO = EVALS.NUM = EVALS.NUL =
    function(cn, ctx) { return cn[0]; };

  EVALS.STR = function(cn, ctx) {
    return cn
      .map(function(c) { return isStr(c) ? c : _eval(c, ctx); })
      .join(''); };

  EVALS.PAT = function(cn, ctx) {
    return cn.reduce(function(r, k) { return fetch(r, k, ctx); }, ctx); };

  EVALS.AND = function(cn, ctx) {
    for (let i = 0, l = cn.length; i < l; i++) {
      if ( ! _eval(cn[i], ctx)) return false; }
    return true; };

  EVALS.OR = function(cn, ctx) {
    for (let i = 0, l = cn.length; i < l; i++) {
      if (_eval(cn[i], ctx)) return true; }
    return false; };

  let compare = function(a, b) {
    if (isNum(a) && isNum(b)) return a - b;
    if (isStr(a) && isStr(b)) return a.localeCompare(b);
    return false; };

  let compareCn = function(cn, ctx, f) {
    let vs = cn.map(function(c) { return _eval(c, ctx); });
    for (let i = 0, l = vs.length - 1; i < l; i++) {
      let r = compare(vs[i], vs[i + 1]);
      if (r === false) return false;
      if ( ! f(r)) return false;
    }
    return true; };

  EVALS.GTE = function(cn, ctx) { return compareCn(cn, ctx, r => r >= 0); };
  EVALS.LTE = function(cn, ctx) { return compareCn(cn, ctx, r => r <= 0); };
  EVALS.GT = function(cn, ctx) { return compareCn(cn, ctx, r => r > 0); };
  EVALS.LT = function(cn, ctx) { return compareCn(cn, ctx, r => r < 0); };

  EVALS.EQ = function(cn, ctx) { return compareCn(cn, ctx, r => r === 0); };

  EVALS.NEQ = function(cn, ctx) {
    let vs = cn.map(function(c) { return _eval(c, ctx); });
    for (let i = 0, l = vs.length - 1; i < l; i++) {
      let r = compare(vs[i], vs[i + 1]);
      if (r === false || r !== 0) return true;
    }
    return false; };

  EVALS.NOT = function(cn, ctx) { return ! _eval(cn[0], ctx); };

  EVALS.EDW = function(cn, ctx) {
    let v0 = _eval(cn[0], ctx), v1 = _eval(cn[1], ctx);
    return (isStr(v0) && isStr(v1)) ? v0.endsWith(v1) : false;
  };
  EVALS.STW = function(cn, ctx) {
    let v0 = _eval(cn[0], ctx), v1 = _eval(cn[1], ctx);
    return (isStr(v0) && isStr(v1)) ? v0.startsWith(v1) : false;
  };

  EVALS.ASS = function(cn, ctx) {
    let k = cn[0][1], v = _eval(cn[1], ctx);
    ctx[k] = v;
    return v;
  };

  EVALS.ROOT = function(cn, ctx) {
    let r = false;
    for (let c of cn) { r = _eval(c, ctx); }
    return r;
  };

  // [un]escapers

  const ESCAPERS = {
    '"': '&quot;',
    "'": '&apos;',
      };
  const UNESCAPERS = Object.keys(ESCAPERS).reduce(
    function(h, k) { h[ESCAPERS[k]] = k; return h; },
    {});

  //
  // public functions

  this.escape = function(s) {
    for (let k in ESCAPERS) { s = s.replaceAll(k, ESCAPERS[k]); }
    return s;
  };
  this.unescape = function(s) {
    for (let k in UNESCAPERS) { s = s.replaceAll(k, UNESCAPERS[k]); }
    return s;
  };

  this.parse = function(s) {

    return PravParser.parse(s.trim());
  };

  this.eval = function(code, ctx) {

    let t = isArr(code) ? code : this.parse(code);

    if ( ! t) throw new Error(`Prav failed to parse >${code}<`);

    let r = _eval(t, ctx);

    if (ctx.debug) {
      console.log('__', 'prav', self.VERSION, 't', t);
      console.log('__', 'prav', self.VERSION, 'ctx', ctx);
    }

    return r;
  };

  //
  // done.

  return this;

}).apply({}); // end Prav

