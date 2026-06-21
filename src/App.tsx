import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ParticleBackground } from './components/ParticleBackground';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { DetailPage } from './pages/DetailPage';
import { HabitatMapPage } from './pages/HabitatMapPage';
import { LabPage } from './pages/LabPage';
import { ArchivePage } from './pages/ArchivePage';
import { ArchiveDetailPage } from './pages/ArchiveDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen flex flex-col">
        <ParticleBackground />
        <Navbar />
        <main className="relative z-10 flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/microbe/:id" element={<DetailPage />} />
            <Route path="/habitat-map" element={<HabitatMapPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/archive/:id" element={<ArchiveDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
