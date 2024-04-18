import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [remixCloudflareDevProxy(), remix(), tsconfigPaths()],
	build: {
		rollupOptions: {
			external: ['@resvg/resvg-js']
		}
	},
	optimizeDeps: {
		exclude: ['@resvg/resvg-js']
	}
});
