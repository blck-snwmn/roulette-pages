import type React from "react";

interface ItemInputProps {
	item: string;
	index: number;
	onChange: (index: number, value: string) => void;
}

const ItemInput: React.FC<ItemInputProps> = ({ item, index, onChange }) => {
	return (
		<div className="mb-4">
			<label
				htmlFor={`item-${index}`}
				className="block font-bold mb-2 text-gray-700"
			>
				項目 {index + 1}
			</label>
			<input
				type="text"
				id={`item-${index}`}
				name="item"
				value={item}
				onChange={(e) => onChange(index, e.target.value)}
				className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
				required
			/>
		</div>
	);
};

export default ItemInput;
