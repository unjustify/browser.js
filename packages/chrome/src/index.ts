// this needs to be first
import "./sentry.tsx";

import "./reset.css";
import "./style.css";

// temp fix for vite not working
import.meta.hot?.accept(() => location.reload());

import { setWispUrl } from "./proxy/wisp.ts";

import { ProfileService } from "./services/ProfileService.ts";
import { SettingsService } from "./services/SettingsService.ts";
import { TabsService } from "./services/TabsService.ts";
import { DownloadsService } from "./services/DownloadsService.ts";
import { FaviconService } from "./services/FaviconService.ts";
import { KVWrapper } from "./services/KVWrapper.ts";
import { migrate } from "./migrations/index.ts";
import { mount } from "./App.tsx";

export const isPuter =
	import.meta.env.VITE_PUTER_BRANDING && puter.env == "app";
export const puterBranding = import.meta.env.VITE_PUTER_BRANDING;
export const STORAGE_VERSION = 1;

export let profileService: ProfileService;
export let settingsService: SettingsService;
export let tabsService: TabsService;
export let downloadsService: DownloadsService;
export let faviconService: FaviconService;

if (import.meta.env.VITE_PUTER_BRANDING) {
	if (!puter.auth.isSignedIn()) {
		await puter.auth.signIn();
	}

	let wisp = await puter.net.generateWispV1URL();
	setWispUrl(wisp);
} else {
	setWispUrl(import.meta.env.VITE_WISP_URL);
}

await loadServices();

type ProfileMetadata = {
	id: string;
	storageKey: string;
	name: string;
	lastModified: number;
};

async function loadServices() {
	await navigator.locks.request("write", async () => {
		let kv = new KVWrapper(puterBranding ? "puter" : "localstorage");
		let version;
		let skipLoad = false;
		if (await kv.has("version")) {
			version = Number(await kv.get("version"));
		} else if (await kv.has("browserstate")) {
			// pre-services
			version = 0;
		} else {
			// new install
			version = STORAGE_VERSION;
			skipLoad = true;
		}

		if (version !== STORAGE_VERSION) {
			try {
				await migrate(version, kv);
			} catch (e) {
				console.error(`error migrating storage: ${e}`);
				version = STORAGE_VERSION;
				skipLoad = true;
			}
		}

		settingsService = new SettingsService(await kv.get("settings"));
		faviconService = new FaviconService(await kv.get("faviconCache"));

		let profiles = await kv.get<ProfileMetadata[]>("profiles");
		if (!profiles) {
			profiles = [];
		}

		if (profiles.length === 0) {
			profiles.push({
				id: "default",
				name: "Default",
				lastModified: Date.now(),
				storageKey: "profile-default",
			});
		}

		let profile = profiles[0];

		profileService = new ProfileService(await kv.get(profile.storageKey));
		downloadsService = new DownloadsService();
		tabsService = new TabsService(null);
	});
}

mount();
