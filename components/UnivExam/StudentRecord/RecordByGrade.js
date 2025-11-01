import React from 'react';
import parsedStudentRecord from '../Data/parsedStudentRecord';

/**
 * 학년별 생활기록부 정리 컴포넌트
 * 1학년, 2학년, 3학년의 활동을 표 형식으로 정리하여 표시
 */
const RecordByGrade = () => {
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
    <div className="record-by-grade-table">
      {/* 헤더 */}
      <div className="table-header">
        <h2 className="table-title">학생부 정리 및 분석</h2>
        <p className="table-subtitle">1학년, 항목, 소재별 내용을 돌아보며 지난 3년 활동을 정리</p>
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
              <th className="col-category">전공관련교과</th>
              <th className="col-category">그 외 교과</th>
              <th className="col-category">행특</th>
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
              <td className="content-cell">
                <div className="no-content">-</div>
              </td>
              <td className="content-cell">
                <div className="no-content">-</div>
              </td>
              <td className="content-cell behavior-cell">
                <div className="behavior-content">{recordByYear.grade1.행특 || '-'}</div>
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
              <td className="content-cell">
                <div className="no-content">-</div>
              </td>
              <td className="content-cell">
                <div className="no-content">-</div>
              </td>
              <td className="content-cell behavior-cell">
                <div className="behavior-content">{recordByYear.grade2.행특 || '-'}</div>
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
              <td className="content-cell">
                <div className="no-content">-</div>
              </td>
              <td className="content-cell">
                <div className="no-content">-</div>
              </td>
              <td className="content-cell behavior-cell">
                <div className="behavior-content">{recordByYear.grade3.행특 || '-'}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 추가 정보 섹션 */}
      <div className="additional-info-section">
        {/* 교과학습발달상황 */}
        <div className="info-card full-width">
          <h3>교과학습발달상황</h3>

          {/* 1학년 */}
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

          {/* 2학년 */}
          {parsedStudentRecord.subjectPerformance.grade2.length > 0 && (
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
            </div>
          )}

          {/* 3학년 */}
          {parsedStudentRecord.subjectPerformance.grade3.length > 0 && (
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
            </div>
          )}
        </div>

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

export default RecordByGrade;
