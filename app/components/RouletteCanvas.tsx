import { useEffect, useRef, useState } from "react";

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

const generateColors = (numColors: number) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        colors.push(colorSet[i % colorSet.length]);
    }
    return colors;
};

type Colors = ReturnType<typeof generateColors>;
interface RouletteCanvasProps {
    items: string[];
    rotation: number;
    isSpinning: boolean;
    onAnimationEnd: (newRotation: number, resultIndex: number) => void;
}

const RouletteCanvas = ({
    items,
    rotation,
    isSpinning,
    onAnimationEnd,
}: RouletteCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [colors, setColors] = useState<Colors>(generateColors(items.length));

    useEffect(() => {
        setColors(generateColors(items.length));
    }, [items.length]);

    const drawRoulette = (rotation: number, colors: Colors) => {
        const canvas = canvasRef.current;
        if (!canvas) return; // canvasがnullの場合は早期リターン

        const ctx = canvas.getContext("2d");
        if (!ctx) return; // getContext('2d')がnullの場合は早期リターン

        const radius = canvas.width / 2;
        const sliceAngle = (2 * Math.PI) / items.length;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        items.forEach((item, index) => {
            ctx.beginPath();
            const startAngle = sliceAngle * index + rotation;
            const endAngle = startAngle + sliceAngle;
            ctx.arc(radius, radius, radius - 5, startAngle, endAngle);
            ctx.lineTo(radius, radius);
            ctx.closePath();
            ctx.fillStyle = `hsl(${colors[index].h}, ${colors[index].s}%, ${colors[index].l}%)`;
            ctx.fill();
            ctx.stroke();

            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.fillText(item, radius / 2, 10);
            ctx.restore();
        });

        ctx.fillStyle = "hsl(10, 90%, 50%)";
        ctx.beginPath();
        ctx.moveTo(canvas.width - 20, radius - 5);
        ctx.lineTo(canvas.width - 20, radius + 5);
        ctx.lineTo(canvas.width - 5, radius);
        ctx.closePath();
        ctx.fill();
    };

    useEffect(() => {
        const easeOutSpin = (t: number) => (t < 1 ? 1 - (1 - t) ** 3 : 1);
        if (isSpinning) {
            const spinStartTime = Date.now();
            const spinDuration = Math.random() * 3000 + 2000;
            const targetRotation = Math.random() * Math.PI * 2;

            const animateSpin = () => {
                const currentTime = Date.now();
                const elapsedTime = currentTime - spinStartTime;
                const progress = elapsedTime / spinDuration;
                const currentRotation =
                    easeOutSpin(progress) * Math.PI * 2 * 10 + targetRotation;

                drawRoulette(currentRotation, colors);

                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(animateSpin);
                } else {
                    const resultIndex =
                        Math.floor(
                            items.length -
                            ((currentRotation % (2 * Math.PI)) / (2 * Math.PI)) *
                            items.length,
                        ) % items.length;
                    onAnimationEnd(currentRotation, resultIndex);
                }
            };

            animateSpin();
        } else {
            drawRoulette(rotation, colors);
        }

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isSpinning, rotation, items, onAnimationEnd, drawRoulette, colors]);

    return (
        <canvas
            ref={canvasRef}
            width="500"
            height="500"
            className="rounded-full shadow-lg"
        />
    );
};

export default RouletteCanvas;