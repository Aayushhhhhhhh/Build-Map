export type ProjectType = "Residential" | "Commercial" | "Mixed Use";
export type ProjectStatus = "Upcoming" | "Under Construction" | "Ready" | "Completed";

export type Project = {
  id: string;
  name: string;
  locality: string;
  city: string;
  type: ProjectType;
  status: ProjectStatus;
  completionPercentage: number;
  expectedCompletion: string;
  priceFrom: string;
  priceTo: string;
  developer: string;
  reraNumber: string;
  latitude: number;
  longitude: number;
  description: string;
};

// Demo records only. These are not real listings.
export const sampleProjects: Project[] = [
  { id: "baner-001", name: "Baner Heights", locality: "Baner", city: "Pune", type: "Residential", status: "Under Construction", completionPercentage: 68, expectedCompletion: "Dec 2027", priceFrom: "₹1.39 Cr", priceTo: "₹3.37 Cr", developer: "Sample Developer", reraNumber: "DEMO-001", latitude: 18.559, longitude: 73.7868, description: "Demo residential project for the BuildMap interface." },
  { id: "wakad-001", name: "Wakad Business Hub", locality: "Wakad", city: "Pune", type: "Commercial", status: "Under Construction", completionPercentage: 82, expectedCompletion: "Jun 2027", priceFrom: "₹65 L", priceTo: "₹2.10 Cr", developer: "Sample Developer", reraNumber: "DEMO-002", latitude: 18.5996, longitude: 73.7631, description: "Demo commercial development with shops and offices." },
  { id: "kharadi-001", name: "Kharadi Central", locality: "Kharadi", city: "Pune", type: "Mixed Use", status: "Completed", completionPercentage: 100, expectedCompletion: "Ready", priceFrom: "₹55 L", priceTo: "₹2.80 Cr", developer: "Sample Developer", reraNumber: "DEMO-003", latitude: 18.5536, longitude: 73.947, description: "Demo completed mixed-use development." }
];
