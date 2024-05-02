import { useState } from "react";
import { HistoryItem } from "../components/History";

const MAX_HISTORY_LENGTH = 10;

export const useRouletteState = (initialItems: string[]) => {
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [rotation, setRotation] = useState<number>(0);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [nextIndex, setNextIndex] = useState(0);
    const [items, setItems] = useState<string[]>(initialItems);
    const [eliminationMode, setEliminationMode] = useState<boolean>(false);

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

        if (eliminationMode) {
            setItems((prevItems) => prevItems.filter((_, i) => i !== resultIndex));
        }
    };

    const handleSpinClick = () => {
        setIsSpinning(true);
    };

    const handleModeChange = (checked: boolean) => {
        setEliminationMode(checked);
    };

    return {
        isSpinning,
        rotation,
        history,
        items,
        eliminationMode,
        handleAnimationEnd,
        handleSpinClick,
        handleModeChange,
    };
};