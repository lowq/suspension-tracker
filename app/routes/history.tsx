import { useState } from "react";
import { Link } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { SuspensionSetup } from "../types";

export default function History() {
  const [setups] = useLocalStorage<SuspensionSetup[]>("suspension-setups", []);
  const [filter, setFilter] = useState({ track: "", condition: "", searchQuery: "" });
  const [expandedSetup, setExpandedSetup] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSetup(expandedSetup === id ? null : id);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };
  
  const filteredSetups = setups.filter(setup => {
    const matchesTrack = filter.track === "" || setup.trackName.toLowerCase().includes(filter.track.toLowerCase());
    const matchesCondition = filter.condition === "" || setup.conditions === filter.condition;
    const matchesSearch = filter.searchQuery === "" || 
      setup.trackName.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      setup.notes.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      setup.tags.some(tag => tag.toLowerCase().includes(filter.searchQuery.toLowerCase()));
    
    return matchesTrack && matchesCondition && matchesSearch;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Suspension Setup History</h1>
      
      <div className="flex justify-between mb-4">
        <Link to="/" className="font-medium">New Setup</Link>
        <Link to="/history" className="font-medium">History</Link>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Filter Setups</h2>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="track" className="block text-sm font-medium mb-1">
              Track Name
            </label>
            <input
              type="text"
              id="track"
              name="track"
              value={filter.track}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Filter by track name"
            />
          </div>
          
          <div>
            <label htmlFor="condition" className="block text-sm font-medium mb-1">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              value={filter.condition}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Conditions</option>
              <option value="Loamy">Loamy</option>
              <option value="Hard-Pack">Hard-Pack</option>
              <option value="Sandy">Sandy</option>
              <option value="Muddy">Muddy</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="searchQuery" className="block text-sm font-medium mb-1">
              Search
            </label>
            <input
              type="text"
              id="searchQuery"
              name="searchQuery"
              value={filter.searchQuery}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Search in notes, tags, or track name"
            />
          </div>
        </div>
      </div>
      
      {/* Setup List */}
      <div className="space-y-4">
        {filteredSetups.length === 0 ? (
          <div className="text-center py-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No setups found</p>
          </div>
        ) : (
          filteredSetups.map(setup => (
            <div 
              key={setup.id}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
            >
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(setup.id)}
              >
                <div>
                  <h3 className="font-semibold">{setup.trackName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(setup.date)} · {setup.conditions}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link 
                    to={`/setup/${setup.id}`} 
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </Link>
                  <button 
                    className="px-2 py-1 border border-gray-300 rounded-md"
                    aria-label={expandedSetup === setup.id ? "Collapse" : "Expand"}
                  >
                    {expandedSetup === setup.id ? "▲" : "▼"}
                  </button>
                </div>
              </div>
              
              {expandedSetup === setup.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Front Suspension</h4>
                      <p className="text-sm">Compression: {setup.frontCompression} clicks</p>
                      <p className="text-sm">Rebound: {setup.frontRebound} clicks</p>
                      <p className="text-sm">Sag: {setup.frontSag} mm</p>
                      <p className="text-sm">Tire: {setup.frontTirePressure} bar</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Rear Suspension</h4>
                      <p className="text-sm">HSC: {setup.rearHighSpeedCompression} turns</p>
                      <p className="text-sm">LSC: {setup.rearLowSpeedCompression} clicks</p>
                      <p className="text-sm">Rebound: {setup.rearRebound} clicks</p>
                      <p className="text-sm">Sag: {setup.rearSag} mm</p>
                      <p className="text-sm">Tire: {setup.rearTirePressure} bar</p>
                    </div>
                  </div>
                  
                  {setup.notes && (
                    <div className="mt-3">
                      <h4 className="font-medium text-sm mb-1">Notes</h4>
                      <p className="text-sm whitespace-pre-line">{setup.notes}</p>
                    </div>
                  )}
                  
                  {setup.tags.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium text-sm mb-1">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {setup.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {setup.weather && (
                    <div className="mt-3">
                      <h4 className="font-medium text-sm mb-1">Weather</h4>
                      <p className="text-sm">{setup.weather}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 