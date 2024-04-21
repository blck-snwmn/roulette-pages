import {
	type ActionFunction,
	type LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const items = form.getAll("item");
	const itemsString = items
		.map((item) => encodeURIComponent(String(item).trim()))
		.join(",");
	return redirect(`/roulette?items=${itemsString}`);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const itemsParam = url.searchParams.get("items");

	const items = itemsParam
		? itemsParam
				.split(",")
				.map((item) => decodeURIComponent(item.trim()))
				.filter((item) => item)
		: Array(5).fill("");

	return json({ items });
};

const Generate = () => {
	const { items } = useLoaderData<typeof loader>();
	const [formItems, setFormItems] = useState<string[]>(items);

	const handleItemChange = (index: number, value: string) => {
		setFormItems((prevItems) => {
			const newItems = [...prevItems];
			newItems[index] = value;
			return newItems;
		});
	};

	const handleAddItem = () => {
		setFormItems((prevItems) => [...prevItems, ""]);
	};

	const handleRemoveItem = () => {
		setFormItems((prevItems) => prevItems.slice(0, -1));
	};

	const handleResetItems = () => {
		setFormItems(Array(5).fill(""));
	};

	const isSubmitDisabled = formItems.some((item) => item.trim() === "");

	return (
		<div className="max-w-md mx-auto mt-8 bg-gray-50 p-6 rounded-md shadow">
			<h1 className="text-2xl font-bold mb-4 text-gray-800">ルーレット生成</h1>
			<Form method="post">
				{formItems.map((item, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: This list maintains a list of input element.
					<div key={index} className="mb-4">
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
							onChange={(e) => handleItemChange(index, e.target.value)}
							className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
							required
						/>
					</div>
				))}
				<div className="flex justify-between">
					<button
						type="button"
						onClick={handleAddItem}
						className="bg-green-100 hover:bg-green-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
					>
						項目を追加
					</button>
					<button
						type="button"
						onClick={handleRemoveItem}
						disabled={formItems.length <= 1}
						className="bg-orange-100 hover:bg-orange-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:opacity-50"
					>
						項目を削除
					</button>
					<button
						type="button"
						onClick={handleResetItems}
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
			</Form>
		</div>
	);
};

export default Generate;
