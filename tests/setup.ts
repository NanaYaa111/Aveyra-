/**
 * Test setup: provide a fake IndexedDB so Dexie works in Node. Web Crypto and
 * structuredClone are already global in Node 22.
 */
import 'fake-indexeddb/auto';
