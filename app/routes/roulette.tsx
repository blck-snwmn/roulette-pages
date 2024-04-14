import React, { useRef, useEffect, useState } from 'react';

const Roulette = () => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const items = ['項目1', '項目2', '項目3', '項目4', '項目5', '項目6'];

    const drawRoulette = (rotation) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const radius = canvas.width / 2;
        const sliceAngle = (2 * Math.PI) / items.length;

        // キャンバスをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ルーレットの各セグメントとテキストを描画
        items.forEach((item, index) => {
            // セグメントの描画
            ctx.beginPath();
            const startAngle = sliceAngle * index + rotation; // 回転を加味
            const endAngle = startAngle + sliceAngle;
            ctx.arc(radius, radius, radius - 5, startAngle, endAngle); // 小さな余白を作る
            ctx.lineTo(radius, radius);
            ctx.closePath();
            ctx.fillStyle = `hsl(${index * (360 / items.length)}, 100%, 50%)`;
            ctx.fill();
            ctx.stroke();

            // テキストの描画
            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.fillText(item, radius / 2, 10);
            ctx.restore();
        });

        // 結果指示の矢印を描画
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(radius - 5, 5);
        ctx.lineTo(radius + 5, 5);
        ctx.lineTo(radius, 20);
        ctx.closePath();
        ctx.fill();
    };

    useEffect(() => {
        if (isSpinning) {
            const spinStartTime = Date.now();
            const spinDuration = Math.random() * 3000 + 2000; // 2秒から5秒のランダムな時間
            const easeOutSpin = (t) => (t < 1 ? 1 - Math.pow(1 - t, 3) : 1);

            const animateSpin = () => {
                const currentTime = Date.now();
                const elapsedTime = currentTime - spinStartTime;
                const progress = elapsedTime / spinDuration;
                const currentRotation = easeOutSpin(progress) * Math.PI * 2 * 10; // 10回転する

                drawRoulette(currentRotation);

                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(animateSpin);
                } else {
                    const resultIndex = Math.floor(((currentRotation / (2 * Math.PI)) % 1) * items.length);
                    setSelectedItem(items[resultIndex]);
                    setIsSpinning(false);
                }
            };

            animateSpin();
        } else {
            drawRoulette(0); // アニメーションがないときは基本の描画を行う
        }

        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isSpinning]);

    const handleSpinClick = () => {
        setIsSpinning(true);
        setSelectedItem(null);
    };

    return (
        <div>
            <canvas ref={canvasRef} width="300" height="300"></canvas>
            <button onClick={handleSpinClick} disabled={isSpinning}>スタート</button>
            {selectedItem && !isSpinning && <p>選ばれた項目: {selectedItem}</p>}
        </div>
    );
};

export default Roulette;
