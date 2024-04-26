import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";

export function SortableItem({ item }) {
	const {
		setActivatorNodeRef,
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="border-2 border-sky-500 flex m-5"
		>
			<div
				ref={setActivatorNodeRef}
				className="bg-slate-600 w-10"
				{...attributes}
				{...listeners}
			/>
			<div>
				{item.id} {item.value}
			</div>
		</div>
	);
}

function App() {
	const [items, setItems] = useState([
		{
			id: "1",
			value: "1a",
		},
		{
			id: "2",
			value: "2a",
		},
		{
			id: "3",
			value: "3a",
		},
		{
			id: "4",
			value: "4a",
		},
		{
			id: "5",
			value: "5a",
		},
	]);
	// const sensors = useSensors(
	//     useSensor(PointerSensor),
	//     useSensor(KeyboardSensor, {
	//         coordinateGetter: sortableKeyboardCoordinates,
	//     }),
	// );

	return (
		<div>
			<DndContext
				// sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={items}>
					{items.map((item) => (
						<SortableItem key={item.id} item={item} />
					))}
				</SortableContext>
			</DndContext>
			<div>ssssssss</div>
		</div>
	);

	function handleDragEnd(event) {
		const { active, over } = event;
		if (over == null || active.id === over.id) {
			return;
		}
		const oldIndex = items.findIndex((item) => item.id === active.id);
		const newIndex = items.findIndex((item) => item.id === over.id);
		const x = arrayMove(items, oldIndex, newIndex);
		setItems(x);
	}
}

export default App;
