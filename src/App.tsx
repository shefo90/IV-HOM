/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import FooterSection from "./components/FooterSection";
import ProposalModal from "./components/ProposalModal";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProcessPage from "./pages/ProcessPage";
import ProductsPage from "./pages/ProductsPage";
import FactoryPage from "./pages/FactoryPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import ThankYouPage from "./pages/ThankYouPage";

// Code-split: the admin is a few hundred KB of forms and a media library that
// a site visitor must never download.
const AdminApp = lazy(() => import("./admin/AdminApp"));

export default function App() {
  const [proposalOpen, setProposalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  // The nav highlight follows the route only. On the six converted pages
  // that's the route itself; on the home page nothing should highlight —
  // "hero" is a sentinel that never matches any nav item's route slice
  // (mirroring the pre-project behaviour, where the comparison never matched
  // its own default state either).
  const active = isHome ? "hero" : location.pathname.slice(1);

  // The originals were full page loads and always started at the top;
  // BrowserRouter doesn't restore scroll on its own, so do it explicitly on
  // every route change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const openProposal = useCallback(() => {
    if (isHome) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/contact");
    }
  }, [isHome, navigate]);

  // The admin has its own chrome, so it replaces the page rather than
  // rendering inside the site's header and footer. Every hook above runs
  // first, so this early return does not change the hook order.
  if (location.pathname.startsWith("/admin")) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-brand-dark" />}>
        <AdminApp />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark selection:bg-brand-accent selection:text-brand-dark overflow-x-hidden">
      <Header onOpenProposal={openProposal} activeSection={active} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/factory" element={<FactoryPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

      <FooterSection />

      <ProposalModal
        isOpen={proposalOpen}
        onClose={() => setProposalOpen(false)}
        initialType="proposal"
      />
    </div>
  );
}
