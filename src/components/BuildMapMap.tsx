"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./BuildMapMap.css";
import { useEffect, useRef } from "react";
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

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [73.8567, 18.5204],
      zoom: 10.6,
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
      return new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([project.longitude, project.latitude])
        .addTo(map);
    });

    return () => markersRef.current.forEach((marker) => marker.remove());
  }, [projects, selectedId, onSelect]);

  return (
    <div ref={containerRef} className={`real-map ${!process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? "map-preview" : ""}`} aria-label="Interactive Pune map">
      {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
        <div className="map-preview-art" aria-hidden="true">
          <span className="road r1" /><span className="road r2" /><span className="road r3" /><span className="road r4" />
          <span className="river" />
          <b className="map-label l-pune">PUNE</b><b className="map-label l-baner">BANER</b><b className="map-label l-wakad">WAKAD</b><b className="map-label l-kharadi">KHARADI</b><b className="map-label l-hadapsar">HADAPSAR</b>
        </div>
      )}
    </div>
  );
}
