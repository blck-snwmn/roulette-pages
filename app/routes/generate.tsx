// app/routes/generate.tsx
import { useEffect, useState } from "react";
import { type ActionFunction, redirect } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const items = form.getAll("item");
    const itemsString = items.map((item) => encodeURIComponent(String(item).trim())).join(",");
    return redirect(`/roulette?items=${itemsString}`);
};

const Generate = () => {
    const [itemCount, setItemCount] = useState(5);
    const [items, setItems] = useState<string[]>(Array(itemCount).fill(""));

    useEffect(() => {
        setItems(Array(itemCount).fill(""));
    }, [itemCount]);

    const handleItemChange = (index: number, value: string) => {
        setItems((prevItems) => {
            const newItems = [...prevItems];
            newItems[index] = value;
            return newItems;
        });
    };

    const handleAddItem = () => {
        setItemCount((prevCount) => prevCount + 1);
    };

    const handleRemoveItem = () => {
        setItemCount((prevCount) => Math.max(prevCount - 1, 1));
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">ルーレット生成</h1>
            <Form method="post">
                {items.map((item, index) => (
                    <div key={index} className="mb-4">
                        <label htmlFor={`item-${index}`} className="block text-gray-700 font-bold mb-2">
                            項目 {index + 1}
                        </label>
                        <input
                            type="text"
                            id={`item-${index}`}
                            name="item"
                            value={item}
                            onChange={(e) => handleItemChange(index, e.target.value)}
                            className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring"
                            required
                        />
                    </div>
                ))}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        項目を追加
                    </button>
                    <button
                        type="button"
                        onClick={handleRemoveItem}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        項目を削除
                    </button>
                </div>
                <div className="mt-8">
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        ルーレットを生成
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default Generate;