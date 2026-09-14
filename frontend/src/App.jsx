import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AnalysisProvider } from './context/AnalysisContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import LearnerProfilePage from './pages/LearnerProfilePage';
import CareerSelectionPage from './pages/CareerSelectionPage';
import SkillGapAnalysisPage from './pages/SkillGapAnalysisPage';
import RoadmapPage from './pages/RoadmapPage';
import ProjectsPage from './pages/ProjectsPage';
import ProgressPage from './pages/ProgressPage';
import ResponsibleAIPage from './pages/ResponsibleAIPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'profile':
        return <LearnerProfilePage setActiveTab={setActiveTab} />;
      case 'career':
        return <CareerSelectionPage setActiveTab={setActiveTab} />;
      case 'analysis':
        return <SkillGapAnalysisPage setActiveTab={setActiveTab} />;
      case 'roadmap':
        return <RoadmapPage setActiveTab={setActiveTab} />;
      case 'projects':
        return <ProjectsPage setActiveTab={setActiveTab} />;
      case 'progress':
        return <ProgressPage setActiveTab={setActiveTab} />;
      case 'responsible-ai':
        return <ResponsibleAIPage />;
      case 'auth':
        return <AuthPage setActiveTab={setActiveTab} />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AuthProvider>
      <AnalysisProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="container" style={{ flex: 1, width: '100%' }}>
            {renderTabContent()}
          </main>

          <Footer setActiveTab={setActiveTab} />
        </div>
      </AnalysisProvider>
    </AuthProvider>
  );
}
