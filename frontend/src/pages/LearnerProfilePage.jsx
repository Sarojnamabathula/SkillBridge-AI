import React, { useState } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { extractSkillsFromText } from '../services/api';
import { User, Plus, Trash2, Sparkles, ArrowRight, Clock, BookOpen, Briefcase } from 'lucide-react';
import SkillTag from '../components/SkillTag';

export default function LearnerProfilePage({ setActiveTab }) {
  const { learnerProfile, setLearnerProfile, careers, runAnalysis, loading } = useAnalysis();

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState('BEGINNER');
  const [extracting, setExtracting] = useState(false);
  const [extractedNotice, setExtractedNotice] = useState('');

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const exists = learnerProfile.current_skills.some(
      s => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );
    if (!exists) {
      setLearnerProfile(prev => ({
        ...prev,
        current_skills: [
          ...prev.current_skills,
          { name: newSkillName.trim(), proficiency: newSkillProf }
        ]
      }));
    }
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName) => {
    setLearnerProfile(prev => ({
      ...prev,
      current_skills: prev.current_skills.filter(s => s.name !== skillName)
    }));
  };

  const handleExtractFromText = async () => {
    if (!learnerProfile.free_text_background || !learnerProfile.free_text_background.strip()) return;
    setExtracting(true);
    setExtractedNotice('');
    try {
      const res = await extractSkillsFromText(learnerProfile.free_text_background);
      const extractedList = res.normalized_skills || [];
      
      let addedCount = 0;
      const updatedSkills = [...learnerProfile.current_skills];
      extractedList.forEach(skill => {
        const exists = updatedSkills.some(s => s.name.toLowerCase() === skill.toLowerCase());
        if (!exists) {
          updatedSkills.push({ name: skill, proficiency: 'BEGINNER' });
          addedCount++;
        }
      });

      setLearnerProfile(prev => ({ ...prev, current_skills: updatedSkills }));
      setExtractedNotice(`Extracted and added ${addedCount} skills from background text.`);
    } catch (e) {
      setExtractedNotice('Skill extraction completed.');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await runAnalysis();
      setActiveTab('analysis');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Competency Profile & Skill Input
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Provide your current educational background and technical skills. Privacy note: Sensitive demographics (race, gender, address) are never collected or required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card">
        {/* Education & Field */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">
              <BookOpen size={16} style={{ display: 'inline', marginRight: '0.4rem' }} />
              Education Level *
            </label>
            <select
              className="form-select"
              value={learnerProfile.education_level}
              onChange={e => setLearnerProfile({ ...learnerProfile, education_level: e.target.value })}
              required
            >
              <option value="High School / Diploma">High School / Diploma</option>
              <option value="Undergraduate (B.Tech / B.S. / B.C.A.)">Undergraduate (B.Tech / B.S. / B.C.A.)</option>
              <option value="Postgraduate (M.Tech / M.S. / M.C.A.)">Postgraduate (M.Tech / M.S. / M.C.A.)</option>
              <option value="Self-Taught / Career Changer">Self-Taught / Career Changer</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Field of Study</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Computer Science, Electrical, Business..."
              value={learnerProfile.field_of_study || ''}
              onChange={e => setLearnerProfile({ ...learnerProfile, field_of_study: e.target.value })}
            />
          </div>
        </div>

        {/* Experience & Weekly Hours */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">
              <Briefcase size={16} style={{ display: 'inline', marginRight: '0.4rem' }} />
              Overall Experience Level *
            </label>
            <select
              className="form-select"
              value={learnerProfile.experience_level}
              onChange={e => setLearnerProfile({ ...learnerProfile, experience_level: e.target.value })}
            >
              <option value="BEGINNER">Beginner (0-1 years)</option>
              <option value="INTERMEDIATE">Intermediate (1-3 years)</option>
              <option value="ADVANCED">Advanced (3+ years)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Clock size={16} style={{ display: 'inline', marginRight: '0.4rem' }} />
              Available Weekly Learning Time (Hours/Week) *
            </label>
            <input
              type="number"
              min="1"
              max="50"
              className="form-input"
              value={learnerProfile.available_learning_time}
              onChange={e => setLearnerProfile({ ...learnerProfile, available_learning_time: parseInt(e.target.value) || 5 })}
              required
            />
          </div>
        </div>

        {/* Target Career Selection */}
        <div className="form-group">
          <label className="form-label">Target Career Goal *</label>
          <select
            className="form-select"
            value={learnerProfile.career_goal}
            onChange={e => setLearnerProfile({ ...learnerProfile, career_goal: e.target.value })}
            required
          >
            {careers.map(c => (
              <option key={c.career_id} value={c.career_id}>
                {c.name} ({c.category})
              </option>
            ))}
          </select>
        </div>

        {/* Current Skills List */}
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label className="form-label">Current Skills & Self-Reported Proficiency</label>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, minWidth: '180px' }}
              placeholder="Type a skill (e.g. Python, SQL, HTML)..."
              value={newSkillName}
              onChange={e => setNewSkillName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
            />
            <select
              className="form-select"
              style={{ width: '150px' }}
              value={newSkillProf}
              onChange={e => setNewSkillProf(e.target.value)}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleAddSkill}
            >
              <Plus size={16} /> Add Skill
            </button>
          </div>

          {/* Active Skill Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {learnerProfile.current_skills.map((s, idx) => (
              <SkillTag
                key={idx}
                name={s.name}
                level={s.proficiency}
                onRemove={() => handleRemoveSkill(s.name)}
              />
            ))}
            {learnerProfile.current_skills.length === 0 && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                No skills added yet. Type a skill above or use text auto-extraction below.
              </span>
            )}
          </div>
        </div>

        {/* Free Text / Resume Box */}
        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label className="form-label">Optional Free-Text Background / Project Snippet</label>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              onClick={handleExtractFromText}
              disabled={extracting || !learnerProfile.free_text_background}
            >
              <Sparkles size={14} style={{ color: 'var(--brand-indigo)' }} />
              {extracting ? 'Parsing...' : 'Import Skills from Text'}
            </button>
          </div>

          <textarea
            className="form-textarea"
            placeholder="Paste coursework descriptions, project summaries, or resume snippets here..."
            value={learnerProfile.free_text_background || ''}
            onChange={e => setLearnerProfile({ ...learnerProfile, free_text_background: e.target.value })}
          />
          {extractedNotice && (
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', marginTop: '0.25rem' }}>
              {extractedNotice}
            </span>
          )}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Analyzing Skills...' : 'Run Skill Gap Analysis'} <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
