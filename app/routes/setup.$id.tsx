import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { SuspensionSetup } from "../types";
import { useLocalization } from "../hooks/useLocalization";

export default function SetupDetail() {
  const { t } = useLocalization();
  const { id } = useParams<{ id: string }>();
  const [setups] = useLocalStorage<SuspensionSetup[]>("suspension-setups", []);
  const [setup, setSetup] = useState<SuspensionSetup | null>(null);

  useEffect(() => {
    const foundSetup = setups.find((s) => s.id === id);
    setSetup(foundSetup || null);
  }, [id, setups]);

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

  if (!setup) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-6">
          {t("motocross.setupDetail.notFound", "Setup Not Found")}
        </h1>
        <p className="mb-4">
          {t(
            "motocross.setupDetail.notFoundMessage",
            "The setup you're looking for doesn't exist."
          )}
        </p>
        <Link to="/history" className="text-blue-600 font-medium">
          {t("motocross.history.title", "Back to History")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">{setup.trackName}</h1>

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
          {t("motocross.setupDetail.trackInformation", "Track Information")}
        </h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">
              {t("motocross.setupDetail.date", "Date")}:
            </span>{" "}
            {formatDate(setup.date)}
          </p>
          <p>
            <span className="font-medium">
              {t("motocross.conditions", "Conditions")}:
            </span>{" "}
            {setup.conditions}
          </p>
          {setup.weather && (
            <p>
              <span className="font-medium">
                {t("motocross.weather", "Weather")}:
              </span>{" "}
              {setup.weather}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">
            {t("motocross.frontSuspension", "Front Suspension")}
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">
                {t("motocross.setupDetail.compression", "Compression")}:
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
                {t("motocross.setupDetail.tirePressure", "Tire Pressure")}:
              </span>{" "}
              {setup.frontTirePressure} {t("motocross.setupDetail.bar", "bar")}
            </p>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">
            {t("motocross.rearSuspension", "Rear Suspension")}
          </h2>
          <div className="space-y-2">
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
                {t("motocross.setupDetail.tirePressure", "Tire Pressure")}:
              </span>{" "}
              {setup.rearTirePressure} {t("motocross.setupDetail.bar", "bar")}
            </p>
          </div>
        </div>
      </div>

      {setup.notes && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">
            {t("motocross.riderNotes", "Rider Notes")}
          </h2>
          <p className="whitespace-pre-line">{setup.notes}</p>
        </div>
      )}

      {setup.tags.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">
            {t("motocross.behaviorTags", "Behavior Tags")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {setup.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 