import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { GlacierLake, glacierLakes, getRiskColor } from '@/data/lakesData';

interface MapViewProps {
  filters: {
    riskLevels: string[];
    yearRange: [number, number];
    searchQuery: string;
  };
  onLakeSelect: (lake: GlacierLake) => void;
  selectedLake: GlacierLake | null;
}

// ✅ Geoapify key (MUST be prefixed with VITE_)
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const MapView = ({ filters, onLakeSelect, selectedLake }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const filteredLakes = glacierLakes.filter((lake) => {
    if (!filters.riskLevels.includes(lake.riskLevel)) return false;
    if (
      filters.searchQuery &&
      !lake.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  /* =======================
     MAP INITIALIZATION
     ======================= */
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    if (!GEOAPIFY_API_KEY) {
      console.error('Geoapify API key missing');
      return;
    }

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geoapify.com/v1/styles/osm-liberty/style.json?apiKey=${GEOAPIFY_API_KEY}`,
      center: [86.5, 27.9],
      zoom: 9,
      pitch: 0,
      bearing: 0,
    });

    mapRef.current.addControl(
      new maplibregl.NavigationControl(),
      'top-right'
    );

    mapRef.current.on('error', (e) => {
      console.error('MapLibre error:', e.error);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  /* =======================
     MARKERS & POPUPS
     ======================= */
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    popupRef.current?.remove();

    filteredLakes.forEach((lake) => {
      const color = getRiskColor(lake.riskLevel);
      const isHighRisk = lake.riskLevel === 'high';
      const isSelected = selectedLake?.id === lake.id;

      const el = document.createElement('div');
      el.className = 'lake-marker';
      el.style.cssText = `
        width: ${isSelected ? '28px' : '20px'};
        height: ${isSelected ? '28px' : '20px'};
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 ${isHighRisk ? '14px' : '8px'} ${color}88;
        transition: all 0.25s ease;
      `;

      if (isHighRisk) {
        el.style.animation = 'marker-pulse 2s infinite';
      }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lake.coordinates[0], lake.coordinates[1]])
        .addTo(mapRef.current!);

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
      }).setHTML(`
        <div style="
          background: #0b1220;
          border: 1px solid rgba(56,189,248,0.25);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 12px;
          color: #e5e7eb;
        ">
          <div style="font-weight:600;">${lake.name}</div>
          <div style="margin-top:4px;">
            Risk:
            <span style="color:${color}; font-weight:600;">
              ${(lake.riskScore * 100).toFixed(0)}%
            </span>
          </div>
          <div style="opacity:0.7;">
            ${lake.riskLevel.toUpperCase()} RISK
          </div>
        </div>
      `);

      el.addEventListener('mouseenter', () => {
        popup
          .setLngLat([lake.coordinates[0], lake.coordinates[1]])
          .addTo(mapRef.current!);
        popupRef.current = popup;
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });

      el.addEventListener('click', () => {
        onLakeSelect(lake);
        mapRef.current?.flyTo({
          center: [lake.coordinates[0], lake.coordinates[1]],
          zoom: 11,
          duration: 1200,
        });
      });

      markersRef.current.push(marker);
    });
  }, [filteredLakes, selectedLake, onLakeSelect]);

  /* =======================
     RENDER
     ======================= */
  return (
  <div className="fixed inset-0 w-screen h-screen">
    <div ref={mapContainer} className="absolute inset-0" />

    {!GEOAPIFY_API_KEY && (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md text-sm z-50">
        Geoapify API key not configured
      </div>
    )}
  </div>
);
};

export default MapView;
