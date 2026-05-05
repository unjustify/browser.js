---
name: spec-lookup
description: Pull down the official WHATWG / ECMA-262 specifications when implementing or modifying any web platform or JavaScript language feature. Use whenever touching DOM, HTML, Fetch, URL, Streams, Encoding, XHR, WebSockets, Service Workers, Web APIs, or JS language semantics (objects, promises, iterators, modules, etc.) — before writing or changing the implementation, fetch the relevant spec section and follow its algorithm step-by-step.
---

# spec-lookup

When implementing or modifying any web platform or JavaScript language feature, the implementation MUST be grounded in the official specification. Do not work from memory, MDN summaries, or other implementations alone — fetch the authoritative spec text first.

## When this applies

Trigger this workflow whenever the task involves:

- **WHATWG specs**: DOM, HTML, Fetch, URL, Streams, Encoding, XHR, WebSockets, Service Workers, Notifications, Storage, Console, MIME Sniffing, Compression Streams, File API, Cookies, Permissions, etc.
- **W3C specs** that govern web APIs not yet at WHATWG (CSSOM, Web IDL bindings, etc.)
- **ECMA-262** (TC39): JavaScript language semantics — objects, prototypes, promises, iterators, async functions, modules, proxies, regex, intl, etc.
- **ECMA-402** (Intl): internationalization APIs.

Skip this only for purely internal plumbing with no spec surface (build config, tooling, internal data structures with no observable web behavior).

## Workflow

1. **Identify the spec.** Determine which document defines the feature. Common roots:
   - DOM: `https://dom.spec.whatwg.org/`
   - HTML: `https://html.spec.whatwg.org/multipage/` (use the multipage version; the single-page is huge)
   - Fetch: `https://fetch.spec.whatwg.org/`
   - URL: `https://url.spec.whatwg.org/`
   - Streams: `https://streams.spec.whatwg.org/`
   - Encoding: `https://encoding.spec.whatwg.org/`
   - XHR: `https://xhr.spec.whatwg.org/`
   - WebSockets: `https://websockets.spec.whatwg.org/`
   - Service Workers: `https://w3c.github.io/ServiceWorker/`
   - Web IDL: `https://webidl.spec.whatwg.org/`
   - ECMA-262: `https://tc39.es/ecma262/`
   - ECMA-402: `https://tc39.es/ecma402/`

2. **Fetch the relevant section.** Use whatever web-fetch capability you have (e.g. a `WebFetch`/browse tool, `curl`, or equivalent) against the spec URL, targeting the specific algorithm, interface, or section you need (e.g. "the algorithm for Document.createElement", "the steps of the fetch() method", "the [[Construct]] internal method of Promise"). Do not fetch the whole spec; target a section/anchor.

3. **Follow the spec's algorithm literally.** Specs define behavior as numbered steps. The implementation should mirror those steps in order, with the same edge cases, error conditions, and observable side effects. Deviations need a deliberate reason (e.g. an explicit project-level decision to diverge), not an oversight.

4. **Cite the spec in code where non-obvious.** When a step exists only because the spec demands it (an unusual ordering, a subtle null check, a coercion), leave a one-line comment with the spec link/anchor. Don't paraphrase the whole step — just point to it.

5. **Cross-check against Web Platform Tests (WPT) when relevant.** For DOM/HTML/Fetch/etc., `https://github.com/web-platform-tests/wpt` is the conformance suite. If the user is debugging a behavior mismatch, WPT tests often pinpoint the exact spec step being violated.

## What this skill is NOT

- Not a substitute for reading existing project code first — check how the codebase already structures similar features before writing new code.
- Not an excuse to over-engineer. Implement the spec-required behavior; do not add steps the spec doesn't mandate.
- Not for purely UI/styling/build work that has no spec surface.

## Reporting

When finishing a task that used this skill, briefly note which spec section was followed (e.g. "implemented per WHATWG DOM §4.5 createElement steps 1-7"). This makes review easier and creates an audit trail for future spec updates.
