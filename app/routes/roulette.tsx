// app/routes/roulette.jsx
import { useState, useEffect, useRef } from 'react';

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

export default function Roulette() {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const rouletteRef = useRef(null);

    useEffect(() => {
        const roulette = rouletteRef.current;
        const itemCount = items.length;
        const degrees = 360 / itemCount;

        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-0 text-sm';
            itemElement.style.transform = `translate(-50%, -50%) rotate(${degrees * index}deg) translate(0, -100px)`;
            itemElement.innerText = item;
            roulette.appendChild(itemElement);
        });
    }, []);

    const spinRoulette = () => {
        const roulette = rouletteRef.current;
        const itemCount = items.length;
        const degrees = 360 / itemCount;
        const randomIndex = Math.floor(Math.random() * itemCount);
        const targetDegrees = 360 - (randomIndex * degrees);
        let currentDegrees = 0;
        const speed = 5;
        const duration = 5000;

        setSpinning(true);

        const animate = (timestamp) => {
            if (!timestamp) timestamp = 0;
            const elapsed = timestamp - animate.startTime;
            currentDegrees = (elapsed / duration) * (targetDegrees + 360 * 2);
            roulette.style.transform = `rotate(${currentDegrees}deg)`;

            if (elapsed < duration) {
                requestAnimationFrame(animate);
            } else {
                setResult(items[randomIndex]);
                setSpinning(false);
            }
        };

        animate.startTime = performance.now();
        requestAnimationFrame(animate);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="relative">
                <div
                    ref={rouletteRef}
                    className="relative w-64 h-64 rounded-full border-2 border-black"
                ></div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
                    <div className="w-0 h-0 border-t-[15px] border-b-[15px] border-r-[30px] border-solid border-transparent border-r-red-500"></div>
                </div>
            </div>
            <button
                className="mt-8 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={spinRoulette}
                disabled={spinning}
            >
                {spinning ? 'Spinning...' : 'Spin'}
            </button>
            {result && <p className="mt-4">Result: {result}</p>}
        </div>
    );
}