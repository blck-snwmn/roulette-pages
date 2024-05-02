import {
	LoaderFunction,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/cloudflare";
import RouletteCanvas from "../components/RouletteCanvas";
import { useLoaderData, useNavigate } from "@remix-run/react";

import { useEffect, useRef, useState } from "react";
import History, { HistoryItem } from "~/components/History";

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
	const { items } = useLoaderData<typeof loader>();
	if (!items || items.length === 0) {
		return <div>項目がありません</div>;
	}
	const [isSpinning, setIsSpinning] = useState<boolean>(false);
	const [rotation, setRotation] = useState<number>(0);
	const [history, setHistory] = useState<HistoryItem[]>([]);
	const [nextIndex, setNextIndex] = useState(0);

	const navigate = useNavigate();

	const handleGoBack = () => {
		const itemsParam = items.map((item) => encodeURIComponent(item)).join(",");
		navigate(`/generate?items=${itemsParam}`);
	};

	const handleAnimationEnd = (newRotation: number, resultIndex: number) => {
		setRotation(newRotation);
		const newSelectedItem = items[resultIndex];
		setHistory((prev) => {
			const newHistory = [
				{ index: nextIndex, item: newSelectedItem },
				...prev.slice(0, MAX_HISTORY_LENGTH - 1),
			];
			setNextIndex(nextIndex + 1);
			return newHistory;
		});
		setIsSpinning(false);
	};

	const handleSpinClick = () => {
		setIsSpinning(true);
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
						<div className="mt-4 flex">
							<button
								type="button"
								onClick={handleGoBack}
								className="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
							>
								戻る
							</button>
							<button
								type="button"
								onClick={handleSpinClick}
								disabled={isSpinning}
								className="bg-blue-200 hover:bg-blue-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
							>
								{isSpinning ? "スピン中..." : "スタート"}
							</button>
						</div>
					</div>
				</div>
			</div>
			<History history={history} historyHeight={600} />
		</div>
	);
};

export default Roulette;
