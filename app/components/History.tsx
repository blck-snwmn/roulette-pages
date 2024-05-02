interface HistoryProps {
	history: HistoryItem[];
	historyHeight: number;
}

export type HistoryItem = { index: number; item: string };

const History = ({ history, historyHeight }: HistoryProps) => {
	const current = history.length > 0 ? history[0] : null;

	return (
		<div className="md:w-1/3 flex flex-col justify-center p-4">
			<div
				className="overflow-auto bg-white p-4 rounded-md shadow"
				style={{ height: `${historyHeight}px` }}
			>
				<h2 className="text-lg font-bold mb-2">履歴</h2>
				{current && (
					<div
						className="bg-green-100 border-l-4 border-green-500 text-gray-800 p-4 mb-4"
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

export default History;
