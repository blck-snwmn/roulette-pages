import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type React from "react";
import ItemInput from "./ItemInput";

interface ItemListProps {
	items: { id: number; value: string }[];
	onItemChange: (id: number, value: string) => void;
	onItemAdd: () => void;
	onItemRemove: (id: number) => void;
	onItemReset: () => void;
	handleDragEnd: (event: DragEndEvent) => void;
}

const ItemList: React.FC<ItemListProps> = ({
	items,
	onItemChange,
	onItemAdd,
	onItemRemove,
	onItemReset,
	handleDragEnd,
}) => {
	const isSubmitDisabled = items.some((item) => item.value.trim() === "");
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	return (
		<div>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				modifiers={[restrictToVerticalAxis]}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={items} strategy={verticalListSortingStrategy}>
					{items.map((item) => (
						<ItemInput
							key={item.id}
							item={item}
							onChange={onItemChange}
							onRemove={onItemRemove}
						/>
					))}
				</SortableContext>
			</DndContext>
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
