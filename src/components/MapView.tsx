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

// MapLibre API key from environment
const MAPLIBRE_API_KEY = import.meta.env.VITE_MAPLIBRE_API_KEY || '';

const MapView = ({ filters, onLakeSelect, selectedLake }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const filteredLakes = glacierLakes.filter((lake) => {
    if (!filters.riskLevels.includes(lake.riskLevel)) return false;
    if (filters.searchQuery && !lake.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    return true;
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPLIBRE_API_KEY}`,
      center: [86.5, 27.9],
      zoom: 9,
      pitch: 45,
      bearing: 0,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-right');

    // Add terrain if available
    map.current.on('load', () => {
      // Add 3D terrain
      map.current?.addSource('terrain', {
        type: 'raster-dem',
        url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${MAPLIBRE_API_KEY}`,
        tileSize: 256,
      });
      
      map.current?.setTerrain({ source: 'terrain', exaggeration: 1.5 });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when filters or selection changes
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Close any open popup
    popupRef.current?.remove();

    // Add markers for filtered lakes
    filteredLakes.forEach((lake) => {
      const color = getRiskColor(lake.riskLevel);
      const isHighRisk = lake.riskLevel === 'high';
      const isSelected = selectedLake?.id === lake.id;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'lake-marker';
      el.style.cssText = `
        width: ${isSelected ? '28px' : '20px'};
        height: ${isSelected ? '28px' : '20px'};
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 ${isHighRisk ? '15px' : '8px'} ${color}80;
        transition: all 0.3s ease;
      `;

      // Add pulsing effect for high-risk lakes
      if (isHighRisk) {
        el.style.animation = 'marker-pulse 2s ease-in-out infinite';
      }

      // Create marker
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lake.coordinates[0], lake.coordinates[1]])
        .addTo(map.current!);

      // Create popup for hover
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15,
        className: 'lake-popup',
      }).setHTML(`
        <div class="p-3 rounded-lg" style="background: hsl(220, 35%, 10%); border: 1px solid hsl(195, 50%, 50%, 0.2);">
          <div class="font-semibold text-sm" style="color: hsl(210, 40%, 96%);">${lake.name}</div>
          <div class="text-xs mt-1" style="color: hsl(215, 20%, 55%);">
            Risk: <span style="color: ${color}; font-weight: 600;">${(lake.riskScore * 100).toFixed(0)}%</span>
          </div>
          <div class="text-xs" style="color: hsl(215, 20%, 55%);">
            ${lake.riskLevel.charAt(0).toUpperCase() + lake.riskLevel.slice(1)} Risk
          </div>
        </div>
      `);

      // Hover handlers
      el.addEventListener('mouseenter', () => {
        popup.setLngLat([lake.coordinates[0], lake.coordinates[1]]).addTo(map.current!);
        popupRef.current = popup;
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });

      // Click handler
      el.addEventListener('click', () => {
        onLakeSelect(lake);
        map.current?.flyTo({
          center: [lake.coordinates[0], lake.coordinates[1]],
          zoom: 11,
          duration: 1500,
        });
      });

      markersRef.current.push(marker);
    });
  }, [filteredLakes, selectedLake, onLakeSelect]);

  return (
    <div className="h-full w-full relative">
      <div ref={mapContainer} className="absolute inset-0" />
      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
      
      {/* API key warning */}
      {!MAPLIBRE_API_KEY && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg text-sm">
          MapLibre API key not configured. Add VITE_MAPLIBRE_API_KEY to your environment.
        </div>
      )}
    </div>
  );
};

export default MapView;
