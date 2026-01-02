import { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  Mountain,
  Ruler,
  Calendar,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import RiskTag from './RiskTag';

/* ------------------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------------------ */

type RiskLevel = 'high' | 'medium' | 'low';

interface GlofEvent {
  date: string;
  magnitude: 'Minor' | 'Major' | 'Catastrophic';
  impact: string;
  source: string;
}

interface Lake {
  id: string;
  name: string;
  coordinates: [number, number]; // [lon, lat]
  elevation: number;
  area: number;
  lastUpdated: string;

  riskLevel: RiskLevel;
  riskScore: number;

  history: GlofEvent[];
}

interface GeoapifyResult {
  lat: number;
  lon: number;
}

interface LakeDetailPanelProps {
  lake: Lake | null;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/* COMPONENT */
/* ------------------------------------------------------------------ */

const LakeDetailPanel = ({ lake, onClose }: LakeDetailPanelProps) => {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [resolvedCoords, setResolvedCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  /* -------------------- GEOAPIFY (ALWAYS CALLED) -------------------- */

  useEffect(() => {
    if (!lake) return;

    const [lon, lat] = lake.coordinates;

    fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        if (data.results?.length) {
          const r: GeoapifyResult = data.results[0];
          setResolvedCoords({ lat: r.lat, lon: r.lon });
        }
      })
      .catch(() => setResolvedCoords(null));
  }, [lake]);

  if (!lake) return null;

  const displayLat = resolvedCoords?.lat ?? lake.coordinates[1];
  const displayLon = resolvedCoords?.lon ?? lake.coordinates[0];

  /* -------------------- UI -------------------- */

  return (
    <div className="fixed top-16 right-0 bottom-0 w-full sm:w-[420px] z-40 slide-in-right">
      <div className="h-full glass-panel border-l border-glass rounded-none flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b border-border flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-foreground">
                {lake.name}
              </h2>
              <span className="text-xs text-muted-foreground font-mono">
                {lake.id}
              </span>
            </div>
            <RiskTag level={lake.riskLevel} score={lake.riskScore} />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* CONTENT */}
        <ScrollArea className="flex-1 scrollbar-thin">
          <div className="p-4 space-y-6">

            {/* OVERVIEW */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <div className="w-1 h-3 bg-primary rounded-full" />
                Lake Overview
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* Coordinates */}
                <div className="glass-panel p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs">Coordinates</span>
                  </div>
                  <p className="text-sm font-mono">
                    {displayLat.toFixed(4)}°N
                  </p>
                  <p className="text-sm font-mono">
                    {displayLon.toFixed(4)}°E
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    resolved via Geoapify
                  </p>
                </div>

                {/* Elevation */}
                <div className="glass-panel p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mountain className="w-3.5 h-3.5" />
                    <span className="text-xs">Elevation</span>
                  </div>
                  <p className="text-sm font-medium">
                    {lake.elevation.toLocaleString()} m
                  </p>
                </div>

                {/* Area */}
                <div className="glass-panel p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Ruler className="w-3.5 h-3.5" />
                    <span className="text-xs">Surface Area</span>
                  </div>
                  <p className="text-sm font-medium">
                    {lake.area} km²
                  </p>
                </div>

                {/* Last Updated */}
                <div className="glass-panel p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">Last Updated</span>
                  </div>
                  <p className="text-sm font-medium">
                    {new Date(lake.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* GLOF HISTORY */}
            <section>
              <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 w-full">
                    {historyOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span className="text-sm font-semibold">
                      Previous GLOF Events
                    </span>
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-3 space-y-3">
                  {lake.history.length > 0 ? (
                    lake.history.map((event, idx) => (
                      <div
                        key={idx}
                        className="glass-panel p-3 rounded-lg border-l-2 border-destructive/50"
                      >
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            {new Date(event.date).toDateString()}
                          </span>
                          <span className="text-xs text-destructive">
                            {event.magnitude}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {event.impact}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-primary mt-1">
                          <ExternalLink className="w-3 h-3" />
                          {event.source}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="glass-panel p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">
                        No recorded GLOF history
                      </p>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </section>

          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LakeDetailPanel;
