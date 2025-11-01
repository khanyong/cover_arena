import React, { useState } from 'react';
import RecordByGrade from './RecordByGrade';
import RecordByCategory from './RecordByCategory';
import ActivityAnalysis from './ActivityAnalysis';

/**
 * 생활기록부 전체 요약 컴포넌트
 */
const RecordOverview = ({ studentRecord }) => {
  const [viewMode, setViewMode] = useState('grade'); // grade, category, analysis

  return (
    <div className="record-overview">
      <div className="record-header">
        <h2>생활기록부 분석</h2>
        <p className="subtitle">
          {studentRecord.studentInfo.name} - {studentRecord.studentInfo.school}
        </p>
      </div>

      {/* 뷰 모드 선택 */}
      <div className="view-mode-selector">
        <button
          className={`mode-btn ${viewMode === 'grade' ? 'active' : ''}`}
          onClick={() => setViewMode('grade')}
        >
          📅 학년별 보기
        </button>
        <button
          className={`mode-btn ${viewMode === 'category' ? 'active' : ''}`}
          onClick={() => setViewMode('category')}
        >
          📂 카테고리별 보기
        </button>
        <button
          className={`mode-btn ${viewMode === 'analysis' ? 'active' : ''}`}
          onClick={() => setViewMode('analysis')}
        >
          📊 활동 분석
        </button>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="record-content">
        {viewMode === 'grade' && (
          <RecordByGrade />
        )}
        {viewMode === 'category' && (
          <RecordByCategory records={studentRecord.records} />
        )}
        {viewMode === 'analysis' && (
          <ActivityAnalysis
            records={studentRecord.records}
            studentInfo={studentRecord.studentInfo}
            specialNotes={studentRecord.specialNotes}
          />
        )}
      </div>

      {/* 특기사항 */}
      {studentRecord.specialNotes && (
        <div className="special-notes">
          <h3>📌 종합 특기사항</h3>
          <ul>
            {studentRecord.specialNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecordOverview;
