"use client";

import "leaflet/dist/leaflet.css";
import "./BuildMapMap.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";

type Props = { projects: Project[]; selectedId: string; onSelect: (id: string) => void };

export default function BuildMapMap({ projects, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: true }).setView([18.5204, 73.8567], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = projects.map((project) => {
      const el = L.DomUtil.create("button", "buildmap-marker");
      el.type = "button";
      el.innerHTML = `<span>${project.completionPercentage}%</span><i></i>`;
      el.setAttribute("aria-label", project.name);
      if (project.id === selectedId) el.classList.add("is-selected");
      el.addEventListener("click", () => onSelect(project.id));
      const marker = L.marker([project.latitude, project.longitude], { icon: L.divIcon({ className: "", html: el.outerHTML, iconSize: [46,46], iconAnchor: [23,23] }), riseOnHover: true });
      marker.addTo(map);
      marker.on("click", () => onSelect(project.id));
      return marker;
    });
    return () => markersRef.current.forEach((m) => m.remove());
  }, [projects, selectedId, onSelect]);

  return <div ref={containerRef} className="real-map" aria-label="Interactive Pune map" />;
}
