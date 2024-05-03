import {
	LoaderFunction,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import RouletteCanvas from "../components/RouletteCanvas";

import { useEffect, useRef, useState } from "react";
import History, { HistoryItem } from "~/components/History";
import { useRouletteState } from "~/hooks/useRouletteState";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const itemsParam = url.searchParams.get("items");

	let items: string[] = [];

	if (itemsParam) {
		// itemsパラメータから項目を生成
		items = itemsParam
			.split(",")
			.map((item) => decodeURIComponent(item.trim()))
			.filter((item) => item);
	}
	if (items.length < 2) {
		// デフォルトの項目を使用
		items = ["項目1", "項目2", "項目3", "項目4", "項目5", "項目6"];
	}

	return json({ items });
};

const MAX_HISTORY_LENGTH = 10;

const Roulette = () => {
	const { items: initialItems } = useLoaderData<typeof loader>();
	if (!initialItems || initialItems.length === 0) {
		return <div>項目がありません</div>;
	}

	const {
		isSpinning,
		rotation,
		history,
		items,
		eliminationMode,
		handleAnimationEnd,
		handleSpinClick,
		handleModeChange,
		handleResetClick,
		canSpin,
		canReset,
	} = useRouletteState(initialItems);

	const navigate = useNavigate();

	const handleGoBack = () => {
		const itemsParam = items.map((item) => encodeURIComponent(item)).join(",");
		navigate(`/generate?items=${itemsParam}`);
	};

	return (
		<div className="flex flex-col md:flex-row h-screen bg-gray-50">
			<div className="md:w-2/3 flex flex-col items-center">
				<div className="flex justify-center items-center h-screen">
					<div className="flex flex-col items-center">
						<RouletteCanvas
							items={items}
							rotation={rotation}
							isSpinning={isSpinning}
							onAnimationEnd={handleAnimationEnd}
						/>
						<div className="mt-4 flex flex-wrap justify-center">
							<button
								type="button"
								onClick={handleGoBack}
								className="m-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
							>
								戻る
							</button>
							<button
								type="button"
								onClick={handleSpinClick}
								disabled={!canSpin}
								className={`m-2 bg-blue-200 hover:bg-blue-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
									!canSpin ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								{isSpinning ? "スピン中..." : "スタート"}
							</button>
							<button
								type="button"
								onClick={handleResetClick}
								disabled={!canReset}
								className={`m-2 bg-green-200 hover:bg-green-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-200 ${
									!canReset ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								リスタート
							</button>
							<label className="m-2 flex items-center">
								<input
									type="checkbox"
									checked={eliminationMode}
									onChange={(e) => handleModeChange(e.target.checked)}
									className="form-checkbox h-5 w-5 text-blue-600"
								/>
								<span className="ml-2 text-gray-700">Elimination Mode</span>
							</label>
						</div>
					</div>
				</div>
			</div>
			<History history={history} historyHeight={600} />
		</div>
	);
};

export default Roulette;
