import type { Stateful } from "dreamland/core";
import { Service } from "./Service";
import { HistoryState } from "../Tab/History";
import { CookieJar } from "@mercuryworkshop/scramjet";
import { StatefulClass } from "../util/StatefulClass";

export type SerializedHistoryState = {
	state: any;
	url: string;
	title: string | null;
	favicon: string | null;
	timestamp: number;
};

export type ProfileServiceState = {
	id: string;
	globalhistory: SerializedHistoryState[];
	bookmarks: {
		url: string;
		title: string;
		favicon: string | null;
	}[];
	cookies: string;
};

export class BookmarkEntry extends StatefulClass {
	url!: URL;
	title!: string;
	favicon!: string | null;

	constructor(partial?: Partial<BookmarkEntry>) {
		super();
		Object.assign(this, partial);
	}
}

export class ProfileService extends Service {
	globalhistory: HistoryState[];
	bookmarks: BookmarkEntry[];
	cookieJar: CookieJar;

	constructor(data: ProfileServiceState | null) {
		super();
		this.cookieJar = new CookieJar();
		if (data) {
			this.cookieJar.load(data.cookies);
			this.globalhistory = data.globalhistory.map(
				(state) =>
					new HistoryState({
						url: new URL(state.url),
						state: state.state,
						title: state.title,
						favicon: state.favicon,
						timestamp: state.timestamp,
					})
			);
			this.bookmarks = data.bookmarks.map(
				(bookmark) =>
					new BookmarkEntry({
						url: new URL(bookmark.url),
						title: bookmark.title,
						favicon: bookmark.favicon,
					})
			);
		} else {
			this.globalhistory = [];
			this.bookmarks = [];
		}
	}
}
