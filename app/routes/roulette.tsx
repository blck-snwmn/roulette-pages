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
						<div className="mt-4 flex flex-col items-center space-y-4">
							<div className="flex justify-center space-x-4 w-full">
								<button
									type="button"
									onClick={handleGoBack}
									className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-200 w-32"
								>
									戻る
								</button>
								<button
									type="button"
									onClick={handleSpinClick}
									disabled={!canSpin}
									className={`bg-blue-200 hover:bg-blue-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 w-32 ${
										!canSpin ? "opacity-50 cursor-not-allowed" : ""
									}`}
								>
									{isSpinning ? "スピン中..." : "スタート"}
								</button>
							</div>
							<div className="w-full flex justify-between items-center h-10">
								<div
									className="flex items-center space-x-2 w-32"
									title="Elimination Mode"
								>
									<input
										type="checkbox"
										id="eliminationMode"
										checked={eliminationMode}
										onChange={(e) => handleModeChange(e.target.checked)}
										className="form-checkbox h-5 w-5 text-blue-600"
									/>
									<label
										className="text-sm text-gray-600"
										htmlFor="eliminationMode"
									>
										Elimination
									</label>
								</div>
								<div className="w-32 flex justify-end">
									{eliminationMode && (
										<button
											type="button"
											onClick={handleResetClick}
											disabled={!canReset}
											className={`bg-green-200 hover:bg-green-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-200 w-32 ${
												!canReset ? "opacity-50 cursor-not-allowed" : ""
											}`}
										>
											リセット
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<History history={history} historyHeight={600} />
		</div>
	);
};

export default Roulette;
