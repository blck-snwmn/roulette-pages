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
    const [items, setItems] = useState<string[]>(Array(5).fill(""));

    const handleItemChange = (index: number, value: string) => {
        setItems((prevItems) => {
            const newItems = [...prevItems];
            newItems[index] = value;
            return newItems;
        });
    };

    const handleAddItem = () => {
        setItems((prevItems) => [...prevItems, ""]);
    };

    const handleRemoveItem = () => {
        setItems((prevItems) => prevItems.slice(0, -1));
    };

    const isSubmitDisabled = items.some((item) => item.trim() === "");

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">ルーレット生成</h1>
            <Form method="post">
                {items.map((item, index) => (
                    <div key={index} className="mb-4">
                        <label htmlFor={`item-${index}`} className="block font-bold mb-2 text-blue-600">
                            項目 {index + 1}
                        </label>
                        <input
                            type="text"
                            id={`item-${index}`}
                            name="item"
                            value={item}
                            onChange={(e) => handleItemChange(index, e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                ))}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        項目を追加
                    </button>
                    <button
                        type="button"
                        onClick={handleRemoveItem}
                        disabled={items.length <= 1}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    >
                        項目を削除
                    </button>
                </div>
                <div className="mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    >
                        ルーレットを生成
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default Generate;