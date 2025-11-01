import React from 'react';
import { interviewTips } from '../Data/universityData';

/**
 * 대학별 면접 정보 프로필 컴포넌트
 */
const UniversityProfile = ({ university }) => {
  const tips = interviewTips.byUniversity[university.name] || [];

  return (
    <div className="university-profile">
      <div className="profile-header">
        <div className="university-name-section">
          <h3>{university.name}</h3>
          <p className="department-name">{university.department}</p>
        </div>
      </div>

      <div className="profile-content">
        {/* 기본 정보 */}
        <div className="profile-section">
          <h4>📋 면접 기본 정보</h4>
          <div className="info-grid">
            <div className="info-item">
              <label>면접 형식</label>
              <span>{university.type}</span>
            </div>
            <div className="info-item">
              <label>면접 시간</label>
              <span>{university.duration}분</span>
            </div>
            <div className="info-item">
              <label>평가 항목</label>
              <span>{university.evaluationCriteria.length}개</span>
            </div>
          </div>
        </div>

        {/* 면접 질문 예시 */}
        {university.interviewQuestions && university.interviewQuestions.length > 0 && (
          <div className="profile-section">
            <h4>💬 기출 면접 질문 예시</h4>
            <ul className="interview-questions-list">
              {university.interviewQuestions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 대학별 면접 팁 */}
        {tips.length > 0 && (
          <div className="profile-section">
            <h4>💡 {university.name} 면접 준비 팁</h4>
            <ul className="tips-list">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 일반 면접 팁 */}
        <div className="profile-section">
          <h4>📝 일반 면접 준비 팁</h4>
          <ul className="tips-list">
            {interviewTips.general.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfile;
