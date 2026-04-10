# Weight Management Mobile App

A comprehensive weight management mobile app built with React, featuring form validation, offline caching, SVG animations, and responsive design.

## Features

### Login/Registration Pages with Form Validation

- **Username Validation**: 4-20 characters (letters, numbers, underscores), real-time detection
- **Email Validation**: Auto-detect @ symbol and domain format
- **Password Strength Detection**: 8+ characters, containing letters + numbers, real-time strength bar display
- **Confirm Password Matching**: Real-time prompt for inconsistency errors

### Weight Record Detail Pages

- **Canvas Chart**: Draw weight change curves using HTML5 Canvas
- **Responsive Layout**: Adapt to mobile phones and tablets
- **Offline Data Storage**: Use IndexedDB to store weight records, support offline submission
- **SVG Animated Chart**: Dynamically display weight trend charts with floating animations
- **Functional Cards**: Weight records, diet plans, exercise suggestions (responsive grid layout)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **IndexedDB (idb)** - Offline storage
- **Custom SVG animations** - Smooth chart animations

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Navigate to the `exp2` folder:

```bash
cd exp2
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to the URL shown (typically `http://localhost:3000`)

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
exp2/
├── public/
├── src/
│   ├── components/
│   │   ├── Cards/
│   │   │   ├── FunctionalCards.jsx
│   │   │   └── FunctionalCards.css
│   │   └── Charts/
│   │       ├── CanvasChart.jsx
│   │       ├── SVGChart.jsx
│   │       └── Charts.css
│   ├── hooks/
│   │   └── useFormValidation.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   ├── utils/
│   │   └── db.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Features Explained

### Form Validation

The app implements real-time form validation with:

- Real-time error detection as users type
- Password strength meter with visual feedback
- Username format validation (4-20 chars, alphanumeric + underscore)
- Email format validation with @ symbol detection
- Password confirmation matching

### Offline Storage

All data is stored locally using IndexedDB:

- User accounts persist across sessions
- Weight records are saved immediately
- No internet connection required
- Data syncs when app loads

### Charts

Two chart implementations are provided:

1. **Canvas Chart**: High-performance rendering using HTML5 Canvas API
2. **SVG Animated Chart**: Scalable graphics with smooth animations and floating particles

Both charts display:

- Weight trends over time
- Interactive data points
- Responsive sizing
- Smooth animations

### Responsive Design

The app is fully responsive:

- Mobile-first approach
- Adapts to phones, tablets, and desktops
- Touch-friendly interactions
- Consistent experience across devices

## Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Use your credentials to access the dashboard
3. **Add Records**: Click "Add" to record your weight
4. **View Trends**: Switch between Canvas and SVG charts to see your progress
5. **Explore**: Check diet plans (flip cards) and exercise suggestions

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT
