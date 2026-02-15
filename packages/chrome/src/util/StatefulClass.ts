import { createState } from "dreamland/core";

export class StatefulClass {
	constructor() {
		return createState(Object.create(new.target.prototype));
	}
}
