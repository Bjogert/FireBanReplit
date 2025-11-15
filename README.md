# FireBanReplit - Swedish Fire Risk Checker

A React web application that provides real-time fire risk and fire prohibition information for municipalities in Sweden using the MSB (Myndigheten för samhällsskydd och beredskap) API.

## Features

- 🔥 Real-time fire risk assessment
- 🚫 Fire prohibition status by municipality
- 📊 7-day fire risk forecast
- 📍 Geolocation support
- 🔍 Municipality search with autocomplete
- 📱 Mobile-responsive design

## Technology Stack

- **React** 18.3.1 - UI framework
- **Vite** 6.3.5 - Build tool and dev server
- **Jest** - Testing framework
- **Docker** - Containerization support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Bjogert/FireBanReplit.git
cd FireBanReplit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configuration (Optional)

Copy the example environment file and adjust settings if needed:

```bash
cp .env.example .env.local
```

The application now attempts direct API access to the MSB API by default. If you encounter CORS issues, you can enable the proxy in the `.env.local` file:

```env
VITE_USE_PROXY=true
```

## Usage

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm test
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t fire-ban-checker .
```

### Run Docker Container

```bash
docker run -p 8080:8080 fire-ban-checker
```

Access the application at `http://localhost:8080`

## API Information

This application uses the MSB (Swedish Civil Contingencies Agency) Fire Risk API v2:

- **Current Risk**: Real-time fire risk indices
- **Fire Prohibition**: Official fire ban status
- **Weekly Forecast**: 7-day fire risk predictions

### API Endpoints

- Current Risk: `https://api.msb.se/brandrisk/v2/CurrentRisk/sv/{lat}/{lon}`
- Fire Prohibition: `https://api.msb.se/brandrisk/v2/FireProhibition/sv/{lat}/{lon}`
- Weekly Forecast: `https://api.msb.se/brandrisk/v2/RiskPartOfDayForecast/sv/{lat}/{lon}`

## Project Structure

```
FireBanReplit/
├── src/
│   ├── components/          # React components
│   │   ├── FireBanChecker.jsx
│   │   ├── FireHazardScale.jsx
│   │   ├── WeeklyForecast.jsx
│   │   └── ...
│   ├── services/           # API services
│   │   ├── fireBanService.js
│   │   ├── geolocationService.js
│   │   └── municipalityService.js
│   ├── App.jsx             # Main app component
│   └── index.jsx           # Entry point
├── public/                 # Static assets
├── docs/                   # GitHub Pages deployment
├── Dockerfile              # Docker configuration
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies
```

## Development

### Code Quality

The project uses:
- Jest for unit testing
- Babel for transpilation
- ESLint (can be configured)

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### CORS Issues

If you encounter CORS errors when accessing the MSB API:

1. Enable proxy mode in `.env.local`:
   ```env
   VITE_USE_PROXY=true
   ```

2. Alternatively, use a browser extension to bypass CORS (development only)

3. Or deploy with a backend proxy (see AGENT.MD for solutions)

### Geolocation Not Working

Ensure you're accessing the application via HTTPS or localhost. Browsers require secure contexts for geolocation.

### Build Errors

If you encounter build errors:

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

## License

ISC

## Authors

- Bjogert - [GitHub Profile](https://github.com/Bjogert)

## Acknowledgments

- MSB (Myndigheten för samhällsskydd och beredskap) for providing the Fire Risk API
- OpenStreetMap Nominatim for geocoding services

## Links

- **Live Demo**: https://bjogert.github.io/FireBanReplit/
- **GitHub Repository**: https://github.com/Bjogert/FireBanReplit
- **MSB Website**: https://www.msb.se/

---

For detailed technical analysis and improvement recommendations, see [AGENT.MD](./AGENT.MD).
 