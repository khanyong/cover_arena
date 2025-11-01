import React from 'react';
import parsedStudentRecord from '../Data/parsedStudentRecord';

/**
 * 창의적 체험활동상황 컴포넌트
 * 자율활동, 동아리활동, 진로활동을 학년별로 표시
 */
const CreativeActivities = () => {
  const { recordByYear } = parsedStudentRecord;

  // 활동 내용 렌더링 (객체 형식으로 변경)
  const renderActivityContent = (activityData) => {
    if (!activityData || !activityData.내용) return <div className="no-content">-</div>;

    return (
      <div className="activity-content">
        {activityData.시간 && (
          <div className="activity-hours">⏱️ {activityData.시간}시간</div>
        )}
        <div className="activity-description">{activityData.내용}</div>
      </div>
    );
  };

  return (
    <div className="creative-activities-container">
      {/* 헤더 */}
      <div className="table-header">
        <h2 className="table-title">창의적 체험활동상황</h2>
        <p className="table-subtitle">학년별 자율활동, 동아리활동, 진로활동 정리</p>
      </div>

      {/* 테이블 */}
      <div className="record-table-wrapper">
        <table className="record-table">
          <thead>
            <tr>
              <th className="col-grade">구분</th>
              <th className="col-category">자율활동</th>
              <th className="col-category">동아리활동</th>
              <th className="col-category">진로활동</th>
            </tr>
          </thead>
          <tbody>
            {/* 1학년 */}
            <tr className="grade-row">
              <td className="grade-cell">
                <div className="grade-label">1<br/>학<br/>년</div>
              </td>
              <td className="content-cell">
                {renderActivityContent(recordByYear.grade1.자율활동)}
              </td>
              <td className="content-cell">
                {renderActivityContent(recordByYear.grade1.동아리활동)}
              </td>
              <td className="content-cell">
                {renderActivityContent(recordByYear.grade1.진로활동)}
              </td>
            </tr>

            {/* 2학년 */}
            <tr className="grade-row">
              <td className="grade-cell">
                <div className="grade-label">2<br/>학<br/>년</div>
              </td>
              <td className="content-cell">
                {renderActivityContent(recordByYear.grade2.자율활동)}
              </td>
              <td className="content-cell">
                {renderActivityContent(recordByYear.grade2.동아리활동)}
              </td>
              <td className="content-cell">
                {renderActivityContent(recordByYear.grade2.진로활동)}
              </td>
            </tr>

            {/* 3학년 */}
            <tr className="grade-row">
              <td className="grade-cell">
                <div className="grade-label">3<br/>학<br/>년</div>
              </td>
              <td className="content-cell">
                {renderActivityContent(recordByYear.grade3.자율활동)}
              </td>
              <td className="content-cell">
                {renderActivityContent(recordByYear.grade3.동아리활동)}
              </td>
              <td className="content-cell">
                {renderActivityContent(recordByYear.grade3.진로활동)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 봉사활동 및 수상경력 */}
      <div className="additional-info-section">
        <div className="info-card">
          <h3>수상 경력</h3>
          <div className="awards-list">
            {parsedStudentRecord.awards && parsedStudentRecord.awards.map((award, idx) => (
              <div key={idx} className="award-item">
                <span className="award-grade">학년</span>
                <span className="award-name">{award.수상명}</span>
                {award.등급위 && <span className="award-rank">{award.등급위}</span>}
                <span className="award-date">{award.수상연월일}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="info-card">
          <h3>행동특성 및 종합의견</h3>
          <div className="behavioral-opinions">
            <div className="opinion-item">
              <h4>1학년</h4>
              <p>{parsedStudentRecord.behavioralCharacteristics.grade1}</p>
            </div>
            <div className="opinion-item">
              <h4>2학년</h4>
              <p>{parsedStudentRecord.behavioralCharacteristics.grade2}</p>
            </div>
            <div className="opinion-item">
              <h4>3학년</h4>
              <p>{parsedStudentRecord.behavioralCharacteristics.grade3}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeActivities;
