import { createDelegate } from "dreamland/core";
import { Tab } from "../Tab/Tab.tsx";
import { Service } from "./Service.ts";
import { INTERNAL_URL_PROTOCOL } from "../consts.ts";
// TODO: centralize this to one place somehow
import * as tldts from "tldts";
import { isPuter } from "../index.ts";
import { focusOmnibox } from "@components/Omnibar/Omnibox.tsx";
import { uuid } from "../util";
import { mountedPromise } from "../App.tsx";

export const pushTab = createDelegate<Tab>();
export const popTab = createDelegate<Tab>();

export type TabServiceState = {};

export class TabsService extends Service {
	tabs: Tab[];
	activetab: Tab = null!;

	constructor(data: TabServiceState | null) {
		super();
		if (data) {
			// this.tabs = data.tabs;
			// this.activetab = data.activetab;
		} else {
			let tab = new Tab({});
			this.tabs = [tab];
			this.activetab = tab;
			mountedPromise.then(() => {
				pushTab(tab);
			});
		}
	}

	newTab(url?: URL, focusomnibox: boolean = false) {
		let tab = new Tab({ url });
		pushTab(tab);
		this.tabs = [...this.tabs, tab];
		this.activetab = tab;
		if (focusomnibox) focusOmnibox();
		return tab;
	}

	newTabRight(ref: Tab, url?: URL) {
		let tab = new Tab({ url });
		pushTab(tab);
		let index = this.tabs.indexOf(ref);
		this.tabs.splice(index + 1, 0, tab);
		this.tabs = this.tabs;
		this.activetab = tab;
		return tab;
	}

	destroyTab(tab: Tab) {
		this.tabs = this.tabs.filter((t) => t !== tab);
		if (this.tabs.length === 0 && isPuter) {
			puter.exit();
		}

		if (this.activetab === tab) {
			this.activetab =
				this.tabs[0] ||
				this.newTab(new URL(`${INTERNAL_URL_PROTOCOL}//newtab`), true);
		}
		popTab(tab);
	}

	searchNavigate(url: string) {
		function validTld(hostname: string) {
			const res = tldts.parse(url);
			if (!res.domain) return false;
			if (res.isIp || res.isIcann) return true;
			return false;
		}

		// TODO: dejank
		if (URL.canParse(url)) {
			this.activetab.pushNavigate(new URL(url));
		} else if (
			URL.canParse("https://" + url) &&
			validTld(new URL("https://" + url).hostname)
		) {
			let fullurl = new URL("https://" + url);
			this.activetab.pushNavigate(fullurl);
		} else {
			const search = `https://google.com/search?q=${encodeURIComponent(url)}`;
			this.activetab.pushNavigate(new URL(search));
		}
	}
}
