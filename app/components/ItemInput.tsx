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
		<div className="mb-2 relative flex" ref={setNodeRef} style={style}>
			<div
				className="drag-handle bg-gray-200 rounded-full cursor-move flex items-center justify-center m-1 p-2"
				ref={setActivatorNodeRef}
				{...attributes}
				{...listeners}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					className="w-3 h-3 text-gray-500"
				>
					<title>Drag</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</div>
			{/* {index} */}
			<input
				type="text"
				id={`item-${index}`}
				name="item"
				value={item.value}
				onChange={(e) => onChange(index, e.target.value)}
				className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
				required
			/>
		</div>
	);
};

export default ItemInput;
