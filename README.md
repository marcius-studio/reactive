# Reactive for Nodejs

Reactive custom class for Nodejs, inspired by Vuejs with no dependencies.

**Problem**

There is no reactivity for Nodejs. Also no classes in JavaScript, everything is built on prototypes. This creates design problems that lead to larger code and lack of structure. 

**Solution**

Using `Reactive.js`, you can create a class and mixins to it, values will be reactive for all components. Able to clearly separate the logic `data`, `methods`, `watch` and `mounted()`, which is called for all components.

## How to use

If you are familiar with Vuejs, you already know how it works

```js

import Reactive from './reactive.js'

// mixin
const mixin = {
	data: {
		name: "Nikita",
		age: 27
	},
	mounted() {
		console.log("mounted mixin");
	},
	methods: {
		calc(val) {
			console.log("mixin", val, this.root);
		}
	}
};

// init
const vm = new Reactive({
	mixins: [mixin],
	data: {
		root: true
	},
		mounted() {
		console.log("mounted root");
	},
	watch: {
		root(val, oldVal) {
			console.log("watch root", val, oldVal);
		},
		age(val, oldVal) {
			console.log("watch age", val, oldVal);
		}
	}
});
```
