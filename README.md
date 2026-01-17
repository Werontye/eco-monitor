# EcoMonitor - Environmental Monitoring Platform for Uzbekistan

Real-time environmental monitoring platform that tracks Air Quality, Water Quality, Soil Quality, UV Radiation, and Weather metrics across major cities in Uzbekistan.

## Features

- **Live Dashboard**: Real-time KPI cards with animated updates, interactive Uzbekistan map with Leaflet/OpenStreetMap
- **Detailed Monitoring**: Category-based monitoring (Air, Water, Soil, UV, Weather) with time-series charts
- **Data & Analysis**: Advanced analytics with export capabilities (CSV/JSON)
- **AI Advisory**: AI-powered environmental recommendations and advice
- **Help Now (E-commerce)**: Order eco-friendly plants and monitoring kits
- **Multi-language**: Supports English, Russian, and Uzbek
- **Light/Dark Theme**: Full theme switching support

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: Leaflet + React-Leaflet + OpenStreetMap
- **Animations**: Framer Motion
- **i18n**: i18next + react-i18next
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/eco-monitor.git

# Navigate to project directory
cd eco-monitor

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Deployment

### Railway

1. Connect your GitHub repository to Railway
2. Railway will automatically detect and deploy the project
3. The `railway.json` file contains the deployment configuration

### Docker

```bash
# Build Docker image
docker build -t eco-monitor .

# Run container
docker run -p 80:80 eco-monitor
```

### Vercel/Netlify

The project is compatible with static hosting platforms:

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Card, etc.)
│   ├── layout/      # Layout components (Header, Footer)
│   ├── dashboard/   # Dashboard-specific components
│   └── charts/      # Chart components
├── pages/           # Page components
├── contexts/        # React contexts (Theme, Language)
├── i18n/            # Internationalization
│   └── locales/     # Translation files (en, ru, uz)
├── data/            # Mock data and constants
├── types/           # TypeScript type definitions
└── lib/             # Utility functions
```

## Supported Cities

Tashkent, Samarkand, Bukhara, Namangan, Andijan, Fergana, Nukus, Urgench, Kokand, Navoi, Jizzakh, Termez, Qarshi, Margilan

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
