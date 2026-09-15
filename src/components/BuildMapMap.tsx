"use client";

import { useEffect, useRef } from "react";
import * as mapboxgl from "mapbox-gl/esm";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Project } from "@/data/projects";

type Props = {
  projects: Project[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function BuildMapMap({ projects, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    const map = new mapboxgl.Map({
      accessToken: token,
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [73.8567, 18.5204],
      zoom: 10.6,
      pitch: 0,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = projects.map((project) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `buildmap-marker ${project.id === selectedId ? "is-selected" : ""}`;
      el.innerHTML = `<span>${project.completionPercentage}%</span><i></i>`;
      el.setAttribute("aria-label", project.name);
      el.addEventListener("click", () => onSelect(project.id));

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([project.longitude, project.latitude])
        .addTo(map);
      return marker;
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [projects, selectedId, onSelect]);

  const hasToken = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  return (
    <div ref={containerRef} className="real-map" aria-label="Interactive Pune map">
      {!hasToken && (
        <div className="map-token-message">
          <strong>Connect the live map</strong>
          <span>Add <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> in Vercel.</span>
        </div>
      )}
    </div>
  );
}
