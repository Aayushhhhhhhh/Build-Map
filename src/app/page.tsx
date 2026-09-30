"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import BuildMapMap from "@/components/BuildMapMap";
import { sampleProjects, type Project, type ProjectType } from "@/data/projects";

const typeFilters: Array<"All" | ProjectType> = ["All", "Residential", "Commercial", "Mixed Use"];
const statusFilters = ["All status", "Upcoming", "Under Construction", "Ready", "Completed"] as const;

export default function Home() {
  const [type, setType] = useState<"All" | ProjectType>("All");
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All status");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(sampleProjects[0]?.id ?? "");
  const [showProjects, setShowProjects] = useState(false);

  const visibleProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleProjects.filter((project) => {
      const matchesType = type === "All" || project.type === type;
      const matchesStatus = status === "All status" || project.status === status;
      const matchesQuery = !q || `${project.name} ${project.locality} ${project.reraNumber}`.toLowerCase().includes(q);
      return matchesType && matchesStatus && matchesQuery;
    });
  }, [query, status, type]);

  const selected = visibleProjects.find((p) => p.id === selectedId) ?? visibleProjects[0];

  return (
    <main className="buildmap-home">
      <BuildMapMap projects={visibleProjects} selectedId={selected?.id ?? ""} onSelect={setSelectedId} />

      <header className="home-header">
        <Link href="/" className="home-brand" aria-label="BuildMap home">
          <span className="home-brand-mark"><i /></span>
          <span>BuildMap</span>
        </Link>

        <nav className="desktop-nav">
          <a className="nav-active" href="#explore">Explore</a>
          <a href="#projects">Projects</a>
          <a href="#areas">Areas</a>
          <a href="#about">About</a>
        </nav>

        <div className="header-right">
          <button className="city-pill">Pune <span>⌄</span></button>
          <button className="header-icon" aria-label="Saved">♡</button>
          <button className="header-profile" aria-label="Profile">A</button>
        </div>
      </header>

      <section className="home-search-wrap" aria-label="Search">
        <div className="home-search">
          <span className="search-icon">⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects, areas or RERA number" />
          <kbd>⌘ K</kbd>
        </div>
      </section>

      <section className="filter-bar" aria-label="Filters">
        <div className="filter-group">
          {typeFilters.map((item) => (
            <button key={item} className={type === item ? "filter-chip active" : "filter-chip"} onClick={() => setType(item)}>
              {item}
            </button>
          ))}
        </div>
        <select className="status-select" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          {statusFilters.map((item) => <option key={item}>{item}</option>)}
        </select>
        <button className="more-filter" onClick={() => setShowProjects(!showProjects)}>☷ <span>Filters</span></button>
      </section>

      <div className="map-copy">
        <span>REAL ESTATE · PUNE</span>
        <h1>See where the city<br />is being built.</h1>
        <p>Explore developments, construction progress and properties available across Pune.</p>
      </div>

      <div className="map-controls">
        <button aria-label="Zoom in">+</button>
        <button aria-label="Zoom out">−</button>
        <button aria-label="Locate">⌖</button>
      </div>

      {showProjects && (
        <aside className="quick-filter-panel">
          <div><span>Explore Pune</span><button onClick={() => setShowProjects(false)}>×</button></div>
          <p>Filter the developments shown on the map.</p>
          <label><span>Project type</span><strong>{type}</strong></label>
          <label><span>Status</span><strong>{status}</strong></label>
          <small>{visibleProjects.length} matching developments</small>
        </aside>
      )}

      {selected && (
        <section className="map-project-card">
          <div className="card-accent" />
          <div className="card-top">
            <div>
              <span className="eyebrow">{selected.locality} · {selected.type}</span>
              <h2>{selected.name}</h2>
            </div>
            <span className="status-pill"><i />{selected.status}</span>
          </div>
          <div className="card-metrics">
            <div><small>CONSTRUCTION</small><strong>{selected.completionPercentage}%</strong></div>
            <div><small>COMPLETION</small><strong>{selected.expectedCompletion}</strong></div>
            <div><small>PRICE FROM</small><strong>{selected.priceFrom}</strong></div>
          </div>
          <div className="progress-track"><span style={{ width: `${selected.completionPercentage}%` }} /></div>
          <div className="card-footer">
            <span>RERA · {selected.reraNumber}</span>
            <Link href={`/projects/${selected.id}`}>View project <b>→</b></Link>
          </div>
        </section>
      )}

      <div className="map-count">{visibleProjects.length} developments on map</div>

      <nav className="mobile-bottom-nav">
        <a className="active" href="#explore"><span>⌖</span>Explore</a>
        <a href="#projects"><span>▤</span>Projects</a>
        <a href="#areas"><span>◫</span>Areas</a>
        <a href="#saved"><span>♡</span>Saved</a>
      </nav>
    </main>
  );
}
