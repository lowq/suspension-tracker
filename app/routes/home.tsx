import { useState } from "react";
import { Link } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";
import type { SuspensionSetup } from "../types";

export default function Home() {
  const [setups, setSetups] = useLocalStorage<SuspensionSetup[]>("suspension-setups", []);
  const [formData, setFormData] = useState<Omit<SuspensionSetup, 'id' | 'date'>>({
    trackName: "",
    conditions: "Loamy",
    weather: "",
    frontCompression: 10,
    frontRebound: 10,
    frontSag: 100,
    rearHighSpeedCompression: 1.25,
    rearLowSpeedCompression: 10,
    rearRebound: 10,
    rearSag: 105,
    frontTirePressure: 0.9,
    rearTirePressure: 0.83,
    notes: "",
    tags: []
  });

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const availableTags = [
    "Front deflects", 
    "Rear kicks", 
    "Too soft", 
    "Too harsh", 
    "Perfect",
    "Bottoms out",
    "Unpredictable",
    "Stable",
    "Balanced"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Sag') || name.includes('Compression') || name.includes('Rebound') || name.includes('Pressure')
        ? parseFloat(value)
        : value
    }));
  };

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSetup: SuspensionSetup = {
      id: uuidv4(),
      date: new Date().toISOString(),
      ...formData,
      tags: activeTags
    };
    
    setSetups([newSetup, ...setups]);
    
    // Reset form
    setFormData({
      trackName: "",
      conditions: "Loamy",
      weather: "",
      frontCompression: 10,
      frontRebound: 10,
      frontSag: 100,
      rearHighSpeedCompression: 1.25,
      rearLowSpeedCompression: 10,
      rearRebound: 10,
      rearSag: 105,
      frontTirePressure: 0.9,
      rearTirePressure: 0.83,
      notes: "",
      tags: []
    });
    setActiveTags([]);
    
    alert("Setup saved successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Motocross Suspension Setup</h1>
      
      <div className="flex justify-between mb-4">
        <Link to="/" className="font-medium">New Setup</Link>
        <Link to="/history" className="font-medium">History</Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Track Entry Section */}
        <section className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Track Information</h2>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="trackName" className="block text-sm font-medium mb-1">
                Track Name
              </label>
              <input
                type="text"
                id="trackName"
                name="trackName"
                value={formData.trackName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="conditions" className="block text-sm font-medium mb-1">
                Conditions
              </label>
              <select
                id="conditions"
                name="conditions"
                value={formData.conditions}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Loamy">Loamy</option>
                <option value="Hard-Pack">Hard-Pack</option>
                <option value="Sandy">Sandy</option>
                <option value="Muddy">Muddy</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="weather" className="block text-sm font-medium mb-1">
                Weather (optional)
              </label>
              <input
                type="text"
                id="weather"
                name="weather"
                value={formData.weather}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </section>
        
        {/* Front Suspension Section */}
        <section className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Front Suspension</h2>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="frontCompression" className="block text-sm font-medium mb-1">
                Compression (clicks out)
              </label>
              <input
                type="number"
                id="frontCompression"
                name="frontCompression"
                value={formData.frontCompression}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="frontRebound" className="block text-sm font-medium mb-1">
                Rebound (clicks out)
              </label>
              <input
                type="number"
                id="frontRebound"
                name="frontRebound"
                value={formData.frontRebound}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="frontSag" className="block text-sm font-medium mb-1">
                Sag (mm)
              </label>
              <input
                type="number"
                id="frontSag"
                name="frontSag"
                value={formData.frontSag}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="1"
                required
              />
            </div>

            <div>
              <label htmlFor="frontTirePressure" className="block text-sm font-medium mb-1">
                Tire Pressure (bar)
              </label>
              <input
                type="number"
                id="frontTirePressure"
                name="frontTirePressure"
                value={formData.frontTirePressure}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.05"
                required
              />
            </div>
          </div>
        </section>
        
        {/* Rear Suspension Section */}
        <section className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Rear Suspension</h2>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="rearHighSpeedCompression" className="block text-sm font-medium mb-1">
                High-Speed Compression (turns out)
              </label>
              <input
                type="number"
                id="rearHighSpeedCompression"
                name="rearHighSpeedCompression"
                value={formData.rearHighSpeedCompression}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.25"
                required
              />
            </div>
            
            <div>
              <label htmlFor="rearLowSpeedCompression" className="block text-sm font-medium mb-1">
                Low-Speed Compression (clicks out)
              </label>
              <input
                type="number"
                id="rearLowSpeedCompression"
                name="rearLowSpeedCompression"
                value={formData.rearLowSpeedCompression}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="rearRebound" className="block text-sm font-medium mb-1">
                Rebound (clicks out)
              </label>
              <input
                type="number"
                id="rearRebound"
                name="rearRebound"
                value={formData.rearRebound}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="rearSag" className="block text-sm font-medium mb-1">
                Sag (mm)
              </label>
              <input
                type="number"
                id="rearSag"
                name="rearSag"
                value={formData.rearSag}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="1"
                required
              />
            </div>

            <div>
              <label htmlFor="rearTirePressure" className="block text-sm font-medium mb-1">
                Tire Pressure (bar)
              </label>
              <input
                type="number"
                id="rearTirePressure"
                name="rearTirePressure"
                value={formData.rearTirePressure}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.05"
                required
              />
            </div>
          </div>
        </section>
        
        {/* Feel/Feedback Section */}
        <section className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Feel & Feedback</h2>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Rider Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Behavior Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Save Setup
        </button>
      </form>
    </div>
  );
}
