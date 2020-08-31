/*
 * Reactive custom class for Nodejs, inspired by Vuejs
 * author: Nikita Marcius
 * github: https://github.com/marcius-studio/reactive
 * license: MIT
 */

class Observer {
	constructor() {
		this.observers = [];
	}
	subscribe(fn) {
		this.observers.push(fn);
	}
	unsubscribe(fn) {
		this.observers = this.observers.filter((subscriber) => subscriber !== fn);
	}
	next(data) {
		this.observers.forEach((subscriber) => subscriber(data));
	}
}

// root class
class Reactive extends Observer {
	constructor({ mixins = [], mounted, ...root }) {
		super();

		const { data, watch, methods } = this.mix([root, ...mixins]); // mix components

		this.initData(data); // root data this.data.name => this.name
		this.watch = this.initWatch(this, watch);
		this.initWatcher();

		const _methods = this.initMethods(methods);

		Object.assign(this, _methods);

		this.initMounted(this, [{ mounted }, ...mixins]);
	}

	/**
	 * Mixing root and mixins properties
	 * @returns {Object} => { data,watch,methods }
	 */

	mix(mixins) {
		return ["data", "watch", "methods"].reduce((p, key) => {
			const obj = mixins.reduce((a, c) => ({ ...a, ...c[key] }), {});
			p[key] = { ...p[key], ...obj };
			return p;
		}, {});
	}

	/**
	 * Add get() and set() to variables and apply to root
	 */

	initData(data) {
		Object.keys(data).forEach((key) => {
			// выполняем этот код для каждого свойства объекта data
			let val = data[key];
			let oldVal = val;

			Object.defineProperty(this, key, {
				get() {
					return val;
				},
				set(newVal) {
					if (val !== newVal) oldVal = val;
					val = newVal;
					this.next({ key, val, oldVal });
				}
			});
		});
	}

	/**
	 ** Apply this to each watch function
	 */

	initWatch(vm, watch) {
		return Object.keys(watch).reduce((p, key) => {
			p[key] = watch[key].bind(vm);
			return p;
		}, {});
	}

	/**
	 ** Emit fn when variable changed
	 * observer.next() => observer.subscribe()
	 */

	initWatcher() {
		this.subscribe(({ key, val, oldVal }) => {
			if (this.watch[key]) this.watch[key](val, oldVal);
		});
	}

	initMethods(methods) {
		return Object.keys(methods).reduce((p, key) => {
			p[key] = methods[key].bind(this);
			return p;
		}, {});
	}

	/*
	 * Mix mounted fn in array, bind "this" and run
	 */

	initMounted(vm, arr = []) {
		const fns = arr.filter((i) => i.mounted).map((i) => i.mounted);
		fns.map((fn) => fn.bind(vm)).forEach((i) => i());
	}
}

export default Reactive
