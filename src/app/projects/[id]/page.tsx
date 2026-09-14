import Link from "next/link";
import { notFound } from "next/navigation";
import { sampleProjects } from "@/data/projects";

export function generateStaticParams() {
  return sampleProjects.map((project) => ({ id: project.id }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = sampleProjects.find((item) => item.id === id);

  if (!project) notFound();

  const timeline = [
    { label: "Planning", complete: true },
    { label: "Foundation", complete: project.completionPercentage >= 20 },
    { label: "Structure", complete: project.completionPercentage >= 50 },
    { label: "Exterior", complete: project.completionPercentage >= 75 },
    { label: "Interiors", complete: project.completionPercentage >= 90 },
    { label: "Possession", complete: project.completionPercentage === 100 },
  ];

  return (
    <main className="detail-shell">
      <header className="detail-nav">
        <Link href="/" className="back-link">← Back to map</Link>
        <div className="brand"><span className="brand-mark" />BuildMap</div>
        <span className="demo-badge">DEMO PROJECT</span>
      </header>

      <section className="detail-hero">
        <div>
          <p className="eyebrow">{project.locality} · Pune</p>
          <h1>{project.name}</h1>
          <p className="detail-lede">{project.description}</p>
          <div className="tag-row">
            <span>{project.type}</span>
            <span>{project.status}</span>
            <span>RERA: {project.reraNumber}</span>
          </div>
        </div>
        <div className="completion-card">
          <span>Construction progress</span>
          <strong>{project.completionPercentage}%</strong>
          <div className="progress large"><span style={{ width: `${project.completionPercentage}%` }} /></div>
          <small>Expected completion · {project.expectedCompletion}</small>
        </div>
      </section>

      <section className="detail-grid">
        <div className="detail-main">
          <div className="section-heading"><div><p className="eyebrow">Development timeline</p><h2>From foundation to possession</h2></div></div>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div className={`timeline-item ${item.complete ? "complete" : ""}`} key={item.label}>
                <div className="timeline-dot">{item.complete ? "✓" : index + 1}</div>
                <div><strong>{item.label}</strong><span>{item.complete ? "Completed" : "Upcoming"}</span></div>
              </div>
            ))}
          </div>

          <div className="inventory-section">
            <div className="section-heading"><div><p className="eyebrow">Availability</p><h2>Example inventory</h2></div><span className="muted">Demo data</span></div>
            <div className="inventory-table">
              <div className="inventory-row inventory-head"><span>Unit</span><span>Area</span><span>Floor</span><span>Price</span></div>
              <div className="inventory-row"><span>2 BHK</span><span>1,180 sq ft</span><span>12</span><strong>₹1.39 Cr</strong></div>
              <div className="inventory-row"><span>3 BHK</span><span>1,650 sq ft</span><span>18</span><strong>₹1.95 Cr</strong></div>
              <div className="inventory-row"><span>4 BHK</span><span>2,420 sq ft</span><span>24</span><strong>₹3.37 Cr</strong></div>
            </div>
          </div>
        </div>

        <aside className="detail-aside">
          <div className="info-card">
            <p className="eyebrow">Project information</p>
            <dl>
              <div><dt>Developer</dt><dd>{project.developer}</dd></div>
              <div><dt>Project type</dt><dd>{project.type}</dd></div>
              <div><dt>Location</dt><dd>{project.locality}, Pune</dd></div>
              <div><dt>RERA number</dt><dd>{project.reraNumber}</dd></div>
              <div><dt>Price range</dt><dd>{project.priceFrom} — {project.priceTo}</dd></div>
            </dl>
            <button className="primary-action">Register interest</button>
            <p className="disclaimer">Demo interface only. Prices, inventory and project details are placeholders until verified data is connected.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
