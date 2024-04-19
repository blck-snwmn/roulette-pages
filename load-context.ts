import type { WorkerEntrypoint } from "cloudflare:workers";
import type { PlatformProxy } from "wrangler";

type Schema = {
	value: string;
	fitTo: {
		mode: "original";
	} | {
		value: number;
		mode: "width";
	};
};

interface GenerateService extends WorkerEntrypoint {
	generate(profile: Schema): Promise<Uint8Array>
}

interface Env {
	GENERATOR: Service<GenerateService>;
}

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
	interface AppLoadContext {
		cloudflare: Cloudflare;
	}
}
