import type React from "react";
import ItemInput from "./ItemInput";

interface ItemListProps {
	items: string[];
	onItemChange: (index: number, value: string) => void;
	onItemAdd: () => void;
	onItemRemove: () => void;
	onItemReset: () => void;
}

const ItemList: React.FC<ItemListProps> = ({
	items,
	onItemChange,
	onItemAdd,
	onItemRemove,
	onItemReset,
}) => {
	const isSubmitDisabled = items.some((item) => item.trim() === "");

	return (
		<div>
			{items.map((item, index) => (
				<ItemInput
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={index}
					item={item}
					index={index}
					onChange={onItemChange}
				/>
			))}
			<div className="flex justify-between">
				<button
					type="button"
					onClick={onItemAdd}
					className="bg-green-100 hover:bg-green-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
				>
					項目を追加
				</button>
				<button
					type="button"
					onClick={onItemRemove}
					disabled={items.length <= 1}
					className="bg-orange-100 hover:bg-orange-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:opacity-50"
				>
					項目を削除
				</button>
				<button
					type="button"
					onClick={onItemReset}
					className="bg-red-100 hover:bg-red-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-200"
				>
					リセット
				</button>
			</div>
			<div className="mt-8">
				<button
					type="submit"
					disabled={isSubmitDisabled}
					className="w-full bg-blue-200 hover:bg-blue-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
				>
					ルーレットを生成
				</button>
			</div>
		</div>
	);
};

export default ItemList;
