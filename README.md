
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
Prav.eval("12 < 7", {}) // --> false
Prav.eval("12 < 13", {}) // --> true
Prav.eval("12 < 13 < 14.1", {}) // --> true
Prav.eval("12 < 13 < 12.1", {}) // --> false
Prav.eval("\"a\" < 13", {}) // --> false
Prav.eval("12 < true", {}) // --> false
Prav.eval("12 < \"not\"", {}) // --> false
Prav.eval("12 < 12", {}) // --> false
Prav.eval("12 >= 12 <= 12", {}) // --> false
Prav.eval("12 = 12", {}) // --> true
Prav.eval("12 == 12", {}) // --> true
Prav.eval("12 != 13", {}) // --> true
Prav.eval("12 = 13", {}) // --> false
Prav.eval("12 == 13", {}) // --> false
Prav.eval("12 == true", {}) // --> false
Prav.eval("12 != 12", {}) // --> false
Prav.eval("12 != 'douze'", {}) // --> true
Prav.eval("role:traveller", { role: 'traveller' }) // --> true
Prav.eval("role = \"traveller\"", { role: 'traveller' }) // --> true
Prav.eval("role == \"traveller\"", { role: 'traveller' }) // --> true
Prav.eval("!false", {}) // --> true
Prav.eval("!(true&false)", {}) // --> true
Prav.eval("!(true|false)", {}) // --> false
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
```


## Dependencies

* [jaabro](https://github.com/jmettraux/jaabro) for making the parser


## License

MIT, see [LICENSE.txt](LICENSE.txt)

