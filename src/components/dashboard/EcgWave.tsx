import { useEffect, useRef } from "react";

export function EcgWave({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x = 0;
    let w = canvas.width;
    let h = canvas.height;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "oklch(0.7 0.2 180)";
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.moveTo(0, h / 2);

    let step = 0;
    let reqId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(10, 5, 20, 0.1)"; // fade effect
      ctx.fillRect(0, 0, w, h);

      ctx.beginPath();
      ctx.moveTo(x, h / 2);

      let nextX = x + 2;
      let nextY = h / 2;

      // Simulate ECG pattern
      const p = step % 100;
      if (p > 10 && p < 15) nextY -= 10;
      else if (p >= 15 && p < 20) nextY += 10;
      else if (p >= 30 && p < 35) nextY -= 40; // QRS
      else if (p >= 35 && p < 40) nextY += 20;
      else if (p >= 60 && p < 70) nextY -= 15; // T wave

      // add noise
      nextY += (Math.random() - 0.5) * 4;

      if (nextX >= w) {
        x = 0;
        nextX = 0;
      }

      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      x = nextX;
      step++;

      reqId = requestAnimationFrame(draw);
    };

    reqId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(reqId);
  }, [active]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={150} 
      className="w-full h-[150px] bg-black/40 rounded-lg border border-primary/20"
    />
  );
}
