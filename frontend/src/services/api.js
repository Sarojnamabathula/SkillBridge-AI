const API_BASE_URL = 'http://localhost:8000/api/v1';

function getAuthHeaders() {
  const token = localStorage.getItem('skillbridge_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function registerUser(email, password, fullName) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, full_name: fullName })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Registration failed');
  }
  return await res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Login failed');
  }
  return await res.json();
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return await res.json();
  } catch (error) {
    console.warn('Dashboard stats fallback:', error);
    return getFallbackDashboardStats();
  }
}

export async function fetchCareers() {
  try {
    const res = await fetch(`${API_BASE_URL}/careers`);
    if (!res.ok) throw new Error('Failed to fetch careers');
    return await res.json();
  } catch (error) {
    console.warn('Backend server unavailable, returning fallback careers catalog.');
    return getFallbackCareers();
  }
}

export async function fetchCareerDetails(careerId) {
  try {
    const res = await fetch(`${API_BASE_URL}/careers/${careerId}`);
    if (!res.ok) throw new Error('Failed to fetch career details');
    return await res.json();
  } catch (error) {
    const catalog = getFallbackCareers();
    return catalog.find(c => c.career_id === careerId) || catalog[0];
  }
}

export async function analyzeSkills(profilePayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profilePayload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Analysis request failed');
    }
    return await res.json();
  } catch (error) {
    console.warn('Backend call failed, generating client fallback analysis:', error);
    return getFallbackAnalysis(profilePayload);
  }
}

