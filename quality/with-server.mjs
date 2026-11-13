#!/usr/bin/env node
/**
 * Serves the static export with `wrangler pages dev` (the Cloudflare Pages routing and
 * `_headers`), runs the given command against it and always stops the server.
 *
 *   node quality/with-server.mjs <command> [args...]
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const { port, paths } = JSON.parse(readFileSync(path.join(import.meta.dirname, "targets.json")));
const readyUrl = `http://127.0.0.1:${port}${paths[0]}`;
const READY_TIMEOUT_MS = 60_000;
const STOP_TIMEOUT_MS = 10_000;
const POLL_INTERVAL_MS = 250;
const PROBE_TIMEOUT_MS = 5_000;

const [command, ...args] = process.argv.slice(2);
if (!command) {
	console.error("Usage: node quality/with-server.mjs <command> [args...]");
	process.exit(2);
}
if (!existsSync(path.join(root, "apps/web/out/index.html"))) {
	console.error("apps/web/out is missing. Build the site first (see `just quality`).");
	process.exit(2);
}

// A server left on the port would be audited instead of this build.
const probe = () => fetch(readyUrl, { signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) });
const portInUse = await probe().then(
	() => true,
	() => false,
);
if (portInUse) {
	console.error(`Something already answers on ${readyUrl}. Stop it and run again.`);
	process.exit(2);
}

// Its own process group, so stopping it also stops the workerd child that wrangler starts.
const server = spawn("pnpm", ["run", "quality:serve", "--port", String(port)], {
	cwd: root,
	detached: true,
	stdio: ["ignore", "pipe", "pipe"],
	env: { ...process.env, WRANGLER_SEND_METRICS: "false", CI: "true" },
});
let serverLog = "";
let serverExit = null;
for (const stream of [server.stdout, server.stderr]) {
	stream.on("data", (chunk) => {
		serverLog += chunk;
	});
}
server.on("exit", (code) => {
	serverExit = code ?? 1;
});
server.on("error", (error) => {
	serverLog += `Could not start the server: ${error.message}\n`;
	serverExit = 1;
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Signals the whole server process group. Returns false once no process is left in it. */
function signalServer(signal) {
	try {
		process.kill(-server.pid, signal);
		return true;
	} catch {
		return false;
	}
}

/** Asks the server to stop, waits until its process group is gone and kills it if it lingers. */
async function stopServer() {
	signalServer("SIGTERM");
	const deadline = Date.now() + STOP_TIMEOUT_MS;
	while (Date.now() < deadline) {
		if (!signalServer(0)) return;
		await sleep(POLL_INTERVAL_MS);
	}
	signalServer("SIGKILL");
}

async function waitUntilReady() {
	const deadline = Date.now() + READY_TIMEOUT_MS;
	while (Date.now() < deadline) {
		if (serverExit !== null) throw new Error(`The server exited with code ${serverExit}.`);
		try {
			const response = await probe();
			if (response.ok) return;
		} catch {
			// Not listening yet.
		}
		await sleep(POLL_INTERVAL_MS);
	}
	throw new Error(`${readyUrl} did not answer within ${READY_TIMEOUT_MS / 1000} s.`);
}

let audit = null;
const run = () =>
	new Promise((resolve, reject) => {
		audit = spawn(command, args, { cwd: root, stdio: "inherit" });
		audit.on("error", reject);
		audit.on("exit", (code) => resolve(code ?? 1));
	});

for (const signal of ["SIGINT", "SIGTERM"]) {
	process.on(signal, () => {
		audit?.kill(signal);
		stopServer().finally(() => process.exit(1));
	});
}

let exitCode = 1;
try {
	await waitUntilReady();
	exitCode = await run();
} catch (error) {
	console.error(error.message);
	console.error(serverLog);
} finally {
	await stopServer();
}
process.exit(exitCode);
