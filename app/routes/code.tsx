import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Resvg } from "@resvg/resvg-js";
import QRCode from "qrcode";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const itemsParam = url.searchParams.get("items");
	if (!itemsParam) {
		return new Response("required items parameter", {
			status: 400,
		});
	}
	const items = itemsParam
		.split(",")
		.map((item) => decodeURIComponent(item.trim()))
		.filter((item) => item)
		.join(",");
	const rouletteURL = `https://${url.host}/roulette?items=${encodeURIComponent(
		items,
	)}`;

	const { env } = context.cloudflare;
	const pngBuffer = await env.GENERATOR.generate({
		value: rouletteURL,
		fitTo: {
			mode: "width",
			value: 200,
		},
	});
	return new Response(pngBuffer, {
		headers: {
			"Content-Type": "image/png",
			// "Content-Disposition": "attachment;",
			// "Content-Disposition": "inline",
		},
	});
};
