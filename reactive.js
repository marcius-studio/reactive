/*
 * Reactive custom class for Nodejs, inspired by Vuejs
 * author: Nikita Marcius
 * github: https://github.com/marcius-studio/reactive
 * license: MIT
 */

class Observer {
	constructor() {
		this.observers = []
	}
	subscribe(fn) {
		this.observers.push(fn)
	}
	unsubscribe(fn) {
		this.observers = this.observers.filter((subscriber) => subscriber !== fn)
	}
	next(data) {
		this.observers.forEach((subscriber) => subscriber(data))
	}
}

const observer = new Observer()

// root class
export default class Reactive {
	constructor({ mixins = [], data = {}, methods = {}, watch = {}, mounted }) {
		const root = this.setMixins({ data, methods, watch }, mixins)
		this.setKeys(root)

		this.setData(this.data)
		this.setData(this.data, true) // root data this.data.name => this.name

		this.setWatcher()
		this.setMounted([{ mounted }, ...mixins])

		// Syntactic Sugar
		// this.setKeys(this.data);
		this.setKeys(this.methods)
	}

	// combine root + mixins in one object

	setMixins(root, mixins) {
		return Object.keys(root).reduce((p, key) => {
			const obj = mixins.reduce((a, c) => ({ ...a[key], ...c[key] }), {})
			p[key] = { ...root[key], ...obj }
			return p
		}, {})
	}

	// add get(), set() to data options

	setData(data, root) {
		Object.keys(data).forEach((key) => {
			// выполняем этот код для каждого свойства объекта data
			let internalValue = data[key]
			let oldVal = internalValue
			Object.defineProperty(root ? this : data, key, {
				get() {
					return internalValue
				},
				set(newVal) {
					if (internalValue !== newVal) oldVal = internalValue;
					internalValue = newVal

					observer.next({ key, newVal, oldVal })
				}
			})
		});
	}
	setKeys(data) {
		Object.keys(data).forEach((key) => (this[key] = data[key]))
	}
	setWatcher() {
		observer.subscribe(({ key, newVal, oldVal }) => {
			if (this.watch[key]) this.watch[key](newVal, oldVal)
		})
	}
	setMounted(arr = []) {
		const test = arr.filter((i) => i.mounted).map((i) => i.mounted)
		test.forEach((i) => i())
	}
}
