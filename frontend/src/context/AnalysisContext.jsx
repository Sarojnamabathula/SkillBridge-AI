import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCareers, analyzeSkills, updateProgress, checkHealth } from '../services/api';

const AnalysisContext = createContext();

export function AnalysisProvider({ children }) {
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [learnerProfile, setLearnerProfile] = useState({
    education_level: 'B.Tech Computer Science',
    field_of_study: 'Computer Science',
    experience_level: 'BEGINNER',
    current_skills: [
      { name: 'Python', proficiency: 'INTERMEDIATE' },
      { name: 'Basic SQL', proficiency: 'BEGINNER' },
      { name: 'HTML', proficiency: 'BEGINNER' },
      { name: 'CSS', proficiency: 'BEGINNER' }
    ],
    free_text_background: '',
    career_goal: 'data_analyst',
    available_learning_time: 6
  });

  const [analysisResult, setAnalysisResult] = useState(() => {
    const saved = localStorage.getItem('skillbridge_analysis_result');
    return saved ? JSON.parse(saved) : null;
  });

  const [skillStatuses, setSkillStatuses] = useState(() => {
    const saved = localStorage.getItem('skillbridge_skill_statuses');
    return saved ? JSON.parse(saved) : {};
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendHealth, setBackendHealth] = useState({ status: 'checking' });

  // Load careers catalog on mount
  useEffect(() => {
    loadCareers();
    checkBackendStatus();
  }, []);

  // Save results to localStorage
  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('skillbridge_analysis_result', JSON.stringify(analysisResult));
    }
  }, [analysisResult]);

  useEffect(() => {
    localStorage.setItem('skillbridge_skill_statuses', JSON.stringify(skillStatuses));
  }, [skillStatuses]);

  const checkBackendStatus = async () => {
    const health = await checkHealth();
    setBackendHealth(health);
  };

  const loadCareers = async () => {
    try {
      const data = await fetchCareers();
      setCareers(data);
      if (data.length > 0 && !selectedCareer) {
        setSelectedCareer(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const runAnalysis = async (profileOverride = null) => {
    setLoading(true);
    setError(null);
    try {
      const payload = profileOverride || learnerProfile;
      const result = await analyzeSkills(payload);
      setAnalysisResult(result);
      // Reset statuses for new session
      const initialStatuses = {};
      result.missing_skills.forEach(s => { initialStatuses[s.skill_name] = 'NOT_STARTED'; });
      result.needs_improvement_skills.forEach(s => { initialStatuses[s.skill_name] = 'NOT_STARTED'; });
      result.existing_skills.forEach(s => { initialStatuses[s.skill_name] = 'COMPLETED'; });
      setSkillStatuses(initialStatuses);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
      setLoading(false);
      throw err;
    }
  };

  const updateSkillProgress = async (skillName, newStatus) => {
    const updated = { ...skillStatuses, [skillName]: newStatus };
    setSkillStatuses(updated);

    if (analysisResult && analysisResult.analysis_id) {
      try {
        const response = await updateProgress(analysisResult.analysis_id, updated);
        if (response && response.updated_roadmap) {
          setAnalysisResult(prev => ({
            ...prev,
            roadmap: response.updated_roadmap
          }));
        }
      } catch (e) {
        console.warn('Progress update sync error:', e);
      }
    }
  };

  const resetSession = () => {
    setAnalysisResult(null);
    setSkillStatuses({});
    localStorage.removeItem('skillbridge_analysis_result');
    localStorage.removeItem('skillbridge_skill_statuses');
  };

  return (
    <AnalysisContext.Provider value={{
      careers,
      selectedCareer,
      setSelectedCareer,
      learnerProfile,
      setLearnerProfile,
      analysisResult,
      setAnalysisResult,
      skillStatuses,
      updateSkillProgress,
      loading,
      error,
      backendHealth,
      runAnalysis,
      resetSession
    }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
