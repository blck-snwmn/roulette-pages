import { useState } from "react";
import type { HistoryItem } from "../components/History";

const MAX_HISTORY_LENGTH = 10;

export const useRouletteState = (initialItems: string[]) => {
	const [isSpinning, setIsSpinning] = useState<boolean>(false);
	const [rotation, setRotation] = useState<number>(0);
	const [history, setHistory] = useState<HistoryItem[]>([]);
	const [nextIndex, setNextIndex] = useState(0);
	const [items, setItems] = useState<string[]>(initialItems);
	const [eliminationMode, setEliminationMode] = useState<boolean>(false);
	const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
		null,
	);
	const [originalItems] = useState<string[]>(initialItems);

	const handleAnimationEnd = (newRotation: number, resultIndex: number) => {
		setRotation(newRotation);
		setSelectedItemIndex(resultIndex);
		setHistory((prev) => {
			const newSelectedItem = items[resultIndex];
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
		if (eliminationMode && selectedItemIndex !== null) {
			setItems((prevItems) =>
				prevItems.filter((_, index) => index !== selectedItemIndex),
			);
			setSelectedItemIndex(null);
		}
		setIsSpinning(true);
	};

	const handleModeChange = (checked: boolean) => {
		setEliminationMode(checked);
		setSelectedItemIndex(null);
	};

	const handleResetClick = () => {
		setItems([...originalItems]);
		setSelectedItemIndex(null);
	};

	const canSpin = !isSpinning && !(eliminationMode && items.length <= 2);
	const canReset = eliminationMode && selectedItemIndex !== null;

	return {
		isSpinning,
		rotation,
		history,
		items,
		eliminationMode,
		handleAnimationEnd,
		handleSpinClick,
		handleModeChange,
		handleResetClick,
		canSpin,
		canReset,
	};
};
