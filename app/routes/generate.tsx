import {
	type ActionFunction,
	type LoaderFunction,
	type LoaderFunctionArgs,
	SerializeFrom,
	json,
	redirect,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import ItemList from "../components/ItemList";
import useItemsState from "../hooks/useItemsState";

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
	return items.map((v, index) => ({ id: index + 1, value: v }));
};

const Generate = () => {
	const reqItems = useLoaderData<typeof loader>() as {
		id: number;
		value: string;
	}[];
	const {
		items,
		handleItemChange,
		handleItemAdd,
		handleItemRemove,
		handleItemReset,
		handleDragEnd,
	} = useItemsState(reqItems);
	return (
		<div className="max-w-md mx-auto mt-8 bg-gray-50 p-6 rounded-md shadow">
			<h1 className="text-2xl font-bold mb-4 text-gray-800">ルーレット生成</h1>
			<Form method="post">
				<ItemList
					items={items}
					onItemChange={handleItemChange}
					onItemAdd={handleItemAdd}
					onItemRemove={handleItemRemove}
					onItemReset={handleItemReset}
					handleDragEnd={handleDragEnd}
				/>
			</Form>
		</div>
	);
};

export default Generate;
