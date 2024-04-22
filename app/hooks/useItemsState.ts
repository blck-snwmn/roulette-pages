import { useState } from "react";

const useItemsState = (initialItems: string[] = Array(5).fill("")) => {
	const [items, setItems] = useState<string[]>(initialItems);

	const handleItemChange = (index: number, value: string) => {
		setItems((prevItems) => {
			const newItems = [...prevItems];
			newItems[index] = value;
			return newItems;
		});
	};

	const handleItemAdd = () => {
		setItems((prevItems) => [...prevItems, ""]);
	};

	const handleItemRemove = () => {
		setItems((prevItems) => prevItems.slice(0, -1));
	};

	const handleItemReset = () => {
		setItems(Array(5).fill(""));
	};

	return {
		items,
		handleItemChange,
		handleItemAdd,
		handleItemRemove,
		handleItemReset,
	};
};

export default useItemsState;
