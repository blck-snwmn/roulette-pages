const colorSet = [
	{ h: 0, s: 50, l: 80 }, // 赤
	{ h: 30, s: 50, l: 80 }, // オレンジ
	{ h: 60, s: 50, l: 80 }, // 黄色
	{ h: 120, s: 50, l: 80 }, // 緑
	{ h: 180, s: 50, l: 80 }, // 青
	{ h: 240, s: 50, l: 80 }, // 紫
	{ h: 270, s: 50, l: 80 }, // マゼンタ
	{ h: 300, s: 50, l: 80 }, // ピンク
	{ h: 330, s: 50, l: 80 }, // 赤紫
	{ h: 210, s: 50, l: 80 }, // 水色
];

export const generateColors = (numColors: number) => {
	const colors = [];
	for (let i = 0; i < numColors; i++) {
		colors.push(colorSet[i % colorSet.length]);
	}
	return colors;
};

export type Colors = ReturnType<typeof generateColors>;
