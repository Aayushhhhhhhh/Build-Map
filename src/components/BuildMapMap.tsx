"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./BuildMapMap.css";
import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";

type Props = { projects: Project[]; selectedId: string; onSelect: (id: string) => void };

export default function BuildMapMap({ projects, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
      zoomControlPosition: "bottomright",
    }).setView([18.5204, 73.8567], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;

    const resize = () => map.invalidateSize();
    window.requestAnimationFrame(resize);
    const timeout = window.setTimeout(resize, 300);
    window.addEventListener("resize", resize);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("resize", resize);
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
      const selectedClass = project.id === selectedId ? "is-selected" : "";
      const icon = L.divIcon({
        className: "buildmap-marker-wrapper",
        html: `<button type="button" class="buildmap-marker ${selectedClass}" aria-label="${project.name}"><span>${project.completionPercentage}%</span><i></i></button>`,
        iconSize: [58, 58],
        iconAnchor: [29, 29],
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
  }, [projects, selectedId, onSelect]);

  return <div ref={containerRef} className="real-map" aria-label="Interactive Pune map" />;
}
