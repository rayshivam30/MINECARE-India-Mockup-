'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

type MineLocation = {
  id: string;
  name: string;
  mineralId: string;
  position: [number, number];
  state: string;
  production: string;
};

const MINE_LOCATIONS: Record<string, MineLocation[]> = {
  aluminum: [
    { id: 'nalco', name: 'NALCO Mines', mineralId: 'aluminum', position: [20.9517, 85.0985], state: 'Odisha', production: '6.825 million tonnes/year' },
    { id: 'balco', name: 'BALCO Korba', mineralId: 'aluminum', position: [22.3475, 82.6875], state: 'Chhattisgarh', production: '5.7 million tonnes/year' },
    { id: 'hindalco', name: 'Hindalco Renukoot', mineralId: 'aluminum', position: [24.2, 83.03], state: 'Uttar Pradesh', production: '1.3 million tonnes/year' },
    { id: 'vedanta', name: 'Vedanta Jharsuguda', mineralId: 'aluminum', position: [21.85, 84.03], state: 'Odisha', production: '1.8 million tonnes/year' },
  ],
  copper: [
    { id: 'khetri', name: 'Khetri Copper Complex', mineralId: 'copper', position: [28.0, 75.8], state: 'Rajasthan', production: '31,000 tonnes/year' },
    { id: 'maldhara', name: 'Malanjkhand Copper Project', mineralId: 'copper', position: [22.03, 80.68], state: 'Madhya Pradesh', production: '2 million tonnes/year' },
    { id: 'singhbhum', name: 'Singhbhum Copper Belt', mineralId: 'copper', position: [22.8, 86.2], state: 'Jharkhand', production: '2.1 million tonnes/year' },
  ],
  lithium: [
    { id: 'mandya', name: 'Mandya Lithium Deposit', mineralId: 'lithium', position: [12.52, 76.9], state: 'Karnataka', production: '1,600 tonnes/year' },
    { id: 'jammu', name: 'Reasi Lithium Deposit', mineralId: 'lithium', position: [33.08, 74.73], state: 'Jammu & Kashmir', production: '5.9 million tonnes (reserves)' },
  ],
  steel: [
    { id: 'bailadila', name: 'Bailadila Iron Ore Mine', mineralId: 'steel', position: [18.66, 81.21], state: 'Chhattisgarh', production: '30 million tonnes/year' },
    { id: 'kudremukh', name: 'Kudremukh Iron Ore', mineralId: 'steel', position: [13.25, 75.25], state: 'Karnataka', production: '7.16 million tonnes/year' },
    { id: 'daitari', name: 'Daitari Iron Ore Mines', mineralId: 'steel', position: [21.11, 85.75], state: 'Odisha', production: '10 million tonnes/year' },
    { id: 'noamundi', name: 'Noamundi Iron Mine', mineralId: 'steel', position: [22.16, 85.53], state: 'Jharkhand', production: '10 million tonnes/year' },
  ],
  gold: [
    { id: 'kolar', name: 'Kolar Gold Fields', mineralId: 'gold', position: [13.13, 78.13], state: 'Karnataka', production: '2.3 tonnes/year' },
    { id: 'hutti', name: 'Hutti Gold Mines', mineralId: 'gold', position: [16.2, 76.66], state: 'Karnataka', production: '3.5 tonnes/year' },
    { id: 'ramagiri', name: 'Ramagiri Gold Fields', mineralId: 'gold', position: [13.8, 79.7], state: 'Andhra Pradesh', production: '750 kg/year' },
  ],
  silver: [
    { id: 'zawar', name: 'Zawar Mines', mineralId: 'silver', position: [24.35, 73.71], state: 'Rajasthan', production: '84 tonnes/year' },
    { id: 'tundoo', name: 'Tundoo Lead Smelter', mineralId: 'silver', position: [24.5, 85.4], state: 'Jharkhand', production: '60 tonnes/year' },
    { id: 'hzl', name: 'HZL Zinc Smelter', mineralId: 'silver', position: [22.7, 70.65], state: 'Gujarat', production: '700 tonnes/year' },
  ],
};

const MINERALS = [
  { id: 'aluminum', name: 'Aluminum', icon: '🔩' },
  { id: 'copper', name: 'Copper', icon: '⚡' },
  { id: 'lithium', name: 'Lithium', icon: '🔋' },
  { id: 'steel', name: 'Iron & Steel', icon: '🏗️' },
  { id: 'gold', name: 'Gold', icon: '💰' },
  { id: 'silver', name: 'Silver', icon: '✨' },
];

export default function SimpleMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedMineral, setSelectedMineral] = useState('aluminum');
  const [mines, setMines] = useState<MineLocation[]>([]);

  // Initialize map and markers
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Clean up previous map instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapRef.current = map;

    // Add markers for current mineral
    const currentMines = MINE_LOCATIONS[selectedMineral as keyof typeof MINE_LOCATIONS] || [];
    setMines(currentMines);

    currentMines.forEach((mine: MineLocation) => {
      L.marker(mine.position)
        .addTo(map)
        .bindPopup(`
          <div class="space-y-1">
            <h4 class="font-semibold">${mine.name}</h4>
            <p class="text-sm">${mine.state}, India</p>
            <p class="text-sm">Production: ${mine.production}</p>
          </div>
        `);
    });

    // Fit bounds to show all markers if there are any
    if (currentMines.length > 0) {
      const bounds = L.latLngBounds(currentMines.map(mine => mine.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [selectedMineral]);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-muted/20 to-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Mineral Resources in India</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover major mining locations across India and their mineral production data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">Select a Mineral</h3>
              <select
                value={selectedMineral}
                onChange={(e) => setSelectedMineral(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {MINERALS.map((mineral) => (
                  <option key={mineral.id} value={mineral.id}>
                    {mineral.icon} {mineral.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">
                {MINERALS.find(m => m.id === selectedMineral)?.name} Mines
              </h3>
              {mines.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {mines.map((mine) => (
                    <div key={mine.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <h4 className="font-medium">{mine.name}</h4>
                      <p className="text-sm text-muted-foreground">{mine.state}</p>
                      <p className="text-sm">Production: {mine.production}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No mine data available for this mineral.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 h-[600px] rounded-xl overflow-hidden border shadow-sm bg-card">
            <div 
              ref={mapContainerRef} 
              className="h-full w-full"
              style={{ minHeight: '600px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
