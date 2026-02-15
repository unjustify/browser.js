import { migration } from ".";
import { KVWrapper } from "../services/KVWrapper";

migration(0, async (kv: KVWrapper) => {
	throw new Error("Not attempting to migrate legacy settings");
});
