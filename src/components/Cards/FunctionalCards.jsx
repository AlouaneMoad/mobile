import React, { useState, useEffect } from 'react';
import './FunctionalCards.css';

// Weight Record Card
export const WeightRecordCard = ({ weight, date, note }) => {
  return (
    <div className="functional-card weight-record-card">
      <div className="card-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18M6 9l6-6 6 6M6 15l6 6 6-6" />
        </svg>
      </div>
      <div className="card-content">
        <h3 className="card-title">Weight Record</h3>
        <div className="weight-value">{weight} kg</div>
        <div className="card-meta">
          <span className="date">{new Date(date).toLocaleDateString()}</span>
          {note && <span className="note">{note}</span>}
        </div>
      </div>
      <div className="card-trend">
        <span className="trend-indicator">+0.2</span>
      </div>
    </div>
  );
};

// Diet Plan Card
export const DietPlanCard = ({ title, calories, protein, carbs, fat }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`functional-card diet-plan-card ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-icon diet-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h3 className="card-title">{title}</h3>
          <p className="card-description">Click to see macros</p>
          <div className="flip-hint">Tap to flip</div>
        </div>
        <div className="card-back">
          <h3 className="card-title">Macros</h3>
          <div className="macro-grid">
            <div className="macro-item protein">
              <span className="macro-label">Protein</span>
              <span className="macro-value">{protein}g</span>
            </div>
            <div className="macro-item carbs">
              <span className="macro-label">Carbs</span>
              <span className="macro-value">{carbs}g</span>
            </div>
            <div className="macro-item fat">
              <span className="macro-label">Fat</span>
              <span className="macro-value">{fat}g</span>
            </div>
            <div className="macro-item calories">
              <span className="macro-label">Calories</span>
              <span className="macro-value">{calories}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exercise Suggestion Card
export const ExerciseCard = ({ exercise, duration, intensity, icon }) => {
  return (
    <div className="functional-card exercise-card">
      <div className="card-header">
        <div className="exercise-icon" style={{ background: getIntensityColor(intensity) }}>
          {icon || (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19l4-4 4 4 4-4 4 4" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </div>
        <div className="exercise-info">
          <h3 className="card-title">{exercise}</h3>
          <div className="exercise-meta">
            <span className="duration">{duration} min</span>
            <span className={`intensity ${intensity.toLowerCase()}`}>{intensity}</span>
          </div>
        </div>
      </div>
      <div className="exercise-progress">
        <div className="progress-bar" style={{ width: getIntensityWidth(intensity) }} />
      </div>
    </div>
  );
};

const getIntensityColor = (intensity) => {
  switch (intensity.toLowerCase()) {
    case 'high':
      return 'rgba(239, 68, 68, 0.2)';
    case 'medium':
      return 'rgba(245, 158, 11, 0.2)';
    case 'low':
      return 'rgba(16, 185, 129, 0.2)';
    default:
      return 'rgba(99, 102, 241, 0.2)';
  }
};

const getIntensityWidth = (intensity) => {
  switch (intensity.toLowerCase()) {
    case 'high':
      return '100%';
    case 'medium':
      return '66%';
    case 'low':
      return '33%';
    default:
      return '50%';
  }
};

// Stat Card
export const StatCard = ({ title, value, unit, trend, icon }) => {
  const isPositive = trend > 0;
  const trendColor = isPositive ? 'var(--danger)' : 'var(--success)';

  return (
    <div className="functional-card stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <div className="stat-value">
          {value}
          <span className="stat-unit">{unit}</span>
        </div>
        {trend !== undefined && (
          <div className="stat-trend" style={{ color: trendColor }}>
            {isPositive ? '↑' : '↓'} {Math.abs(trend)}% this week
          </div>
        )}
      </div>
    </div>
  );
};

// Add Record Card
export const AddRecordCard = ({ onClick }) => {
  return (
    <div className="functional-card add-record-card" onClick={onClick}>
      <div className="plus-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <span className="add-text">Add New Record</span>
    </div>
  );
};
