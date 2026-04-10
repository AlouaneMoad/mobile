import React, { useRef, useEffect } from 'react';
import './Charts.css';

// Canvas-based weight chart
export const CanvasChart = ({ data, width = 600, height = 300 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size with device pixel ratio
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate bounds
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const weights = data.map(d => d.weight);
    const minWeight = Math.min(...weights) - 2;
    const maxWeight = Math.max(...weights) + 2;
    const weightRange = maxWeight - minWeight;

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const weightLabel = (maxWeight - (weightRange / 5) * i).toFixed(1);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${weightLabel} kg`, padding.left - 10, y + 4);
    }

    // Draw data line
    if (data.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      data.forEach((point, index) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * index;
        const normalizedWeight = (point.weight - minWeight) / weightRange;
        const y = padding.top + chartHeight - (normalizedWeight * chartHeight);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw gradient fill
      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

      ctx.lineTo(padding.left + chartWidth, height - padding.bottom);
      ctx.lineTo(padding.left, height - padding.bottom);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw data points
      data.forEach((point, index) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * index;
        const normalizedWeight = (point.weight - minWeight) / weightRange;
        const y = padding.top + chartHeight - (normalizedWeight * chartHeight);

        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.fill();

        // Inner point
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });
    }

    // Draw X-axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';

    const maxLabels = Math.min(data.length, 6);
    const step = Math.ceil(data.length / maxLabels);

    data.forEach((point, index) => {
      if (index % step === 0 || index === data.length - 1) {
        const x = padding.left + (chartWidth / (data.length - 1)) * index;
        const date = new Date(point.date);
        const label = `${date.getMonth() + 1}/${date.getDate()}`;
        ctx.fillText(label, x, height - padding.bottom + 20);
      }
    });

    // Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Weight Trend (Canvas)', padding.left, 24);

  }, [data, width, height]);

  return (
    <div className="chart-container">
      <canvas
        ref={canvasRef}
        style={{ width, height }}
        className="weight-canvas"
      />
    </div>
  );
};
