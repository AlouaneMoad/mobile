import React, { useEffect, useState, useRef } from 'react';
import './Charts.css';

// SVG animated weight chart with floating animations
export const SVGChart = ({ data, width = 600, height = 300 }) => {
  const [animated, setAnimated] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState([]);
  const pathRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // Trigger animation after mount
      const timer = setTimeout(() => setAnimated(true), 100);
      return () => clearTimeout(timer);
    }
  }, [data]);

  useEffect(() => {
    if (animated && data && data.length > 1) {
      // Create floating animation points
      const points = data.map((point, index) => ({
        id: index,
        x: padding.left + (chartWidth / (data.length - 1)) * index,
        y: padding.top + chartHeight - ((point.weight - minWeight) / weightRange) * chartHeight,
        delay: index * 0.2
      }));
      setFloatingPoints(points);
    }
  }, [animated, data]);

  if (!data || data.length === 0) {
    return (
      <div className="chart-container svg-chart empty">
        <p>No data available</p>
      </div>
    );
  }

  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const weights = data.map(d => d.weight);
  const minWeight = Math.min(...weights) - 2;
  const maxWeight = Math.max(...weights) + 2;
  const weightRange = maxWeight - minWeight;

  // Generate path
  const pathPoints = data.map((point, index) => {
    const x = padding.left + (chartWidth / (data.length - 1)) * index;
    const y = padding.top + chartHeight - ((point.weight - minWeight) / weightRange) * chartHeight;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  });

  const pathD = pathPoints.join(' ');

  // Generate area path
  const areaPath = `${pathD} L ${padding.left + chartWidth} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  // Y-axis grid lines and labels
  const gridLines = [];
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i;
    const weight = maxWeight - (weightRange / 5) * i;
    gridLines.push({ y, label: weight.toFixed(1) });
  }

  // X-axis labels
  const maxLabels = Math.min(data.length, 6);
  const step = Math.ceil(data.length / maxLabels);
  const xLabels = data
    .filter((_, index) => index % step === 0 || index === data.length - 1)
    .map((point, idx, arr) => {
      const originalIndex = data.indexOf(point);
      return {
        x: padding.left + (chartWidth / (data.length - 1)) * originalIndex,
        label: `${new Date(point.date).getMonth() + 1}/${new Date(point.date).getDate()}`
      };
    });

  // Calculate path length for animation
  const pathLength = pathRef.current?.getTotalLength() || 1000;

  return (
    <div className="chart-container svg-chart">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          {/* Gradient for area */}
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>

          {/* Gradient for line */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shadow filter */}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Title */}
        <text x={padding.left} y={24} className="chart-title">
          Weight Trend (SVG Animated)
        </text>

        {/* Grid lines */}
        {gridLines.map((line, index) => (
          <g key={`grid-${index}`}>
            <line
              x1={padding.left}
              y1={line.y}
              x2={width - padding.right}
              y2={line.y}
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left - 10}
              y={line.y + 4}
              textAnchor="end"
              className="axis-label"
            >
              {line.label} kg
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map((label, index) => (
          <text
            key={`x-label-${index}`}
            x={label.x}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            className="axis-label"
          >
            {label.label}
          </text>
        ))}

        {/* Area */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
          className={`chart-area ${animated ? 'animated' : ''}`}
          style={{
            animationDelay: '0.2s'
          }}
        />

        {/* Main line with animation */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          className={`chart-line ${animated ? 'animated' : ''}`}
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: animated ? 0 : pathLength,
            transition: 'stroke-dashoffset 2s ease-in-out'
          }}
        />

        {/* Animated data points */}
        {data.map((point, index) => {
          const x = padding.left + (chartWidth / (data.length - 1)) * index;
          const y = padding.top + chartHeight - ((point.weight - minWeight) / weightRange) * chartHeight;
          const delay = index * 0.1;

          return (
            <g
              key={`point-${index}`}
              className={`data-point ${animated ? 'animated' : ''}`}
              style={{
                animationDelay: `${delay + 0.5}s`
              }}
            >
              {/* Outer ring */}
              <circle
                cx={x}
                cy={y}
                r="12"
                fill="rgba(99, 102, 241, 0.2)"
                className="point-ring"
                style={{ animationDelay: `${delay + 0.5}s` }}
              />

              {/* Main point */}
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="#6366f1"
                filter="url(#shadow)"
                className="point-main"
              />

              {/* Inner highlight */}
              <circle
                cx={x - 2}
                cy={y - 2}
                r="3"
                fill="rgba(255, 255, 255, 0.4)"
              />
            </g>
          );
        })}

        {/* Floating particles */}
        {floatingPoints.map((point, index) => (
          <circle
            key={`float-${index}`}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#ec4899"
            className="floating-particle"
            style={{
              animationDelay: `${point.delay + 1}s`,
              opacity: 0
            }}
          />
        ))}
      </svg>

      {/* Floating animation elements */}
      <div className="floating-elements">
        {animated && data.length > 0 && (
          <>
            <div className="float-circle float-1" />
            <div className="float-circle float-2" />
            <div className="float-circle float-3" />
          </>
        )}
      </div>
    </div>
  );
};
