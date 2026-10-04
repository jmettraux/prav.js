
# prav.js

A mini-language to fit in DOM node attributes for quick evaluation. True or false?

`Prav` has a single `eval` method that takes a piece of prav code and a context and returns usually `true` or `false` (or something trueish or falseish).

```js
Prav.eval("12", {}) // --> 12
Prav.eval("12.12", {}) // --> 12.12
Prav.eval("true", {}) // --> true
Prav.eval("false", {}) // --> false
Prav.eval("null", {}) // --> null
Prav.eval("\"alpha\"", {}) // --> "alpha"
Prav.eval("'bravo'", {}) // --> "bravo"
Prav.eval("role:approver", { role: 'traveller' }) // --> false
Prav.eval("role:approver", { role: 'approver' }) // --> true
Prav.eval("roles:0", { roles: [ 'launcher', 'approver' ] }) // --> "launcher"
Prav.eval("roles:1", { roles: [ 'launcher', 'approver' ] }) // --> "approver"
Prav.eval("role", { role: 'traveller' }) // --> "traveller"
Prav.eval("captain:age", { captain: { age: 33 } }) // --> 33
Prav.eval("path:to:target", { path: { to: { target: true } } }) // --> true
Prav.eval("path:to:target", { path: { to: { nowhere: false } } }) // --> false
Prav.eval("a:ok", { a: 'ok' }) // --> true
Prav.eval("a:ok&false", { a: 'ok' }) // --> false
Prav.eval("a:ok&true", { a: 'ok' }) // --> true
Prav.eval("a:ok&true", { a: 'not ok' }) // --> false
Prav.eval("a:ok|true", { a: 'ok' }) // --> true
Prav.eval("a:ok|true", { a: 'not ok' }) // --> true
Prav.eval("a:ok|false", { a: 'ok' }) // --> true
Prav.eval("a:ok|false", { a: 'not ok' }) // --> false
Prav.eval("role:alpha&is:omega", { role: 'alpha', is: 'omega' }) // --> true
Prav.eval("role:alpha&is:omega", { role: 'alpha', is: 'alpha' }) // --> false
Prav.eval("role:alpha&is:omega", { role: 'bravo', is: 'omega' }) // --> false
Prav.eval("a:alpha&(b:bravo|c:charly)", { a: 'alpha', b: 'bravo', c: 'c' }) // --> true
Prav.eval("a:alpha&(b:bravo|c:charly)", { a: 'alpha', b: 'b', c: 'c' }) // --> false
Prav.eval("12 > 7", {}) // --> true
Prav.eval("12 > 13", {}) // --> false
Prav.eval("12 > false", {}) // --> false
Prav.eval("12 > true", {}) // --> false
Prav.eval("12 > 'abc'", {}) // --> false
Prav.eval("12 > 11.9", {}) // --> true
Prav.eval("12 > 7 > 6", {}) // --> true
Prav.eval("12 > 7 > 8", {}) // --> false
Prav.eval("12 > 12", {}) // --> false
Prav.eval("'abc' >= 'abc'", {}) // --> true
Prav.eval("'abc' >= 'def'", {}) // --> false
Prav.eval("'abc' > 'def'", {}) // --> false
Prav.eval("'abc' < 'def'", {}) // --> true
Prav.eval("'abc' <= 'def'", {}) // --> true
Prav.eval("'abc' <= 'abc'", {}) // --> true
Prav.eval("'abc'<='abc'", {}) // --> true
Prav.eval("'abc' <='abc'", {}) // --> true
Prav.eval("'abc'<= 'abc'", {}) // --> true
Prav.eval("12 < 7", {}) // --> false
Prav.eval("12 < 13", {}) // --> true
Prav.eval("12 < 13 < 14.1", {}) // --> true
Prav.eval("12 < 13 < 12.1", {}) // --> false
Prav.eval("\"a\" < 13", {}) // --> false
Prav.eval("12 < true", {}) // --> false
Prav.eval("12 < \"not\"", {}) // --> false
Prav.eval("12 < 12", {}) // --> false
Prav.eval("12 >= 12 <= 12", {}) // --> false
Prav.eval("foo > 5", {}) // --> false
Prav.eval("foo > 5", { foo: 3 }) // --> false
Prav.eval("foo > 5", { foo: 6 }) // --> true
Prav.eval("foo < 5", { foo: 3 }) // --> true
Prav.eval("foo < 5", { foo: 6 }) // --> false
Prav.eval("h:foo < 5", { h: { foo: 3 } }) // --> true
Prav.eval("h:foo < 5", { h: { foo: 6 } }) // --> false
Prav.eval("12 = 12", {}) // --> true
Prav.eval("12 == 12", {}) // --> true
Prav.eval("12 != 13", {}) // --> true
Prav.eval("12 = 13", {}) // --> false
Prav.eval("12 == 13", {}) // --> false
Prav.eval("12 == true", {}) // --> false
Prav.eval("12 != 12", {}) // --> false
Prav.eval("12 != 'douze'", {}) // --> true
Prav.eval("12!='douze'", {}) // --> true
Prav.eval("role:traveller", { role: 'traveller' }) // --> true
Prav.eval("role = \"traveller\"", { role: 'traveller' }) // --> true
Prav.eval("role == \"traveller\"", { role: 'traveller' }) // --> true
Prav.eval("\"traveller\" = \"traveller\"", {}) // --> true
Prav.eval("\"traveller\" == \"traveller\"", {}) // --> true
Prav.eval("\"foo {bar} baz\" = \"foo BAR baz\"", { bar: '' }) // --> false
Prav.eval("\"foo {bar} baz\" = \"foo BAR baz\"", { bar: 'BAR' }) // --> true
Prav.eval("\"foo{ \"{bar}{bar}\" }baz\" = \"fooBARBARbaz\"", { bar: 'BAR' }) // --> true
Prav.eval("role:\"approver\"", { role: 'approver' }) // --> true
Prav.eval("role:\"the dude\"", { role: 'the dude' }) // --> true
Prav.eval("role:\"app{rover}\"", { role: 'approver', rover: 'rover' }) // --> true
Prav.eval("role:\"app{rover}\"", { role: 'approver', rover: 'random' }) // --> false
Prav.eval("role:\"app{rover}\"", { role: 'applicant', rover: 'rover' }) // --> false
Prav.eval("role:`the dude`", { role: 'the dude' }) // --> true
Prav.eval("role:`app{rover}`", { role: 'applicant', rover: 'rover' }) // --> false
Prav.eval("role:{blue}", { role: 'applicant', blue: 'approver' }) // --> false
Prav.eval("role:{blue}", { role: 'applicant', blue: 'applicant' }) // --> true
Prav.eval("role: { blue }", { role: 'applicant', blue: 'applicant' }) // --> true
Prav.eval("!false", {}) // --> true
Prav.eval("!(true&false)", {}) // --> true
Prav.eval("!(true|false)", {}) // --> false
Prav.eval("true|true&false", {}) // --> true
Prav.eval("true&true|false", {}) // --> true
Prav.eval("!role:approver", { role: 'traveller' }) // --> true
Prav.eval("!role:approver", { role: 'approver' }) // --> false
Prav.eval("!(role:approver)", { role: 'traveller' }) // --> true
Prav.eval("!(role:approver)", { role: 'approver' }) // --> false
Prav.eval("! role:approver & ! role:launcher", { role: 'traveller' }) // --> true
Prav.eval("role:*any", { role: 'traveller' }) // --> true
Prav.eval("role:*none", { role: 'traveller' }) // --> false
Prav.eval("role:*any", { role: {} }) // --> false
Prav.eval("role:*none", { role: {} }) // --> true
Prav.eval("role:*any", { role: { traveller: true } }) // --> true
Prav.eval("role:*none", { role: { traveller: true} }) // --> false
Prav.eval("s:requested", { s: null }) // --> false
Prav.eval("s:requested", { s: undefined }) // --> false
Prav.eval("s:requested", { s: 0 }) // --> false
Prav.eval("s:requested", { s: 1 }) // --> false
Prav.eval("s:requested", { s: true }) // --> false
Prav.eval("s:requested", { s: false }) // --> false
Prav.eval("s:requested", { s: "foo" }) // --> false
Prav.eval("s:requested", { s: [] }) // --> false
Prav.eval("s:requested", { s: {} }) // --> false
Prav.eval("s:requested", { s: 'requested' }) // --> true
Prav.eval("s:requested", { s: { requested: true } }) // --> true
Prav.eval("v>'7.1'", { v: '7.2' }) // --> true
Prav.eval("v>'7.1'", { v: '7.21' }) // --> true
Prav.eval("v>'7.1'", { v: '7.12' }) // --> true
Prav.eval("v>'7.1'", { v: '7.0' }) // --> false
Prav.eval("v='7'", { v: '7' }) // --> true
Prav.eval("v='7.1'", { v: '7.1' }) // --> true
Prav.eval("v>'7'", { v: '7.1' }) // --> true
Prav.eval("name[\"foo\"", { name: 'foo bar' }) // --> true
Prav.eval("name]\"bar\"", { name: 'foo bar' }) // --> true
Prav.eval("name[\"zoo\"", { name: 'foo bar' }) // --> false
Prav.eval("name]\"baz\"", { name: 'foo bar' }) // --> false
Prav.eval("a:baz", { a: [ 'foo', 'bar', 'baz' ] }) // --> true
Prav.eval("a:lol", { a: [ 'foo', 'bar', 'baz' ] }) // --> false
Prav.eval("a:*any", { a: [ 'foo', 'bar', 'baz' ] }) // --> true
Prav.eval("a:*none", { a: [ 'foo', 'bar', 'baz' ] }) // --> false
Prav.eval("a:*any", { a: [] }) // --> false
Prav.eval("a:*none", { a: [] }) // --> true
Prav.eval("h:a:foo", { h: { a: [ 'foo', 'bar', 'baz' ] } }) // --> true
Prav.eval("h:a:lol", { h: { a: [ 'foo', 'bar', 'baz' ] } }) // --> false
Prav.eval("h:a:*any", { h: { a: [ 'foo', 'bar', 'baz' ] } }) // --> true
Prav.eval("h:a:*none", { h: { a: [ 'foo', 'bar', 'baz' ] } }) // --> false
Prav.eval("h:a:*any", { h: { a: [] } }) // --> false
Prav.eval("h:a:*none", { h: { a: [] } }) // --> true
Prav.eval("n:*any", { n: 11 }) // --> false
Prav.eval("n:*none", { n: 12 }) // --> false
Prav.eval("s:*any", { s: '' }) // --> false
Prav.eval("s:*none", { s: '' }) // --> true
Prav.eval("s:*any", { s: 'aa' }) // --> true
Prav.eval("s:*none", { s: 'bb' }) // --> false
Prav.eval("a=true;b=false;a", {}) // --> true
Prav.eval("a=0;a>1", {}) // --> false
Prav.eval("a=2;a>1", { a: 0 }) // --> true
```

### Prav .escape(s) and .unescape(s)

```js
Prav.escape("foo'bar") // --> "foo&apos;bar"
Prav.escape('foo"bar') // --> "foo&quot;bar"

Prav.unescape("foo&apos;bar") // --> "foo'bar"
Prav.unescape("foo&quot;bar") // --> 'foo"bar'
```


## Dependencies

* [jaabro](https://github.com/jmettraux/jaabro) for making the parser


## License

MIT, see [LICENSE.txt](LICENSE.txt)

