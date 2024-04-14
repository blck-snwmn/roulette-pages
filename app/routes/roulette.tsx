import React, { useRef, useEffect, useState } from 'react';

interface RouletteCanvasProps {
    items: string[];
    rotation: number;
    isSpinning: boolean;
    onAnimationEnd: (newRotation: number, resultIndex: number) => void;
}

const RouletteCanvas = ({ items, rotation, isSpinning, onAnimationEnd }: RouletteCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const drawRoulette = (rotation: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return; // canvasがnullの場合は早期リターン

        const ctx = canvas.getContext('2d');
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
            ctx.fillStyle = `hsl(${index * (360 / items.length)}, 100%, 50%)`;
            ctx.fill();
            ctx.stroke();

            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.fillText(item, radius / 2, 10);
            ctx.restore();
        });

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(canvas.width - 20, radius - 5);
        ctx.lineTo(canvas.width - 20, radius + 5);
        ctx.lineTo(canvas.width - 5, radius);
        ctx.closePath();
        ctx.fill();
    };



    useEffect(() => {
        const easeOutSpin = (t: number) => (t < 1 ? 1 - Math.pow(1 - t, 3) : 1);
        if (isSpinning) {
            const spinStartTime = Date.now();
            const spinDuration = Math.random() * 3000 + 2000;
            const targetRotation = Math.random() * Math.PI * 2;

            const animateSpin = () => {
                const currentTime = Date.now();
                const elapsedTime = currentTime - spinStartTime;
                const progress = elapsedTime / spinDuration;
                const currentRotation = easeOutSpin(progress) * Math.PI * 2 * 10 + targetRotation;

                drawRoulette(currentRotation);

                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(animateSpin);
                } else {
                    const resultIndex = Math.floor(items.length - ((currentRotation % (2 * Math.PI)) / (2 * Math.PI) * items.length)) % items.length;
                    onAnimationEnd(currentRotation, resultIndex)
                }
            };

            animateSpin();
        } else {
            drawRoulette(rotation);
        }

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isSpinning, rotation, items, onAnimationEnd]);

    return <canvas ref={canvasRef} width="300" height="300"></canvas>;
};

const Roulette = () => {
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [rotation, setRotation] = useState<number>(0);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const items = ['項目1', '項目2', '項目3', '項目4', '項目5', '項目6'];

    const handleAnimationEnd = (newRotation: number, resultIndex: number) => {
        setRotation(newRotation);
        setSelectedItem(items[resultIndex]);
        setIsSpinning(false);
    };

    const handleSpinClick = () => {
        setIsSpinning(true);
        setSelectedItem(null);
    };

    return (
        <div>
            <RouletteCanvas
                items={items}
                rotation={rotation}
                isSpinning={isSpinning}
                onAnimationEnd={handleAnimationEnd}
            />
            <button onClick={handleSpinClick} disabled={isSpinning}>
                {isSpinning ? 'スピン中...' : 'スタート'}
            </button>
            {selectedItem && !isSpinning && <p>選ばれた項目: {selectedItem}</p>}
        </div>
    );
};


export default Roulette;