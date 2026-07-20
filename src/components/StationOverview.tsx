import { useState } from "react";
import { Search, Accessibility, Navigation, AlertTriangle, ShieldAlert, Info, ArrowLeft, MapPin } from "lucide-react";
import { MTR_STATIONS, MtrStation } from "../data/mtrData";
import ARNavigator from "./ARNavigator";

export default function StationOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterWheelchairOnly, setFilterWheelchairOnly] = useState(false);
  const [arStationId, setArStationId] = useState<string | null>(null);

  const filteredStations = MTR_STATIONS.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          station.chineseName.includes(searchQuery);

    if (filterWheelchairOnly) {
      const hasWheelchairExit = station.exits.some(e => e.wheelchairFriendly);
      return matchesSearch && hasWheelchairExit;
    }
    return matchesSearch;
  });

  const getAccessibilityStats = (station: MtrStation) => {
    const totalExits = station.exits.length;
    const liftExits = station.exits.filter(e => e.hasLift).length;
    const percentage = totalExits > 0 ? Math.round((liftExits / totalExits) * 100) : 0;
    return { percentage, totalExits, liftExits };
  };

  const getLineColor = (line: string) => {
    switch (line) {
      case "Tsuen Wan Line": return "bg-red-600 text-white";
      case "Island Line": return "bg-blue-600 text-white";
      case "South Island Line": return "bg-lime-500 text-slate-900";
      case "East Rail Line": return "bg-sky-400 text-slate-900";
      case "Kwun Tong Line": return "bg-emerald-500 text-white";
      case "Tung Chung Line": return "bg-orange-500 text-white";
      case "Airport Express": return "bg-teal-600 text-white";
      default: return "bg-slate-700 text-white";
    }
  };

  if (arStationId) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setArStationId(null)}
          className="flex items-center gap-2 text-[#ac2e44] text-base md:text-lg font-semibold hover:underline py-2"
        >
          <ArrowLeft size={22} />
          Back to Stations
        </button>
        <ARNavigator initialStationId={arStationId} />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6" id="station-overview-panel">
      <div className="flex flex-col gap-4 bg-white p-4 md:p-5 border border-zinc-200 rounded-xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-4 md:top-5 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 text-zinc-900 text-lg rounded-lg pl-12 pr-4 py-4 border border-zinc-300 focus:outline-none focus:border-[#ac2e44] focus:ring-2 focus:ring-[#ac2e44]/20 placeholder-zinc-400 font-sans"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterWheelchairOnly}
            onChange={() => setFilterWheelchairOnly(!filterWheelchairOnly)}
            className="rounded border-zinc-300 text-[#ac2e44] focus:ring-[#ac2e44] w-6 h-6"
          />
          <span className="text-base md:text-lg font-semibold text-zinc-700">Wheelchair step-free only</span>
        </label>
      </div>

      <div className="bg-[#ac2e44]/5 border border-[#ac2e44]/20 rounded-xl p-4 flex flex-row items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-[#ac2e44] flex items-center justify-center text-white shrink-0">
          <Navigation size={24} />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold text-zinc-900">Indoor AR Navigation</h3>
          <p className="text-sm md:text-base text-zinc-600">Tap <strong>"Start AR Navigation"</strong> on any station card to view step-free indoor routes with a live camera overlay.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {filteredStations.map((station) => {
          const stats = getAccessibilityStats(station);
          return (
            <div key={station.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-4 md:p-5 border-b border-zinc-100 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full ${station.color} ring-4 ring-zinc-100 shrink-0`} />
                  <div>
                    <h3 className="font-bold text-xl md:text-2xl text-zinc-900">
                      {station.name}
                      <span className="text-lg md:text-xl font-bold text-zinc-700 ml-1">({station.chineseName})</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {station.lines.map((line, idx) => (
                        <span key={idx} className={`text-sm px-3 py-1 rounded font-semibold ${getLineColor(line)}`}>
                          {line}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-xl md:text-2xl font-bold text-[#ac2e44]">{stats.percentage}% accessible</div>
                  <div className="text-sm md:text-base text-zinc-500 font-medium">{stats.liftExits} of {stats.totalExits} exits have lifts</div>
                </div>
              </div>

              <div className="p-4 md:p-5 space-y-4">
                <div>
                  <div className="flex justify-between text-base md:text-lg text-zinc-600 font-medium mb-1.5">
                    <span>Step-free lift availability</span>
                    <span>{stats.liftExits} of {stats.totalExits} exits</span>
                  </div>
                  <div className="w-full h-4 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stats.percentage > 70 ? "bg-green-500" : stats.percentage > 40 ? "bg-amber-500" : "bg-[#ac2e44]"
                      }`}
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-base md:text-lg font-semibold text-zinc-700">Exits & Lift Access Details</div>
                  <div className="grid grid-cols-1 gap-2">
                    {station.exits.map((exit, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border text-base md:text-lg ${
                        exit.hasLift
                          ? "bg-green-50 border-green-200"
                          : exit.hasEscalator
                          ? "bg-amber-50 border-amber-200"
                          : "bg-white border-zinc-200"
                      }`}>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-4 py-2 rounded-lg flex items-center justify-center text-sm md:text-base font-bold whitespace-nowrap ${
                              exit.hasLift ? "bg-[#ac2e44] text-white" : "bg-zinc-200 text-zinc-600"
                            }`}>
                              {exit.name}
                            </span>
                            {exit.hasLift && (
                              <span className="text-xs md:text-sm px-2.5 py-1.5 rounded bg-green-200 text-green-800 font-semibold flex items-center gap-1 whitespace-nowrap">
                                <Accessibility size={14} /> LIFT
                              </span>
                            )}
                            {exit.hasEscalator && !exit.hasLift && (
                              <span className="text-xs md:text-sm px-2.5 py-1.5 rounded bg-amber-200 text-amber-800 font-semibold whitespace-nowrap">
                                ESCALATOR
                              </span>
                            )}
                          </div>
                          <p className="text-sm md:text-base text-zinc-600 leading-snug">{exit.description}</p>
                          {exit.locationDetails && (
                            <p className="text-sm md:text-base text-zinc-500 flex items-center gap-1">
                              <Info size={14} /> {exit.locationDetails}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {station.id === "mongkok" && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3 text-base md:text-lg">
                    <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-800 block mb-0.5">Staff-Assisted Wheelchair Lift (Exit E1):</span>
                      <span className="text-zinc-700">Exit E1 features a wheelchair stair platform. Please alert the MTR staff using the concourse intercom or call 2881-8888 beforehand for deployment.</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-4 md:px-5 py-4 bg-zinc-50 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="text-base md:text-lg text-zinc-500 font-medium flex items-center gap-1">
                  <MapPin size={18} /> {station.arRoutes.length} AR route{station.arRoutes.length !== 1 ? 's' : ''} mapped
                </div>

                <button
                  onClick={() => setArStationId(station.id)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base md:text-lg font-semibold bg-[#ac2e44] hover:bg-red-800 text-white transition-all shadow-sm"
                >
                  Start AR Navigation <Navigation size={20} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredStations.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-zinc-200 rounded-xl">
            <AlertTriangle className="text-zinc-300 mb-3 mx-auto" size={44} />
            <h4 className="text-xl font-semibold text-zinc-700">No matching stations found</h4>
            <p className="text-base md:text-lg text-zinc-500 max-w-md mx-auto mt-2">
              Try a different search term, or use the Chat tab to ask about any station.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
