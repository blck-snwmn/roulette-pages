import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { ssrModuleExportsKey } from "vite/runtime";

const useItemsState = (
	initialItems: { id: number; value: string }[] = Array(5)
		.fill("")
		.map((v, index) => ({ id: index + 1, value: v })),
) => {
	const [items, setItems] = useState(initialItems);

	const handleItemChange = (id: number, value: string) => {
		setItems((prevItems) => {
			const newItems = [...prevItems];
			const ix = newItems.findIndex((item) => item.id === id);
			newItems[ix] = { id: id, value };
			return newItems;
		});
	};

	const handleItemAdd = () => {
		setItems((prevItems) => {
			const newItems = [...prevItems];
			const maxId = Math.max(...newItems.map((item) => item.id));
			newItems.push({ id: maxId + 1, value: "" });
			return newItems;
		});
	};

	const handleItemRemove = (id: number) => {
		setItems((prevItems) => {
			const newItems = [...prevItems];
			const ix = newItems.findIndex((item) => item.id === id);
			newItems.splice(ix, 1);
			return newItems;
		});
	};

	const handleItemReset = () => {
		setItems(Array(5).fill(""));
	};
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (over == null || active.id === over.id) {
			return;
		}
		setItems((items) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);

			return arrayMove(items, oldIndex, newIndex);
		});
	};

	return {
		items,
		handleItemChange,
		handleItemAdd,
		handleItemRemove,
		handleItemReset,
		handleDragEnd,
	};
};

export default useItemsState;
