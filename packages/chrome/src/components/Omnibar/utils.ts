export function trimUrl(v: URL) {
	let isDirectSchema = v.hostname === "";
	return (
		(isDirectSchema ? v.protocol : "") +
		v.host +
		(v.search ? v.pathname : v.pathname.replace(/\/$/, "")) +
		v.search
	);
}
