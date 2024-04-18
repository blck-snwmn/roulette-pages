import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Resvg } from "@resvg/resvg-js";
import QRCode from "qrcode";

export const loader = async ({ request }: LoaderFunctionArgs) => {
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
    const rouletteURL = `https://${url.host}/roulette?items=${encodeURIComponent(items)}`;
    const x = await QRCode.toString(rouletteURL, { type: "svg" });
    const svg = new Resvg(x, {
        fitTo: {
            mode: "width",
            value: 200,
        }
    });
    const pngData = svg.render();
    const pngBuffer = pngData.asPng();
    return new Response(pngBuffer, {
        headers: {
            "Content-Type": "image/png",
            // "Content-Disposition": "attachment;",
            // "Content-Disposition": "inline",
        },
    });
}