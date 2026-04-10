# Weight Management PWA

A fully featured Progressive Web App (PWA) for weight management with offline support, form validation, SVG animations, and responsive design.

## Features

### PWA Capabilities
- **Offline Support**: Works completely offline using service workers and IndexedDB
- **Installable**: Can be installed on mobile devices and desktop
- **Auto-Updates**: Automatically updates when new versions are available
- **Push Notifications Ready**: Architecture supports future push notifications
- **Background Sync**: Syncs data when connection is restored

### Core Features
- **Form Validation**: Real-time username, email, and password validation
- **Password Strength Meter**: Visual feedback on password strength
- **Canvas Charts**: High-performance weight trend visualization
- **SVG Animated Charts**: Smooth animated line charts with floating particles
- **IndexedDB Storage**: All data stored locally for privacy
- **Responsive Design**: Adapts to mobile, tablet, and desktop

## Installation

### Install Dependencies

```bash
cd exp2
npm install
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## PWA Installation

### On Mobile (Android/iOS)

1. Open the app in Chrome/Safari
2. Tap the menu button (three dots)
3. Select "Add to Home Screen" or "Install App"
4. The app will be installed with an icon on your home screen

### On Desktop (Chrome/Edge)

1. Open the app in Chrome/Edge
2. You may see an install icon in the address bar
3. Click it or use menu → "Install Weight Manager"
4. The app will open in a separate window

### On macOS (Safari)

1. Open the app in Safari
2. Click "Share" in the toolbar
3. Select "Add to Dock" or "Add to Home Screen"

## PWA Features

### Service Worker
The app uses Workbox-powered service workers for:
- Asset caching (JS, CSS, HTML, images)
- Runtime caching for fonts and images
- Offline fallback page
- Automatic update checking

### Manifest
The web app manifest includes:
- App name and description
- Theme and background colors
- Display mode (standalone)
- App icons in multiple sizes
- Start URL and scope

### Caching Strategies

**Cache First**: Fonts, images, and static assets
**Network First**: API calls (future implementation)
**Stale While Revalidate**: Dynamic content

## Browser Support

- Chrome 90+ (Desktop & Android)
- Edge 90+
- Firefox 88+ (Limited PWA features)
- Safari 14+ (iOS requires web app manifest)
- Samsung Internet 14+

## Project Structure

```
exp2/
├── public/
│   ├── favicon.svg
│   ├── pwa-192x192.svg
│   ├── pwa-512x512.svg
│   ├── apple-touch-icon.png
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Cards/
│   │   │   ├── FunctionalCards.jsx
│   │   │   └── FunctionalCards.css
│   │   ├── Charts/
│   │   │   ├── CanvasChart.jsx
│   │   │   ├── SVGChart.jsx
│   │   │   └── Charts.css
│   │   ├── InstallPrompt.jsx
│   │   ├── InstallPrompt.css
│   │   ├── UpdateNotification.jsx
│   │   └── UpdateNotification.css
│   ├── hooks/
│   │   ├── useFormValidation.js
│   │   ├── usePWAInstall.js
│   │   └── useServiceWorker.js
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

## Usage

1. **Register**: Create an account with username, email, and password
2. **Login**: Use your credentials to access the dashboard
3. **Add Records**: Tap "+ Add" to record your weight
4. **View Trends**: Toggle between Canvas and SVG charts
5. **Diet & Exercise**: Browse suggested diet plans and exercises
6. **Offline**: Works without internet after first load

## Development

### Enable PWA in Development

PWA features are enabled in development mode for testing.

### Test Offline Mode

1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Click "Service Workers" in the sidebar
4. Check "Offline" checkbox
5. Reload the page

### Audit PWA

Use Lighthouse in Chrome DevTools:
1. Open DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App" category
4. Click "Generate report"

## License

MIT
