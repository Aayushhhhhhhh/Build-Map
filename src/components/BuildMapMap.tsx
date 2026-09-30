"use client";

import "leaflet/dist/leaflet.css";
import "./BuildMapMap.css";
import type LType from "leaflet";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

type Props = { projects: Project[]; selectedId: string; onSelect: (id: string) => void };

export default function BuildMapMap({ projects, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LType.Map | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markersRef = useRef<LType.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;

      try {
        const L = await import("leaflet");
        if (cancelled || !containerRef.current) return;

        leafletRef.current = L;
        const map = L.map(containerRef.current, {
          zoomControl: true,
          attributionControl: true,
          preferCanvas: true,
        }).setView([18.5204, 73.8567], 11);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        mapRef.current = map;
        setMapReady(true);

        // Ensure Leaflet measures the full-screen container after layout/hydration.
        window.requestAnimationFrame(() => map.invalidateSize());
        window.setTimeout(() => map.invalidateSize(), 250);
      } catch (error) {
        console.error("BuildMap Leaflet initialization failed", error);
        setMapError("The map could not be initialized. Please reload the page.");
      }
    }

    void initMap();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());

    markersRef.current = projects.map((project) => {
      const icon = L.divIcon({
        className: "buildmap-marker-wrapper",
        html: `<button type="button" class="buildmap-marker ${project.id === selectedId ? "is-selected" : ""}" aria-label="${project.name}"><span>${project.completionPercentage}%</span><i></i></button>`,
        iconSize: [46, 46],
        iconAnchor: [23, 23],
      });

      const marker = L.marker([project.latitude, project.longitude], {
        icon,
        riseOnHover: true,
      }).addTo(map);

      marker.on("click", () => onSelect(project.id));
      return marker;
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
    };
  }, [mapReady, projects, selectedId, onSelect]);

  return (
    <div ref={containerRef} className="real-map" aria-label="Interactive Pune map">
      {mapError && (
        <div className="map-error">
          <strong>Map unavailable</strong>
          <span>{mapError}</span>
        </div>
      )}
    </div>
  );
}
