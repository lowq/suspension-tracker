import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { SuspensionSetup } from "../types";
import { useLocalization } from "../hooks/useLocalization";

export default function History() {
  const { t } = useLocalization();
  const [setups] = useLocalStorage<SuspensionSetup[]>("suspension-setups", []);
  const [filteredSetups, setFilteredSetups] = useState<SuspensionSetup[]>([]);
  const [trackFilter, setTrackFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSetup, setExpandedSetup] = useState<string | null>(null);

  useEffect(() => {
    let filtered = [...setups];

    if (trackFilter) {
      filtered = filtered.filter((setup) =>
        setup.trackName.toLowerCase().includes(trackFilter.toLowerCase())
      );
    }

    if (conditionFilter) {
      filtered = filtered.filter((setup) =>
        setup.conditions.toLowerCase().includes(conditionFilter.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (setup) =>
          setup.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          setup.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          setup.trackName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSetups(filtered);
  }, [setups, trackFilter, conditionFilter, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const toggleSetup = (id: string) => {
    setExpandedSetup(expandedSetup === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        {t("motocross.history.title", "Suspension Setup History")}
      </h1>

      <div className="flex justify-between mb-4">
        <Link to="/" className="font-medium">
          {t("motocross.newSetup", "New Setup")}
        </Link>
        <Link to="/history" className="font-medium">
          {t("motocross.history.title", "History")}
        </Link>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">
          {t("motocross.history.filterSetups", "Filter Setups")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("motocross.history.trackName", "Track Name")}
            </label>
            <input
              type="text"
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
              placeholder={t("motocross.trackName", "Filter by track name")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("motocross.history.condition", "Condition")}
            </label>
            <input
              type="text"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
              placeholder={t(
                "motocross.history.allConditions",
                "All conditions"
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("motocross.history.search", "Search")}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
              placeholder={t(
                "motocross.history.searchPlaceholder",
                "Search in notes, tags, or track name"
              )}
            />
          </div>
        </div>
      </div>

      {filteredSetups.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          {t("motocross.history.noSetupsFound", "No setups found")}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredSetups.map((setup) => (
            <div
              key={setup.id}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{setup.trackName}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(setup.date)}
                  </p>
                  <p className="text-sm">{setup.conditions}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/setup/${setup.id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {t("motocross.history.view", "View")}
                  </Link>
                  <button
                    onClick={() => toggleSetup(setup.id)}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {expandedSetup === setup.id
                      ? t("motocross.history.collapse", "Collapse")
                      : t("motocross.history.expand", "Expand")}
                  </button>
                </div>
              </div>

              {expandedSetup === setup.id && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">
                      {t("motocross.frontSuspension", "Front Suspension")}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">
                          {t(
                            "motocross.setupDetail.compression",
                            "Compression"
                          )}
                          :
                        </span>{" "}
                        {setup.frontCompression}{" "}
                        {t("motocross.setupDetail.clicksOut", "clicks out")}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t("motocross.setupDetail.rebound", "Rebound")}:
                        </span>{" "}
                        {setup.frontRebound}{" "}
                        {t("motocross.setupDetail.clicksOut", "clicks out")}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t("motocross.setupDetail.sag", "Sag")}:
                        </span>{" "}
                        {setup.frontSag} {t("motocross.setupDetail.mm", "mm")}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t(
                            "motocross.setupDetail.tirePressure",
                            "Tire Pressure"
                          )}
                          :
                        </span>{" "}
                        {setup.frontTirePressure}{" "}
                        {t("motocross.setupDetail.bar", "bar")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">
                      {t("motocross.rearSuspension", "Rear Suspension")}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">
                          {t(
                            "motocross.setupDetail.highSpeedCompression",
                            "High-Speed Compression"
                          )}
                          :
                        </span>{" "}
                        {setup.rearHighSpeedCompression}{" "}
                        {t("motocross.setupDetail.turnsOut", "turns out")}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t(
                            "motocross.setupDetail.lowSpeedCompression",
                            "Low-Speed Compression"
                          )}
                          :
                        </span>{" "}
                        {setup.rearLowSpeedCompression}{" "}
                        {t("motocross.setupDetail.clicksOut", "clicks out")}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t("motocross.setupDetail.rebound", "Rebound")}:
                        </span>{" "}
                        {setup.rearRebound}{" "}
                        {t("motocross.setupDetail.clicksOut", "clicks out")}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t("motocross.setupDetail.sag", "Sag")}:
                        </span>{" "}
                        {setup.rearSag} {t("motocross.setupDetail.mm", "mm")}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t(
                            "motocross.setupDetail.tirePressure",
                            "Tire Pressure"
                          )}
                          :
                        </span>{" "}
                        {setup.rearTirePressure}{" "}
                        {t("motocross.setupDetail.bar", "bar")}
                      </p>
                    </div>
                  </div>
                  {setup.notes && (
                    <div className="md:col-span-2">
                      <h3 className="font-medium mb-2">
                        {t("motocross.riderNotes", "Rider Notes")}
                      </h3>
                      <p className="text-sm whitespace-pre-line">
                        {setup.notes}
                      </p>
                    </div>
                  )}
                  {setup.tags.length > 0 && (
                    <div className="md:col-span-2">
                      <h3 className="font-medium mb-2">
                        {t("motocross.behaviorTags", "Behavior Tags")}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {setup.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
