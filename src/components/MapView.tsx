import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

const MapView = ({ filters, onLakeSelect, selectedLake }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  const filteredLakes = glacierLakes.filter((lake) => {
    if (!filters.riskLevels.includes(lake.riskLevel)) return false;
    if (filters.searchQuery && !lake.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    return true;
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current, {
      center: [27.9, 86.5],
      zoom: 9,
      zoomControl: false,
    });

    // Dark tile layer (CartoDB Dark Matter)
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    });

    // Topographical tile layer (OpenTopoMap - free, no API key)
    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenTopoMap contributors',
      maxZoom: 17,
    });

    // Add dark layer as default
    darkLayer.addTo(map.current);

    // Layer control for switching
    const baseMaps = {
      "Dark": darkLayer,
      "Topographic": topoLayer,
    };
    L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(map.current);

    // Add zoom control
    L.control.zoom({ position: 'topright' }).addTo(map.current);

    // Add scale control
    L.control.scale({ position: 'bottomright' }).addTo(map.current);

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

    // Add markers for filtered lakes
    filteredLakes.forEach((lake) => {
      const color = getRiskColor(lake.riskLevel);
      const isHighRisk = lake.riskLevel === 'high';
      const isSelected = selectedLake?.id === lake.id;

      // Create circle marker
      const marker = L.circleMarker([lake.coordinates[1], lake.coordinates[0]], {
        radius: isSelected ? 12 : 8,
        fillColor: color,
        color: 'white',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: isHighRisk ? 'pulse-marker' : '',
      }).addTo(map.current!);

      // Add pulsing effect for high-risk lakes
      if (isHighRisk) {
        const pulseMarker = L.circleMarker([lake.coordinates[1], lake.coordinates[0]], {
          radius: 16,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.4,
          fillOpacity: 0.2,
          className: 'pulse-ring',
        }).addTo(map.current!);
        markersRef.current.push(pulseMarker);
      }

      // Tooltip on hover
      marker.bindTooltip(`
        <div class="p-2 rounded-lg" style="background: hsl(220, 35%, 10%); border: 1px solid hsl(195, 50%, 50%, 0.2);">
          <div class="font-semibold text-sm" style="color: hsl(210, 40%, 96%);">${lake.name}</div>
          <div class="text-xs mt-1" style="color: hsl(215, 20%, 55%);">
            Risk: <span style="color: ${color}; font-weight: 600;">${(lake.riskScore * 100).toFixed(0)}%</span>
          </div>
          <div class="text-xs" style="color: hsl(215, 20%, 55%);">
            ${lake.riskLevel.charAt(0).toUpperCase() + lake.riskLevel.slice(1)} Risk
          </div>
        </div>
      `, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'lake-tooltip',
      });

      // Click handler
      marker.on('click', () => {
        onLakeSelect(lake);
        map.current?.flyTo([lake.coordinates[1], lake.coordinates[0]], 11, {
          duration: 1.5,
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
    </div>
  );
};

export default MapView;
