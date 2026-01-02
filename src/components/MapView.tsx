import { useEffect, useRef } from 'react';
import maplibregl, { GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { GlacierLake, glacierLakes } from '@/data/lakesData';

interface MapViewProps {
  filters: {
    riskLevels: string[];
    yearRange: [number, number];
    searchQuery: string;
  };
  onLakeSelect: (lake: GlacierLake) => void;
  selectedLake: GlacierLake | null;
}

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const MAP_STYLE = `https://maps.geoapify.com/v1/styles/osm-bright-smooth/style.json?apiKey=${GEOAPIFY_API_KEY}`;

const MapView = ({ filters, onLakeSelect, selectedLake }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  /* -------------------------------------------------- */
  /* FILTER LAKES */
  /* -------------------------------------------------- */
  const filteredLakes = glacierLakes.filter(lake => {
    if (!filters.riskLevels.includes(lake.riskLevel)) return false;

    if (
      filters.searchQuery &&
      !lake.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  /* -------------------------------------------------- */
  /* INIT MAP */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    if (!GEOAPIFY_API_KEY) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [86.6, 27.9],
      zoom: 8,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      /* ---------------- SOURCE ---------------- */
      map.addSource('glacier-lakes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      /* ---------------- BASE DOTS ---------------- */
      map.addLayer({
        id: 'glacier-lake-dots',
        type: 'circle',
        source: 'glacier-lakes',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            6, 4,
            9, 6,
            12, 9,
          ],
          'circle-color': [
            'match',
            ['get', 'riskLevel'],
            'high', '#ff3b30',
            'medium', '#ff9500',
            'low', '#00c2ff',
            '#999999',
          ],
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#0b1220',
          'circle-opacity': 0.95,
        },
      });

      /* ---------------- PULSE LAYER (HIGH RISK ONLY) ---------------- */
      map.addLayer({
        id: 'glacier-lake-pulse',
        type: 'circle',
        source: 'glacier-lakes',
        filter: ['==', ['get', 'riskLevel'], 'high'],
        paint: {
          'circle-radius': 10,
          'circle-color': '#ff3b30',
          'circle-opacity': 0.0,
        },
      });

      /* ---------------- INTERACTION ---------------- */
      map.on('mouseenter', 'glacier-lake-dots', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'glacier-lake-dots', () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', 'glacier-lake-dots', e => {
        const feature = e.features?.[0];
        if (!feature) return;

        const lakeId = feature.properties?.id;
        const lake = glacierLakes.find(l => l.id === lakeId);
        if (!lake) return;

        onLakeSelect(lake);

        map.flyTo({
          center: lake.coordinates,
          zoom: 11,
          duration: 1000,
        });
      });

      /* ---------------- PULSE ANIMATION ---------------- */
      let radius = 10;
      let opacity = 0.6;
      let expanding = true;

      const animatePulse = () => {
        if (!map.getLayer('glacier-lake-pulse')) return;

        if (expanding) {
          radius += 0.35;
          opacity -= 0.012;
          if (radius > 26) expanding = false;
        } else {
          radius -= 0.35;
          opacity += 0.012;
          if (radius < 10) expanding = true;
        }

        map.setPaintProperty(
          'glacier-lake-pulse',
          'circle-radius',
          [
            'interpolate',
            ['linear'],
            ['zoom'],
            6, radius + 6,
            10, radius,
          ]
        );

        map.setPaintProperty(
          'glacier-lake-pulse',
          'circle-opacity',
          Math.max(opacity, 0)
        );

        requestAnimationFrame(animatePulse);
      };

      animatePulse();
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* -------------------------------------------------- */
  /* UPDATE DATA */
  /* -------------------------------------------------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource('glacier-lakes') as GeoJSONSource;
    if (!source) return;

    source.setData({
      type: 'FeatureCollection',
      features: filteredLakes.map(lake => ({
        type: 'Feature',
        properties: {
          id: lake.id,
          riskLevel: lake.riskLevel,
          riskScore: lake.riskScore,
        },
        geometry: {
          type: 'Point',
          coordinates: lake.coordinates,
        },
      })),
    });
  }, [filteredLakes]);

  /* -------------------------------------------------- */
  /* RENDER */
  /* -------------------------------------------------- */
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
