export interface SuspensionSetup {
  id: string;
  date: string;
  trackName: string;
  conditions: string;
  weather: string;
  frontCompression: number;
  frontRebound: number;
  frontSag: number;
  rearHighSpeedCompression: number;
  rearLowSpeedCompression: number;
  rearRebound: number;
  rearSag: number;
  frontTirePressure: number;
  rearTirePressure: number;
  notes: string;
  tags: string[];
} 