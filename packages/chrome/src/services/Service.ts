import { createState, createStore, type Stateful } from "dreamland/core";
import { StatefulClass } from "../util/StatefulClass";

export class Service extends StatefulClass {
	private dirty = false;

	markDirty() {
		this.dirty = true;
	}

	store<T extends object>(state: T): Stateful<T> {
		return createStore<T>(state, {
			backing: {
				read: (ident) => undefined,
				write: (ident, data) => {
					this.dirty = true;
				},
			},
			autosave: "auto",
			ident: "",
		});
	}
}
