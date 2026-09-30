"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const BuildMapMap = dynamic(() => import("@/components/BuildMapMap"), { ssr: false });
import { sampleProjects, type ProjectType } from "@/data/projects";

const projectTypes: Array<"All" | ProjectType> = ["All", "Residential", "Commercial", "Mixed Use"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"All" | ProjectType>("All");
  const [view, setView] = useState<"map" | "grid">("map");
  const [selectedId, setSelectedId] = useState(sampleProjects[0]?.id ?? "");

  const visibleProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleProjects.filter((project) => {
      const matchesType = type === "All" || project.type === type;
      const matchesQuery = !q || `${project.name} ${project.locality} ${project.reraNumber}`.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [query, type]);

  const selected = visibleProjects.find((project) => project.id === selectedId) ?? visibleProjects[0];

  return (
    <main className="buildmap-sketch-home">
      {view === "map" ? (
        <BuildMapMap projects={visibleProjects} selectedId={selected?.id ?? ""} onSelect={setSelectedId} />
      ) : (
        <div className="grid-view-backdrop">
          <div className="grid-view-inner">
            {visibleProjects.map((project) => <ProjectGridCard key={project.id} project={project} />)}
          </div>
        </div>
      )}

      <div className="homepage-ui-layer">
        <header className="sketch-header">
          <Link href="/" className="sketch-brand">BuildMap</Link>

          <div className="sketch-actions">
            <label className="location-search">
              <span>⌕</span>
              <input
                aria-label="Search location"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search location"
              />
            </label>

            <select className="type-select" value={type} onChange={(event) => setType(event.target.value as "All" | ProjectType)} aria-label="Property type">
              {projectTypes.map((item) => <option key={item} value={item}>{item === "All" ? "Type" : item}</option>)}
            </select>

            <div className="view-toggle" aria-label="Map or grid view">
              <button className={view === "map" ? "selected" : ""} onClick={() => setView("map")}>Map</button>
              <button className={view === "grid" ? "selected" : ""} onClick={() => setView("grid")}>Grid</button>
            </div>

            <Link className="list-property" href="#list-property">List your properties</Link>
            <Link className="sign-in" href="#sign-in">Sign in</Link>
          </div>
        </header>
        <div className="result-count">{visibleProjects.length >= 1000 ? visibleProjects.length : "1,000+"} Results</div>

        <div className="map-zoom">
          <button aria-label="Zoom in" onClick={() => window.dispatchEvent(new Event("buildmap:zoom-in"))}>+</button>
          <button aria-label="Zoom out" onClick={() => window.dispatchEvent(new Event("buildmap:zoom-out"))}>−</button>
        </div>
      </div>
    </main>
  );
}

function ProjectGridCard({ project }: { project: typeof sampleProjects[number] }) {
  return (
    <Link className="grid-project-card" href={`/projects/${project.id}`}>
      <div className="grid-project-image"><span>{project.type}</span></div>
      <div className="grid-project-content">
        <small>{project.locality} · Pune</small>
        <h2>{project.name}</h2>
        <p>{project.status} · {project.completionPercentage}% built</p>
        <strong>{project.priceFrom}</strong>
      </div>
    </Link>
  );
}
