"use client";

import { useMemo, useState } from "react";
import { sampleProjects, type Project, type ProjectType } from "@/data/projects";

const filters: Array<"All" | ProjectType> = ["All", "Residential", "Commercial", "Mixed Use"];

export default function Home() {
  const [active, setActive] = useState<"All" | ProjectType>("All");
  const [selectedId, setSelectedId] = useState(sampleProjects[0]?.id ?? "");

  const visibleProjects = useMemo(
    () => active === "All" ? sampleProjects : sampleProjects.filter((project) => project.type === active),
    [active]
  );

  const selected = sampleProjects.find((project) => project.id === selectedId) ?? visibleProjects[0];

  return (
    <main className="app-shell">
      <section className="map-frame" aria-label="BuildMap Pune development map">
        <div className="map-bg" />

        <div className="topbar">
          <div className="brand"><span className="brand-mark" />BuildMap</div>
          <div className="brand">Pune <span style={{ color: "#999" }}>⌄</span></div>
        </div>

        <label className="search">
          <span className="search-icon">⌕</span>
          <input aria-label="Search Pune" placeholder="Search Pune, locality or project" />
          <span className="search-icon">⌘ K</span>
        </label>

        <div className="filters" aria-label="Project type filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter ${active === filter ? "active" : ""}`}
              onClick={() => {
                setActive(filter);
                const next = filter === "All" ? sampleProjects[0] : sampleProjects.find((p) => p.type === filter);
                if (next) setSelectedId(next.id);
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <span className="map-label" style={{ left: "54%", top: "30%" }}>Pune</span>
        <span className="map-label" style={{ left: "71%", top: "57%" }}>Kharadi</span>
        <span className="map-label" style={{ left: "34%", top: "58%" }}>Wakad</span>
        <span className="map-label" style={{ left: "26%", top: "35%" }}>Baner</span>

        {visibleProjects.map((project, index) => (
          <button
            key={project.id}
            className={`marker ${project.id === selected?.id ? "" : "secondary"}`}
            style={{ left: `${30 + index * 22}%`, top: `${38 + (index % 2) * 21}%` }}
            onClick={() => setSelectedId(project.id)}
            aria-label={`Select ${project.name}`}
          >
            {project.completionPercentage}%
          </button>
        ))}

        <aside className="side-panel">
          <p className="eyebrow">Pune development map</p>
          <h1 className="hero-title">See what&apos;s being built around you.</h1>
          <p className="hero-copy">Explore residential, commercial and mixed-use developments across Pune — from the first foundation to completed spaces.</p>
          {selected && <ProjectCard project={selected} />}
        </aside>

        <div className="stats" aria-label="Map summary">
          <div className="stat"><strong>{visibleProjects.length}</strong><span>Projects shown</span></div>
          <div className="stat"><strong>3</strong><span>Development types</span></div>
        </div>
      </section>
    </main>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card">
      <div className="project-top">
        <div>
          <h2 className="project-name">{project.name}</h2>
          <p className="project-meta">{project.locality} · {project.type}</p>
        </div>
        <span className="status">{project.status}</span>
      </div>
      <div className="progress" aria-label={`${project.completionPercentage}% complete`}>
        <span style={{ width: `${project.completionPercentage}%` }} />
      </div>
      <div className="project-bottom">
        <span className="price">{project.priceFrom} — {project.priceTo}</span>
        <button className="view-link">View project →</button>
      </div>
    </div>
  );
}
