import React, { useState } from 'react';
import parsedStudentRecord from '../Data/parsedStudentRecord';

/**
 * 교과학습발달상황 컴포넌트
 * 학년별 성적 및 세부능력 및 특기사항 표시
 */
const SubjectPerformance = () => {
  const [activeGradeTab, setActiveGradeTab] = useState(1);

  return (
    <div className="subject-performance-container">
      {/* 헤더 */}
      <div className="table-header">
        <h2 className="table-title">교과학습발달상황</h2>
        <p className="table-subtitle">학년별 교과 성적 및 세부능력 특기사항</p>
      </div>

      {/* 학년 탭 */}
      <div className="grade-tabs">
        <button
          className={`grade-tab-btn ${activeGradeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveGradeTab(1)}
        >
          1학년
        </button>
        <button
          className={`grade-tab-btn ${activeGradeTab === 2 ? 'active' : ''}`}
          onClick={() => setActiveGradeTab(2)}
        >
          2학년
        </button>
        <button
          className={`grade-tab-btn ${activeGradeTab === 3 ? 'active' : ''}`}
          onClick={() => setActiveGradeTab(3)}
        >
          3학년
        </button>
      </div>

      {/* 교과학습발달상황 */}
      <div className="info-card full-width">
        {/* 1학년 */}
        {activeGradeTab === 1 && (
          <div className="subject-performance-section">
            <h4>[1학년]</h4>
          <div className="subject-table-wrapper">
            <table className="subject-performance-table">
              <thead>
                <tr>
                  <th>학기</th>
                  <th>교과</th>
                  <th>과목</th>
                  <th>학점수</th>
                  <th>원점수/과목평균(표준편차)</th>
                  <th>성취도(수강자수)</th>
                  <th>석차등급</th>
                </tr>
              </thead>
              <tbody>
                {parsedStudentRecord.subjectPerformance.grade1.map((subject, idx) => (
                  <tr key={idx}>
                    <td>{subject.학기}</td>
                    <td>{subject.교과}</td>
                    <td>{subject.과목}</td>
                    <td>{subject.학점수}</td>
                    <td>{subject.원점수과목평균표준편차}</td>
                    <td>{subject.성취도수강자수}</td>
                    <td>{subject.석차등급}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 세부능력 및 특기사항 */}
          <div className="subject-details-section">
            <h5>세부능력 및 특기사항</h5>
            {Object.entries(parsedStudentRecord.subjectDetails.grade1).map(([subject, detail]) => (
              <div key={subject} className="subject-detail-item">
                <div className="subject-detail-title">{subject}:</div>
                <div className="subject-detail-content">{detail}</div>
              </div>
            ))}
          </div>
          </div>
        )}

        {/* 2학년 */}
        {activeGradeTab === 2 && parsedStudentRecord.subjectPerformance.grade2.length > 0 && (
          <div className="subject-performance-section">
            <h4>[2학년]</h4>
            <div className="subject-table-wrapper">
              <table className="subject-performance-table">
                <thead>
                  <tr>
                    <th>학기</th>
                    <th>교과</th>
                    <th>과목</th>
                    <th>학점수</th>
                    <th>원점수/과목평균(표준편차)</th>
                    <th>성취도(수강자수)</th>
                    <th>석차등급</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedStudentRecord.subjectPerformance.grade2.map((subject, idx) => (
                    <tr key={idx}>
                      <td>{subject.학기}</td>
                      <td>{subject.교과}</td>
                      <td>{subject.과목}</td>
                      <td>{subject.학점수}</td>
                      <td>{subject.원점수과목평균표준편차}</td>
                      <td>{subject.성취도수강자수}</td>
                      <td>{subject.석차등급}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 세부능력 및 특기사항 */}
            {Object.keys(parsedStudentRecord.subjectDetails.grade2).length > 0 && (
              <div className="subject-details-section">
                <h5>세부능력 및 특기사항</h5>
                {Object.entries(parsedStudentRecord.subjectDetails.grade2).map(([subject, detail]) => (
                  <div key={subject} className="subject-detail-item">
                    <div className="subject-detail-title">{subject}:</div>
                    <div className="subject-detail-content">{detail}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3학년 */}
        {activeGradeTab === 3 && parsedStudentRecord.subjectPerformance.grade3.length > 0 && (
          <div className="subject-performance-section">
            <h4>[3학년]</h4>
            <div className="subject-table-wrapper">
              <table className="subject-performance-table">
                <thead>
                  <tr>
                    <th>학기</th>
                    <th>교과</th>
                    <th>과목</th>
                    <th>학점수</th>
                    <th>원점수/과목평균(표준편차)</th>
                    <th>성취도(수강자수)</th>
                    <th>석차등급</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedStudentRecord.subjectPerformance.grade3.map((subject, idx) => (
                    <tr key={idx}>
                      <td>{subject.학기}</td>
                      <td>{subject.교과}</td>
                      <td>{subject.과목}</td>
                      <td>{subject.학점수}</td>
                      <td>{subject.원점수과목평균표준편차}</td>
                      <td>{subject.성취도수강자수}</td>
                      <td>{subject.석차등급}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 세부능력 및 특기사항 */}
            {Object.keys(parsedStudentRecord.subjectDetails.grade3).length > 0 && (
              <div className="subject-details-section">
                <h5>세부능력 및 특기사항</h5>
                {Object.entries(parsedStudentRecord.subjectDetails.grade3).map(([subject, detail]) => (
                  <div key={subject} className="subject-detail-item">
                    <div className="subject-detail-title">{subject}:</div>
                    <div className="subject-detail-content">{detail}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectPerformance;
