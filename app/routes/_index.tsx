import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{
			name: "description",
			content: "Welcome to Remix! Using Vite and Cloudflare!",
		},
	];
};

interface ToolLink {
	path: string;
	label: string;
}

interface ToolLinksProps {
	links: ToolLink[];
}

const ToolLinks: React.FC<ToolLinksProps> = ({ links }) => {
	return (
		<ul className="space-y-4">
			{links.map(({ path, label }) => (
				<li key={path}>
					<Link
						to={path}
						className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						{label}
					</Link>
				</li>
			))}
		</ul>
	);
};

const toolLinks = [
	{ path: "/generate", label: "ルーレット" },
	// 他のツールへのリンクを追加する場合はここに追加
];

export default function Index() {
	return (
		<div className="max-w-md mx-auto mt-8">
			<h1 className="text-3xl font-bold mb-6 text-center">ランダムツール</h1>
			<ToolLinks links={toolLinks} />
		</div>
	);
}
