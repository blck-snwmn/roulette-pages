import {
	LoaderFunction,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { useEffect, useRef, useState } from "react";

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
	} else {
		// デフォルトの項目を使用
		items = ["項目1", "項目2", "項目3", "項目4", "項目5", "項目6"];
	}

	if (items.length === 0) {
		return json({ items: null });
	}

	return json({ items });
};

const colorSet = [
	{ h: 0, s: 50, l: 80 }, // 赤
	{ h: 30, s: 50, l: 80 }, // オレンジ
	{ h: 60, s: 50, l: 80 }, // 黄色
	{ h: 120, s: 50, l: 80 }, // 緑
	{ h: 180, s: 50, l: 80 }, // 青
	{ h: 240, s: 50, l: 80 }, // 紫
	{ h: 270, s: 50, l: 80 }, // マゼンタ
	{ h: 300, s: 50, l: 80 }, // ピンク
	{ h: 330, s: 50, l: 80 }, // 赤紫
	{ h: 210, s: 50, l: 80 }, // 水色
];

const generateColors = (numColors: number) => {
	const colors = [];
	for (let i = 0; i < numColors; i++) {
		colors.push(colorSet[i % colorSet.length]);
	}
	return colors;
};

type Colors = ReturnType<typeof generateColors>;

interface RouletteCanvasProps {
	items: string[];
	rotation: number;
	isSpinning: boolean;
	onAnimationEnd: (newRotation: number, resultIndex: number) => void;
}

const RouletteCanvas = ({
	items,
	rotation,
	isSpinning,
	onAnimationEnd,
}: RouletteCanvasProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationFrameRef = useRef<number | null>(null);
	const [colors, setColors] = useState<Colors>(generateColors(items.length));

	useEffect(() => {
		setColors(generateColors(items.length));
	}, [items.length]);

	const drawRoulette = (rotation: number, colors: Colors) => {
		const canvas = canvasRef.current;
		if (!canvas) return; // canvasがnullの場合は早期リターン

		const ctx = canvas.getContext("2d");
		if (!ctx) return; // getContext('2d')がnullの場合は早期リターン

		const radius = canvas.width / 2;
		const sliceAngle = (2 * Math.PI) / items.length;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		items.forEach((item, index) => {
			ctx.beginPath();
			const startAngle = sliceAngle * index + rotation;
			const endAngle = startAngle + sliceAngle;
			ctx.arc(radius, radius, radius - 5, startAngle, endAngle);
			ctx.lineTo(radius, radius);
			ctx.closePath();
			ctx.fillStyle = `hsl(${colors[index].h}, ${colors[index].s}%, ${colors[index].l}%)`;
			ctx.fill();
			ctx.stroke();

			ctx.save();
			ctx.translate(radius, radius);
			ctx.rotate(startAngle + sliceAngle / 2);
			ctx.textAlign = "center";
			ctx.fillStyle = "black";
			ctx.font = "16px Arial";
			ctx.fillText(item, radius / 2, 10);
			ctx.restore();
		});

		ctx.fillStyle = "hsl(10, 90%, 50%)";
		ctx.beginPath();
		ctx.moveTo(canvas.width - 20, radius - 5);
		ctx.lineTo(canvas.width - 20, radius + 5);
		ctx.lineTo(canvas.width - 5, radius);
		ctx.closePath();
		ctx.fill();
	};

	useEffect(() => {
		const easeOutSpin = (t: number) => (t < 1 ? 1 - (1 - t) ** 3 : 1);
		if (isSpinning) {
			const spinStartTime = Date.now();
			const spinDuration = Math.random() * 3000 + 2000;
			const targetRotation = Math.random() * Math.PI * 2;

			const animateSpin = () => {
				const currentTime = Date.now();
				const elapsedTime = currentTime - spinStartTime;
				const progress = elapsedTime / spinDuration;
				const currentRotation =
					easeOutSpin(progress) * Math.PI * 2 * 10 + targetRotation;

				drawRoulette(currentRotation, colors);

				if (progress < 1) {
					animationFrameRef.current = requestAnimationFrame(animateSpin);
				} else {
					const resultIndex =
						Math.floor(
							items.length -
								((currentRotation % (2 * Math.PI)) / (2 * Math.PI)) *
									items.length,
						) % items.length;
					onAnimationEnd(currentRotation, resultIndex);
				}
			};

			animateSpin();
		} else {
			drawRoulette(rotation, colors);
		}

		return () => {
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [isSpinning, rotation, items, onAnimationEnd, drawRoulette, colors]);

	return (
		<canvas
			ref={canvasRef}
			width="500"
			height="500"
			className="rounded-full shadow-lg"
		/>
	);
};

interface HistoryProps {
	history: HistoryItem[];
}

const historyHeight = 600; // 履歴の表示領域の高さ(px)

const History = ({ history }: HistoryProps) => {
	const current = history.length > 0 ? history[0] : null;

	return (
		<div className="md:w-1/3 flex flex-col justify-center p-4">
			<div className="overflow-auto" style={{ height: `${historyHeight}px` }}>
				<h2 className="text-lg font-bold mb-2">履歴</h2>
				{current && (
					<div
						className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
						role="alert"
					>
						<p className="font-bold">最新の結果</p>
						<p>{current.item}</p>
					</div>
				)}
				<ul>
					{history.map(({ index, item }) => (
						<li
							key={index}
							className={`border-b border-gray-200 py-2 ${
								index === current?.index && item === current?.item
									? "font-bold"
									: ""
							}`}
						>
							{index + 1}. {item}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

const MAX_HISTORY_LENGTH = 10;
type HistoryItem = { index: number; item: string };

const Roulette = () => {
	const { items } = useLoaderData<typeof loader>();
	if (!items || items.length === 0) {
		return <div>項目がありません</div>;
	}
	const [isSpinning, setIsSpinning] = useState<boolean>(false);
	const [rotation, setRotation] = useState<number>(0);
	const [history, setHistory] = useState<HistoryItem[]>([]);
	const [nextIndex, setNextIndex] = useState(0);

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
		<div className="flex flex-col md:flex-row h-screen">
			<div className="md:w-2/3 flex flex-col items-center">
				<div className="flex justify-center items-center h-screen">
					<div className="flex flex-col items-center">
						<RouletteCanvas
							items={items}
							rotation={rotation}
							isSpinning={isSpinning}
							onAnimationEnd={handleAnimationEnd}
						/>
						<div className="mt-4">
							<button
								type="button"
								onClick={handleSpinClick}
								disabled={isSpinning}
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
							>
								{isSpinning ? "スピン中..." : "スタート"}
							</button>
						</div>
					</div>
				</div>
			</div>
			<History history={history} />
		</div>
	);
};

export default Roulette;
