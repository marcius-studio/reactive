# Reactive

Reactive custom class, inspired by Vuejs with no dependencies.

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
