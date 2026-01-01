import { X, MapPin, Mountain, Ruler, Calendar, FileText, FileJson, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import RiskTag from './RiskTag';
import TimeSeriesChart from './TimeSeriesChart';
import ModelExplanation from './ModelExplanation';
import { useState } from 'react';

const LakeDetailPanel = ({ lake, onClose }) => {
  const [historyOpen, setHistoryOpen] = useState(true);

  if (!lake) return null;

  return (
    <div className="fixed top-16 right-0 bottom-0 w-full sm:w-[420px] z-40 slide-in-right">
      <div className="h-full glass-panel border-l border-glass rounded-none flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-foreground">{lake.name}</h2>
              <span className="text-xs text-muted-foreground font-mono">{lake.id}</span>
            </div>
            <RiskTag level={lake.riskLevel} score={lake.riskScore} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 scrollbar-thin">
          <div className="p-4 space-y-6">
            {/* Lake Overview */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="w-1 h-3 bg-primary rounded-full" />
                Lake Overview
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-panel p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs">Coordinates</span>
                  </div>
                  <p className="text-sm font-medium text-foreground font-mono">
                    {lake.coordinates[1].toFixed(4)}°N
                  </p>
                  <p className="text-sm font-medium text-foreground font-mono">
                    {lake.coordinates[0].toFixed(4)}°E
                  </p>
                </div>
                <div className="glass-panel p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mountain className="w-3.5 h-3.5" />
                    <span className="text-xs">Elevation</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {lake.elevation.toLocaleString()} m
                  </p>
                  <p className="text-xs text-muted-foreground">above sea level</p>
                </div>
                <div className="glass-panel p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Ruler className="w-3.5 h-3.5" />
                    <span className="text-xs">Surface Area</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {lake.area} km²
                  </p>
                  <p className="text-xs text-muted-foreground">latest measurement</p>
                </div>
                <div className="glass-panel p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">Last Updated</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(lake.lastUpdated).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </section>

            <Separator className="bg-border" />

            {/* Historical Events */}
            <section>
              <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 w-full text-left">
                    {historyOpen ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="w-1 h-3 bg-destructive rounded-full" />
                      Previous GLOF Events
                    </h3>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {lake.history.length} recorded
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  {lake.history.length > 0 ? (
                    <div className="space-y-3">
                      {lake.history.map((event, index) => (
                        <div
                          key={index}
                          className="glass-panel p-3 rounded-lg border-l-2 border-destructive/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              event.magnitude === 'Catastrophic' ? 'bg-destructive/20 text-destructive' :
                              event.magnitude === 'Major' ? 'bg-warning/20 text-warning' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {event.magnitude}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{event.impact}</p>
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <ExternalLink className="w-3 h-3" />
                            <span>{event.source}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">No recorded GLOF history</p>
                      <p className="text-xs text-muted-foreground mt-1">This lake has no documented outburst events</p>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </section>

            <Separator className="bg-border" />

            {/* Time Series */}
            <section>
              <TimeSeriesChart data={lake.timeSeries} title="Lake Area & Precipitation Trends" />
            </section>

            <Separator className="bg-border" />

            {/* Model Explanation */}
            <section>
              <ModelExplanation features={lake.modelFeatures} />
            </section>

            <Separator className="bg-border" />

            {/* Download Options */}
            <section className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="w-1 h-3 bg-primary rounded-full" />
                Export Data
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 border-border hover:bg-secondary/50"
                >
                  <FileText className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 border-border hover:bg-secondary/50"
                >
                  <FileJson className="w-4 h-4" />
                  Export GeoJSON
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LakeDetailPanel;
