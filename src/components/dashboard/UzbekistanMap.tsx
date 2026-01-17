import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cities } from '@/data/cities'
import { SensorData, Status } from '@/types'
import Badge from '@/components/ui/Badge'

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface UzbekistanMapProps {
  sensorData: SensorData[]
  selectedCity?: string
  onCitySelect?: (cityId: string) => void
}

const statusColors: Record<Status, string> = {
  good: '#22c55e',
  moderate: '#eab308',
  poor: '#f97316',
  alert: '#ef4444',
}

// Create custom marker icons based on status
const createCustomIcon = (status: Status, isSelected: boolean) => {
  const color = statusColors[status]
  const size = isSelected ? 28 : 22
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
        transition: all 0.2s ease;
      ">
        ${status === 'alert' ? `
          <div style="
            position: absolute;
            inset: -6px;
            border: 2px solid ${color};
            border-radius: 50%;
            animation: pulse-ring 1.5s ease-out infinite;
          "></div>
        ` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

// Component to handle map view changes
function MapController({ selectedCity }: { selectedCity?: string }) {
  const map = useMap()

  useEffect(() => {
    if (selectedCity) {
      const city = cities.find(c => c.id === selectedCity)
      if (city) {
        map.flyTo([city.lat, city.lng], 10, { duration: 1 })
      }
    }
  }, [selectedCity, map])

  return null
}

export default function UzbekistanMap({ sensorData, selectedCity, onCitySelect }: UzbekistanMapProps) {
  const { t } = useTranslation()

  const getCityStatus = (cityId: string): Status => {
    const cityData = sensorData.filter(d => d.cityId === cityId && d.parameter === 'aqi')
    if (cityData.length === 0) return 'good'
    return cityData[0].status
  }

  const getCityAQI = (cityId: string): number | null => {
    const aqiData = sensorData.find(d => d.cityId === cityId && d.parameter === 'aqi')
    return aqiData?.value ?? null
  }

  // Uzbekistan center coordinates
  const uzbekistanCenter: [number, number] = [41.3775, 64.5853]

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden z-0">
      {/* Add custom CSS for pulse animation */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .leaflet-container {
          font-family: inherit;
          background: #f1f5f9;
        }
        .dark .leaflet-container {
          background: #1e293b;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-popup-tip {
          background: white;
        }
        .dark .leaflet-popup-content-wrapper,
        .dark .leaflet-popup-tip {
          background: #1e293b;
        }
        .dark .leaflet-layer,
        .dark .leaflet-control-zoom-in,
        .dark .leaflet-control-zoom-out,
        .dark .leaflet-control-attribution {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      <MapContainer
        center={uzbekistanCenter}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedCity={selectedCity} />

        {cities.map((city) => {
          const status = getCityStatus(city.id)
          const aqi = getCityAQI(city.id)
          const isSelected = selectedCity === city.id

          return (
            <Marker
              key={city.id}
              position={[city.lat, city.lng]}
              icon={createCustomIcon(status, isSelected)}
              eventHandlers={{
                click: () => onCitySelect?.(city.id),
              }}
            >
              <Popup>
                <div className="p-3 min-w-[150px] bg-white dark:bg-slate-800 rounded-xl">
                  <h3 className="font-semibold text-base mb-2 text-slate-900 dark:text-white">
                    {t(city.nameKey)}
                  </h3>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400">AQI:</span>
                    <Badge variant={status}>
                      {aqi ?? '-'}
                    </Badge>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {t(`status.${status}`)}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-surface/95 backdrop-blur rounded-xl p-3 border border-border z-[1000]">
        <p className="text-xs font-medium mb-2">{t('home.airQuality')}</p>
        <div className="flex flex-wrap gap-2">
          {(['good', 'moderate', 'poor', 'alert'] as Status[]).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: statusColors[status] }}
              />
              <span className="text-xs text-muted">{t(`status.${status}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
