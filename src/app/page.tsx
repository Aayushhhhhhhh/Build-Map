"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import BuildMapMap from "@/components/BuildMapMap";
import { sampleProjects, type Project, type ProjectType } from "@/data/projects";

const filters: Array<"All" | ProjectType> = ["All", "Residential", "Commercial", "Mixed Use"];

export default function Home() {
  const [active, setActive] = useState<"All" | ProjectType>("All");
  const [selectedId, setSelectedId] = useState(sampleProjects[0]?.id ?? "");
  const [showList, setShowList] = useState(false);
  const [query, setQuery] = useState("");

  const visibleProjects = useMemo(() => {
    const filtered = active === "All" ? sampleProjects : sampleProjects.filter((project) => project.type === active);
    const normalized = query.trim().toLowerCase();
    if (!normalized) return filtered;
    return filtered.filter((project) => `${project.name} ${project.locality} ${project.reraNumber}`.toLowerCase().includes(normalized));
  }, [active, query]);

  const selected = sampleProjects.find((project) => project.id === selectedId) ?? visibleProjects[0];
  const selectProject = useCallback((id: string) => setSelectedId(id), []);

  return (
    <main className="map-app">
      <section className="map-screen" aria-label="BuildMap Pune development map">
        <BuildMapMap projects={visibleProjects} selectedId={selected?.id ?? ""} onSelect={selectProject} />
        <div className="map-vignette" />

        <header className="map-header">
          <div className="map-brand"><span className="brand-mark" />BuildMap</div>
          <button className="city-switcher">Pune <span>⌄</span></button>
          <div className="header-actions">
            <button className="circle-action" aria-label="Saved projects">♡</button>
            <button className="circle-action" aria-label="Notifications">♧</button>
          </div>
        </header>

        <div className="map-search-row">
          <label className="map-search">
            <span>⌕</span>
            <input aria-label="Search Pune" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, areas or RERA" />
          </label>
          <button className="filter-button" aria-label="Open filters">☷</button>
        </div>

        <div className="map-chips" aria-label="Project filters">
          {filters.map((filter) => (
            <button key={filter} className={`map-chip ${active === filter ? "active" : ""}`} onClick={() => {
              setActive(filter);
              const next = filter === "All" ? sampleProjects[0] : sampleProjects.find((p) => p.type === filter);
              if (next) setSelectedId(next.id);
            }}>{filter}</button>
          ))}
        </div>

        <div className="explore-prompt">⌖ &nbsp; Zoom in to explore Pune</div>

        <div className={`project-sheet ${showList ? "expanded" : ""}`}>
          <div className="sheet-handle" />
          <div className="sheet-heading">
            <div><span className="sheet-kicker">Pune · Development map</span><h1>{visibleProjects.length} developments</h1></div>
            <button className="list-toggle" onClick={() => setShowList(!showList)}>{showList ? "Map" : "See list"}</button>
          </div>

          {selected && <ProjectPreview project={selected} />}

          {showList && <div className="project-list">
            {visibleProjects.map((project) => (
              <button className={`list-item ${project.id === selected?.id ? "current" : ""}`} key={project.id} onClick={() => setSelectedId(project.id)}>
                <span className="list-dot" />
                <span><strong>{project.name}</strong><small>{project.locality} · {project.type} · {project.completionPercentage}% built</small></span>
                <b>›</b>
              </button>
            ))}
          </div>}
        </div>

        <nav className="bottom-nav" aria-label="Primary navigation">
          <button className="nav-item active"><span>▥</span><small>Explore</small></button>
          <button className="nav-item"><span>⌁</span><small>Projects</small></button>
          <button className="nav-item"><span>◌</span><small>Saved</small></button>
          <button className="nav-item"><span>◉</span><small>Profile</small></button>
        </nav>
      </section>
    </main>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  return <div className="preview-card">
    <div className="preview-icon">{project.type === "Commercial" ? "▦" : project.type === "Mixed Use" ? "⌂" : "▥"}</div>
    <div className="preview-content">
      <div className="preview-topline"><span>{project.locality}</span><em>{project.completionPercentage}% built</em></div>
      <h2>{project.name}</h2>
      <p>{project.type} · {project.status}</p>
      <div className="preview-bottom"><strong>{project.priceFrom} — {project.priceTo}</strong><Link href={`/projects/${project.id}`}>View project <span>→</span></Link></div>
    </div>
  </div>;
}
