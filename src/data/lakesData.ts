export type RiskLevel = 'high' | 'medium' | 'low';

export interface GlofEvent {
  date: string;
  magnitude: string;
  impact: string;
  source: string;
}

export interface TimeSeriesPoint {
  date: string;
  area: number;
  ndwi: number;
  precipitation?: number;
}

export interface ModelFeature {
  name: string;
  contribution: number;
  description: string;
}

export interface GlacierLake {
  id: string;
  name: string;
  coordinates: [number, number];
  elevation: number;
  area: number;
  riskScore: number;
  riskLevel: RiskLevel;
  history: GlofEvent[];
  timeSeries: TimeSeriesPoint[];
  modelFeatures: ModelFeature[];
  lastUpdated: string;
}

export const glacierLakes: GlacierLake[] = [
  {
    id: 'GL-001',
    name: 'Imja Tsho',
    coordinates: [86.9253, 27.8975],
    elevation: 5010,
    area: 1.28,
    riskScore: 0.87,
    riskLevel: 'high',
    history: [
      { date: '2016-04-25', magnitude: 'Major', impact: 'Significant downstream flooding, 12 bridges destroyed', source: 'ICIMOD Report 2016' },
      { date: '2009-08-14', magnitude: 'Minor', impact: 'Localized flooding in valley', source: 'Nepal Geological Survey' },
    ],
    timeSeries: [
      { date: '2018-01', area: 1.01, ndwi: 0.42, precipitation: 45 },
      { date: '2019-01', area: 1.08, ndwi: 0.45, precipitation: 52 },
      { date: '2020-01', area: 1.15, ndwi: 0.48, precipitation: 58 },
      { date: '2021-01', area: 1.19, ndwi: 0.51, precipitation: 63 },
      { date: '2022-01', area: 1.24, ndwi: 0.53, precipitation: 71 },
      { date: '2023-01', area: 1.26, ndwi: 0.55, precipitation: 78 },
      { date: '2024-01', area: 1.28, ndwi: 0.57, precipitation: 82 },
    ],
    modelFeatures: [
      { name: 'Area Growth Rate', contribution: 0.34, description: '2.3% annual increase over 5 years' },
      { name: 'Dam Stability Index', contribution: 0.28, description: 'Moraine dam shows degradation' },
      { name: 'Glacier Proximity', contribution: 0.21, description: 'Active calving from parent glacier' },
      { name: 'Seismic Activity', contribution: 0.17, description: 'Recent micro-seismic events detected' },
    ],
    lastUpdated: '2024-03-15',
  },
  {
    id: 'GL-002',
    name: 'Tsho Rolpa',
    coordinates: [86.4783, 27.8617],
    elevation: 4580,
    area: 1.54,
    riskScore: 0.92,
    riskLevel: 'high',
    history: [
      { date: '1985-08-04', magnitude: 'Catastrophic', impact: 'Major GLOF event, destroyed multiple villages', source: 'WECS Report 1985' },
      { date: '1998-07-12', magnitude: 'Moderate', impact: 'Controlled release, minor damage', source: 'DHM Nepal' },
    ],
    timeSeries: [
      { date: '2018-01', area: 1.38, ndwi: 0.51, precipitation: 55 },
      { date: '2019-01', area: 1.42, ndwi: 0.53, precipitation: 62 },
      { date: '2020-01', area: 1.45, ndwi: 0.55, precipitation: 68 },
      { date: '2021-01', area: 1.48, ndwi: 0.56, precipitation: 72 },
      { date: '2022-01', area: 1.51, ndwi: 0.58, precipitation: 79 },
      { date: '2023-01', area: 1.53, ndwi: 0.59, precipitation: 85 },
      { date: '2024-01', area: 1.54, ndwi: 0.61, precipitation: 91 },
    ],
    modelFeatures: [
      { name: 'Volume Capacity', contribution: 0.38, description: 'Estimated 75M m³ water storage' },
      { name: 'Freeboard Level', contribution: 0.31, description: 'Only 2.3m freeboard remaining' },
      { name: 'Ice Core Degradation', contribution: 0.19, description: 'Thermal erosion observed' },
      { name: 'Upstream Ice Mass', contribution: 0.12, description: 'Large hanging glaciers above' },
    ],
    lastUpdated: '2024-03-12',
  },
  {
    id: 'GL-003',
    name: 'Thulagi Lake',
    coordinates: [84.4892, 28.4883],
    elevation: 4020,
    area: 0.89,
    riskScore: 0.64,
    riskLevel: 'medium',
    history: [],
    timeSeries: [
      { date: '2018-01', area: 0.78, ndwi: 0.38, precipitation: 42 },
      { date: '2019-01', area: 0.81, ndwi: 0.39, precipitation: 45 },
      { date: '2020-01', area: 0.83, ndwi: 0.41, precipitation: 48 },
      { date: '2021-01', area: 0.85, ndwi: 0.42, precipitation: 51 },
      { date: '2022-01', area: 0.87, ndwi: 0.43, precipitation: 54 },
      { date: '2023-01', area: 0.88, ndwi: 0.44, precipitation: 57 },
      { date: '2024-01', area: 0.89, ndwi: 0.45, precipitation: 60 },
    ],
    modelFeatures: [
      { name: 'Area Growth Rate', contribution: 0.29, description: '1.8% annual increase' },
      { name: 'Dam Stability Index', contribution: 0.35, description: 'Stable moraine structure' },
      { name: 'Outlet Condition', contribution: 0.22, description: 'Partially blocked outlet' },
      { name: 'Precipitation Trend', contribution: 0.14, description: 'Increasing monsoon intensity' },
    ],
    lastUpdated: '2024-03-10',
  },
  {
    id: 'GL-004',
    name: 'Dig Tsho',
    coordinates: [86.5825, 27.8542],
    elevation: 4350,
    area: 0.62,
    riskScore: 0.58,
    riskLevel: 'medium',
    history: [
      { date: '1985-08-04', magnitude: 'Major', impact: 'GLOF destroyed Namche hydropower plant', source: 'ICIMOD Database' },
    ],
    timeSeries: [
      { date: '2018-01', area: 0.55, ndwi: 0.35, precipitation: 38 },
      { date: '2019-01', area: 0.57, ndwi: 0.36, precipitation: 41 },
      { date: '2020-01', area: 0.58, ndwi: 0.37, precipitation: 44 },
      { date: '2021-01', area: 0.59, ndwi: 0.38, precipitation: 47 },
      { date: '2022-01', area: 0.60, ndwi: 0.39, precipitation: 50 },
      { date: '2023-01', area: 0.61, ndwi: 0.40, precipitation: 52 },
      { date: '2024-01', area: 0.62, ndwi: 0.41, precipitation: 55 },
    ],
    modelFeatures: [
      { name: 'Historical GLOF', contribution: 0.32, description: 'Previous major event in 1985' },
      { name: 'Dam Reconstruction', contribution: 0.28, description: 'Partial remediation completed' },
      { name: 'Glacier Recession', contribution: 0.24, description: 'Moderate retreat rate' },
      { name: 'Lake Depth', contribution: 0.16, description: 'Shallow profile reduces risk' },
    ],
    lastUpdated: '2024-03-08',
  },
  {
    id: 'GL-005',
    name: 'Lumding Tsho',
    coordinates: [86.6175, 27.7883],
    elevation: 4830,
    area: 0.45,
    riskScore: 0.31,
    riskLevel: 'low',
    history: [],
    timeSeries: [
      { date: '2018-01', area: 0.42, ndwi: 0.32, precipitation: 35 },
      { date: '2019-01', area: 0.43, ndwi: 0.33, precipitation: 37 },
      { date: '2020-01', area: 0.43, ndwi: 0.33, precipitation: 39 },
      { date: '2021-01', area: 0.44, ndwi: 0.34, precipitation: 41 },
      { date: '2022-01', area: 0.44, ndwi: 0.34, precipitation: 43 },
      { date: '2023-01', area: 0.45, ndwi: 0.35, precipitation: 45 },
      { date: '2024-01', area: 0.45, ndwi: 0.35, precipitation: 47 },
    ],
    modelFeatures: [
      { name: 'Stable Growth', contribution: 0.35, description: 'Minimal area change' },
      { name: 'Strong Dam', contribution: 0.30, description: 'Well-consolidated moraine' },
      { name: 'Good Drainage', contribution: 0.25, description: 'Clear outlet channel' },
      { name: 'Low Glacier Input', contribution: 0.10, description: 'Minimal ice calving' },
    ],
    lastUpdated: '2024-03-05',
  },
  {
    id: 'GL-006',
    name: 'Chamlang South',
    coordinates: [86.9542, 27.7675],
    elevation: 5200,
    area: 0.38,
    riskScore: 0.24,
    riskLevel: 'low',
    history: [],
    timeSeries: [
      { date: '2018-01', area: 0.35, ndwi: 0.28, precipitation: 32 },
      { date: '2019-01', area: 0.36, ndwi: 0.29, precipitation: 34 },
      { date: '2020-01', area: 0.36, ndwi: 0.29, precipitation: 35 },
      { date: '2021-01', area: 0.37, ndwi: 0.30, precipitation: 37 },
      { date: '2022-01', area: 0.37, ndwi: 0.30, precipitation: 38 },
      { date: '2023-01', area: 0.38, ndwi: 0.31, precipitation: 40 },
      { date: '2024-01', area: 0.38, ndwi: 0.31, precipitation: 41 },
    ],
    modelFeatures: [
      { name: 'Small Volume', contribution: 0.40, description: 'Limited water storage' },
      { name: 'Stable Basin', contribution: 0.30, description: 'Bedrock-stabilized' },
      { name: 'Remote Location', contribution: 0.20, description: 'No downstream infrastructure' },
      { name: 'Cold Climate', contribution: 0.10, description: 'Slower melt rates' },
    ],
    lastUpdated: '2024-03-01',
  },
  {
    id: 'GL-007',
    name: 'Birendra Tal',
    coordinates: [84.3517, 28.6125],
    elevation: 3950,
    area: 0.72,
    riskScore: 0.78,
    riskLevel: 'high',
    history: [
      { date: '2017-05-19', magnitude: 'Moderate', impact: 'Flash flooding in Manang district', source: 'DHM Nepal' },
    ],
    timeSeries: [
      { date: '2018-01', area: 0.58, ndwi: 0.44, precipitation: 48 },
      { date: '2019-01', area: 0.62, ndwi: 0.47, precipitation: 54 },
      { date: '2020-01', area: 0.65, ndwi: 0.49, precipitation: 61 },
      { date: '2021-01', area: 0.68, ndwi: 0.51, precipitation: 68 },
      { date: '2022-01', area: 0.70, ndwi: 0.53, precipitation: 74 },
      { date: '2023-01', area: 0.71, ndwi: 0.54, precipitation: 79 },
      { date: '2024-01', area: 0.72, ndwi: 0.55, precipitation: 84 },
    ],
    modelFeatures: [
      { name: 'Rapid Expansion', contribution: 0.36, description: '3.1% annual growth rate' },
      { name: 'Weak Dam Structure', contribution: 0.29, description: 'Ice-cored moraine' },
      { name: 'High Precipitation', contribution: 0.22, description: 'Monsoon intensification' },
      { name: 'Steep Catchment', contribution: 0.13, description: 'Rapid runoff potential' },
    ],
    lastUpdated: '2024-03-14',
  },
];

export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'high': return '#FF3B30';
    case 'medium': return '#FF9500';
    case 'low': return '#00C2FF';
  }
};

export const getRiskLabel = (level: RiskLevel): string => {
  switch (level) {
    case 'high': return 'High Risk';
    case 'medium': return 'Medium Risk';
    case 'low': return 'Low Risk';
  }
};