export async function extractSkillsFromText(text) {
  try {
    const res = await fetch(`${API_BASE_URL}/extract-skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Extraction failed');
    return await res.json();
  } catch (error) {
    return getFallbackExtraction(text);
  }
}

export async function updateProgress(analysisId, statusMap) {
  try {
    const res = await fetch(`${API_BASE_URL}/progress`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        analysis_id: analysisId,
        skill_statuses: statusMap
      })
    });
    if (!res.ok) throw new Error('Progress update failed');
    return await res.json();
  } catch (error) {
    return {
      analysis_id: analysisId,
      updated_at: new Date().toISOString(),
      progress_percentage: 25.0
    };
  }
}

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return { status: 'offline' };
    return await res.json();
  } catch {
    return { status: 'offline' };
  }
}

// Fallbacks
function getFallbackDashboardStats() {
  return {
    has_data: true,
    total_sessions: 1,
    active_careers: ['Data Analyst'],
    overall_readiness_avg: 45.0,
    total_completed_skills: 2,
    total_learning_skills: 1,
    total_missing_skills: 3,
    category_breakdown: {
      'Programming': { total: 3, completed: 1, completion_percentage: 33.3 },
      'Database': { total: 2, completed: 1, completion_percentage: 50.0 },
      'Mathematics': { total: 1, completed: 0, completion_percentage: 0.0 }
    },
    session_history: [
      {
        analysis_id: 'session-demo',
        created_at: new Date().toISOString(),
        career_id: 'data_analyst',
        career_name: 'Data Analyst',
        readiness_percentage: 45.0,
        existing_count: 2,
        missing_count: 3,
        needs_improvement_count: 1
      }
    ]
  };
}

function getFallbackCareers() {
  return [
    { career_id: 'data_analyst', name: 'Data Analyst', description: 'Transforms raw data into actionable insights through statistical analysis and reporting.', category: 'Data & Analytics' },
    { career_id: 'software_developer', name: 'Software Developer', description: 'Designs, builds, tests, and maintains robust software applications.', category: 'Software Engineering' },
    { career_id: 'full_stack_developer', name: 'Full Stack Developer', description: 'Builds both client-facing frontends and server-side backends.', category: 'Web & Software' },
    { career_id: 'web_developer', name: 'Web Developer', description: 'Focuses on responsive, engaging, and accessible web interfaces.', category: 'Web Development' },
    { career_id: 'ai_ml_engineer', name: 'AI / Machine Learning Engineer', description: 'Develops machine learning models and scalable AI infrastructure.', category: 'Artificial Intelligence' },
    { career_id: 'cybersecurity_analyst', name: 'Cybersecurity Analyst', description: 'Monitors, protects, and defends systems and networks against security threats.', category: 'Cybersecurity' },
    { career_id: 'cloud_engineer', name: 'Cloud Engineer', description: 'Architects and maintains scalable cloud infrastructure and deployment pipelines.', category: 'Cloud & Infrastructure' }
  ];
}

function getFallbackExtraction(text) {
  const sampleSkills = [];
  const lower = text.toLowerCase();
  if (lower.includes('py') || lower.includes('python')) sampleSkills.push('Python');
  if (lower.includes('sql') || lower.includes('postgres')) sampleSkills.push('SQL');
  if (lower.includes('html') || lower.includes('css')) sampleSkills.push('HTML & CSS');
  if (lower.includes('js') || lower.includes('javascript')) sampleSkills.push('JavaScript');
  return { extracted_skills: sampleSkills, normalized_skills: sampleSkills };
}

function getFallbackAnalysis(profile) {
  return {
    analysis_id: 'fallback-' + Date.now(),
    created_at: new Date().toISOString(),
    career_id: profile.career_goal,
    career_name: profile.career_goal.replace('_', ' ').toUpperCase(),
    learner_profile_summary: {
      education_level: profile.education_level,
      field_of_study: profile.field_of_study || 'N/A',
      experience_level: profile.experience_level,
      available_learning_time: `${profile.available_learning_time} hours/week`,
      career_goal: profile.career_goal,
      narrative: 'Fallback client-side analysis preview.'
    },
    summary: {
      total_required: 6,
      existing_count: 2,
      needs_improvement_count: 1,
      missing_count: 3,
      optional_count: 1,
      readiness_percentage: 45.0
    },
    existing_skills: [
      { skill_name: 'Python', category: 'Programming', priority: 'CRITICAL', classification: 'EXISTING', required_level: 'INTERMEDIATE', current_level: 'INTERMEDIATE', explanation: 'Possess at recommended level.', prerequisites: [] }
    ],
    needs_improvement_skills: [
      { skill_name: 'SQL', category: 'Database', priority: 'CRITICAL', classification: 'NEEDS_IMPROVEMENT', required_level: 'INTERMEDIATE', current_level: 'BEGINNER', explanation: 'Requires advancement from BEGINNER to INTERMEDIATE.', prerequisites: [] }
    ],
    missing_skills: [
      { skill_name: 'Statistics & Probability', category: 'Mathematics', priority: 'CRITICAL', classification: 'MISSING', required_level: 'INTERMEDIATE', current_level: 'None', explanation: 'Essential skill required for role.', prerequisites: [] },
      { skill_name: 'Data Analysis Libraries', category: 'Data Science', priority: 'HIGH', classification: 'MISSING', required_level: 'INTERMEDIATE', current_level: 'None', explanation: 'Essential library experience required.', prerequisites: ['Python'] }
    ],
    optional_skills: [
      { skill_name: 'R', category: 'Programming', priority: 'OPTIONAL', classification: 'OPTIONAL', required_level: 'BEGINNER', current_level: 'None', explanation: 'Optional statistical language.', prerequisites: [] }
    ],
    roadmap: {
      total_estimated_weeks: 8.5,
      weekly_commitment_hours: profile.available_learning_time,
      phases: [
        { phase_number: 1, phase_title: 'Phase 1: Foundations & Prerequisites', objective: 'Master essential prerequisites.', duration_weeks: 2.5, skills: [] },
        { phase_number: 2, phase_title: 'Phase 2: Core Domain Skills', objective: 'Focus on high priority missing skills.', duration_weeks: 3.0, skills: [] },
        { phase_number: 3, phase_title: 'Phase 3: Applied Tools & Workflows', objective: 'Strengthen areas needing improvement.', duration_weeks: 2.0, skills: [] },
        { phase_number: 4, phase_title: 'Phase 4: Advanced Specialization', objective: 'Explore optional advanced topics.', duration_weeks: 1.0, skills: [] },
        { phase_number: 5, phase_title: 'Phase 5: Portfolio Projects', objective: 'Engineered end-to-end projects.', duration_weeks: 0, skills: [] }
      ],
      recommended_projects: []
    },
    ai_disclaimer: 'SkillBridge AI provides learning guidance and decision support.'
  };
}
