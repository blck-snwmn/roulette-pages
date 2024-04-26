import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type React from "react";

interface ItemInputProps {
	item: { id: number; value: string };
	index: number;
	onChange: (index: number, value: string) => void;
}

const ItemInput: React.FC<ItemInputProps> = ({ item, index, onChange }) => {
	const {
		isDragging,
		// start sort
		setActivatorNodeRef,
		attributes,
		listeners,
		// dom
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 0,
	};

	return (
		<div className="mb-4 bg-slate-600 relative" ref={setNodeRef} style={style}>
			{/* {index} */}
			<label
				htmlFor={`item-${index}`}
				className="block font-bold mb-2 text-gray-700"
				ref={setActivatorNodeRef}
				{...attributes}
				{...listeners}
			>
				項目 {index + 1}
			</label>
			<input
				type="text"
				id={`item-${index}`}
				name="item"
				value={item.value}
				onChange={(e) => onChange(index, e.target.value)}
				className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
				required
			/>
		</div>
	);
};

export default ItemInput;
