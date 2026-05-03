import { STORAGE_VERSION } from "..";
import { KVWrapper } from "../services/KVWrapper";

type Migration = (kv: KVWrapper) => Promise<void>;
let migrations: Record<number, Migration> = {};

export function migration(version: number, migrate: Migration) {
	migrations[version] = migrate;
}

export async function migrate(version: number, kv: KVWrapper) {
	console.log(
		`attempting migration from ver. ${version} to ${STORAGE_VERSION}`
	);
	for (let i = version; i < STORAGE_VERSION; i++) {
		let migrate = migrations[i];
		if (!migrate) {
			throw new Error(`Migration ${i} not found`);
		}
		console.log(`running migration ${i}`);
		await migrate(kv);
		console.log(`migration ${i} complete`);
		await kv.set(`version`, (i + 1).toString());
	}
	console.log(`migration complete`);
}
