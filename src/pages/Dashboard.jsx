import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CanvasChart } from '../components/Charts/CanvasChart';
import { SVGChart } from '../components/Charts/SVGChart';
import {
  WeightRecordCard,
  DietPlanCard,
  ExerciseCard,
  StatCard,
  AddRecordCard
} from '../components/Cards/FunctionalCards';
import { weightOperations, dietOperations, exerciseOperations, initDB } from '../utils/db';
import { useFormValidation } from '../hooks/useFormValidation';
import './Dashboard.css';

// Sample diet plans
const sampleDietPlans = [
  {
    id: 1,
    title: 'Balanced Nutrition',
    calories: 2000,
    protein: 80,
    carbs: 250,
    fat: 65
  },
  {
    id: 2,
    title: 'Low Carb Diet',
    calories: 1800,
    protein: 120,
    carbs: 100,
    fat: 110
  },
  {
    id: 3,
    title: 'High Protein',
    calories: 2200,
    protein: 150,
    carbs: 200,
    fat: 75
  }
];

// Sample exercises
const sampleExercises = [
  { id: 1, exercise: 'Morning Jog', duration: 30, intensity: 'Medium' },
  { id: 2, exercise: 'Weight Training', duration: 45, intensity: 'High' },
  { id: 3, exercise: 'Yoga Session', duration: 20, intensity: 'Low' },
  { id: 4, exercise: 'Swimming', duration: 40, intensity: 'Medium' }
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [weightRecords, setWeightRecords] = useState([]);
  const [dietPlans, setDietPlans] = useState(sampleDietPlans);
  const [exercises, setExercises] = useState(sampleExercises);
  const [showAddForm, setShowAddForm] = useState(false);
  const [chartType, setChartType] = useState('svg');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const addRecordForm = useFormValidation({
    weight: '',
    note: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('currentUser');
    if (!loggedInUser) {
      navigate('/');
      return;
    }

    setUser(JSON.parse(loggedInUser));
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await initDB();
      const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));

      // Load weight records
      const records = await weightOperations.getByUserId(loggedInUser.id);
      setWeightRecords(records);

      // Load diet plans
      const diets = await dietOperations.getAll();
      if (diets.length > 0) {
        setDietPlans(diets);
      }

      // Load exercises
      const exs = await exerciseOperations.getAll();
      if (exs.length > 0) {
        setExercises(exs);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
      const newRecord = {
        userId: loggedInUser.id,
        weight: parseFloat(addRecordForm.values.weight),
        date: new Date().toISOString(),
        note: addRecordForm.values.note || ''
      };

      await weightOperations.create(newRecord);
      addRecordForm.resetForm();
      setShowAddForm(false);
      await loadData();
    } catch (error) {
      console.error('Error adding record:', error);
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // Calculate stats
  const calculateStats = () => {
    if (weightRecords.length === 0) {
      return {
        currentWeight: 0,
        weightChange: 0,
        goalWeight: 70,
        bmi: 0
      };
    }

    const currentWeight = weightRecords[0]?.weight || 0;
    const previousWeight = weightRecords[1]?.weight || currentWeight;
    const weightChange = currentWeight - previousWeight;

    // Assume height from user profile or default
    const height = 170; // cm
    const heightM = height / 100;
    const bmi = (currentWeight / (heightM * heightM)).toFixed(1);

    return {
      currentWeight: currentWeight.toFixed(1),
      weightChange: weightChange.toFixed(1),
      goalWeight: 70,
      bmi
    };
  };

  const stats = calculateStats();
  const chartData = weightRecords.slice(0, 10).reverse();

  if (isLoading) {
    return (
      <div className="dashboard loading">
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="greeting">
            <h1>Welcome back,</h1>
            <h2>{user?.username || 'User'}</h2>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <StatCard
            title="Current Weight"
            value={stats.currentWeight}
            unit="kg"
            trend={stats.weightChange}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M12 3v18M6 9l6-6 6 6M6 15l6 6 6-6"/></svg>}
          />
          <StatCard
            title="Goal Weight"
            value={stats.goalWeight}
            unit="kg"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>}
          />
          <StatCard
            title="BMI"
            value={stats.bmi}
            unit=""
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2"><path d="M4 19l4-4 4 4 4-4 4 4"/></svg>}
          />
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="section-header">
          <h3>Weight Trends</h3>
          <div className="chart-toggle">
            <button
              className={`toggle-btn ${chartType === 'svg' ? 'active' : ''}`}
              onClick={() => setChartType('svg')}
            >
              SVG
            </button>
            <button
              className={`toggle-btn ${chartType === 'canvas' ? 'active' : ''}`}
              onClick={() => setChartType('canvas')}
            >
              Canvas
            </button>
          </div>
        </div>

        {chartData.length > 1 ? (
          chartType === 'svg' ? (
            <SVGChart data={chartData} width={600} height={300} />
          ) : (
            <CanvasChart data={chartData} width={600} height={300} />
          )
        ) : (
          <div className="no-data-message">
            <p>Add at least 2 weight records to see your trends</p>
          </div>
        )}
      </section>

      {/* Weight Records Section */}
      <section className="records-section">
        <div className="section-header">
          <h3>Recent Records</h3>
          <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {showAddForm && (
          <form className="add-record-form" onSubmit={addRecordForm.handleSubmit(handleAddRecord)}>
            <div className="form-row">
              <div className="form-field">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={addRecordForm.values.weight}
                  onChange={addRecordForm.handleChange}
                  onBlur={addRecordForm.handleBlur}
                  placeholder="Enter weight"
                  className={addRecordForm.touched.weight && addRecordForm.errors.weight ? 'error' : ''}
                />
                {addRecordForm.touched.weight && addRecordForm.errors.weight && (
                  <span className="error">{addRecordForm.errors.weight}</span>
                )}
              </div>
              <div className="form-field">
                <label>Note (optional)</label>
                <input
                  type="text"
                  name="note"
                  value={addRecordForm.values.note}
                  onChange={addRecordForm.handleChange}
                  placeholder="Add a note"
                />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={addRecordForm.isSubmitting}>
              {addRecordForm.isSubmitting ? 'Saving...' : 'Save Record'}
            </button>
          </form>
        )}

        <div className="records-list">
          {weightRecords.length > 0 ? (
            weightRecords.slice(0, 5).map((record) => (
              <WeightRecordCard
                key={record.id}
                weight={record.weight}
                date={record.date}
                note={record.note}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No weight records yet</p>
              <span>Start tracking your progress!</span>
            </div>
          )}
        </div>
      </section>

      {/* Diet Plans Section */}
      <section className="diet-section">
        <div className="section-header">
          <h3>Diet Plans</h3>
          <span className="badge">Click cards to flip</span>
        </div>
        <div className="cards-grid">
          {dietPlans.map((plan) => (
            <DietPlanCard
              key={plan.id}
              title={plan.title}
              calories={plan.calories}
              protein={plan.protein}
              carbs={plan.carbs}
              fat={plan.fat}
            />
          ))}
        </div>
      </section>

      {/* Exercise Suggestions Section */}
      <section className="exercise-section">
        <div className="section-header">
          <h3>Exercise Suggestions</h3>
        </div>
        <div className="cards-grid">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise.exercise}
              duration={exercise.duration}
              intensity={exercise.intensity}
            />
          ))}
        </div>
      </section>

      {/* Offline indicator */}
      <div className="offline-indicator">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
        <span>All data stored offline</span>
      </div>
    </div>
  );
};

export default Dashboard;
