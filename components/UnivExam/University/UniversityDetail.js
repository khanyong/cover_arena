import React, { useState } from 'react';
import { universityDatabase } from '../Data/universityData';

/**
 * 개별 대학 상세정보 컴포넌트
 * 대학별 전형정보, 평가기준, 면접 팁 등을 표시
 */
const UniversityDetail = ({ universityId }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, criteria, interview, schedule
  const [activeQuestionTab, setActiveQuestionTab] = useState(0); // 기출문제 탭 인덱스

  // 해당 대학 정보 찾기
  const university = universityDatabase.find(univ => univ.id === universityId);

  if (!university) {
    return (
      <div className="university-detail-container">
        <div className="error-message">
          <h2>대학 정보를 찾을 수 없습니다.</h2>
          <p>요청하신 대학의 정보가 존재하지 않습니다.</p>
        </div>
      </div>
    );
  }

  // 면접 없음 여부 확인
  const hasInterview = university.type !== "면접 없음";

  return (
    <div className="university-detail-container">
      {/* 헤더 */}
      <div className="university-detail-header">
        <div className="university-header-content">
          <h1 className="university-name">{university.name}</h1>
          <div className="university-basic-info">
            <span className="info-badge department">{university.department}</span>
            <span className="info-badge campus">{university.campus}</span>
            <span className="info-badge admission-type">{university.admissionType}</span>
          </div>
        </div>
        {university.pdfGuideUrl && (
          <div className="pdf-guide-link">
            <a href={university.pdfGuideUrl} target="_blank" rel="noopener noreferrer" className="btn-pdf">
              전형가이드 PDF 보기
            </a>
          </div>
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="university-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          전형 개요
        </button>
        <button
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          전형 일정
        </button>
        <button
          className={`tab-btn ${activeTab === 'criteria' ? 'active' : ''}`}
          onClick={() => setActiveTab('criteria')}
        >
          평가 기준
        </button>
        {hasInterview && (
          <button
            className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
            onClick={() => setActiveTab('interview')}
          >
            면접 정보
          </button>
        )}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="university-tab-content">
        {/* 전형 개요 */}
        {activeTab === 'overview' && (
          <div className="tab-panel overview-panel">
            <div className="panel-section">
              <h3>전형 정보</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">전형 유형</span>
                  <span className="info-value">{university.admissionType}</span>
                </div>
                {hasInterview && (
                  <>
                    <div className="info-item">
                      <span className="info-label">면접 형태</span>
                      <span className="info-value">{university.type}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">면접 시간</span>
                      <span className="info-value">{university.duration}분</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 전형 방법 */}
            {university.selectionMethod && (
              <div className="panel-section">
                <h3>가. 성적 반영 비율 및 점수</h3>

                <div className="selection-method-table">
                  <table>
                    <thead>
                      <tr>
                        <th>구분</th>
                        <th>서류평가</th>
                        <th>면접평가(인·적성면접)</th>
                        <th>총점</th>
                        <th>선발</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1단계</td>
                        <td>{university.selectionMethod.stage1.selection}</td>
                        <td>-</td>
                        <td>{university.selectionMethod.stage1.selection}</td>
                        <td>{university.selectionMethod.stage1.ratio}</td>
                      </tr>
                      <tr>
                        <td>2단계</td>
                        <td>{university.selectionMethod.stage2.components[0].score}</td>
                        <td>{university.selectionMethod.stage2.components[1].score}</td>
                        <td>{university.selectionMethod.stage2.selection}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="selection-cutoff">
                  <p><strong>[서류평가]</strong> {university.selectionMethod.stage1.cutoff} / <strong>[면접평가]</strong> {university.selectionMethod.stage2.cutoff}</p>
                </div>

                {/* 유의사항 */}
                {university.selectionMethod.notes && university.selectionMethod.notes.length > 0 && (
                  <div className="selection-notes">
                    <ul className="notes-list">
                      {university.selectionMethod.notes.map((note, idx) => (
                        <li key={idx}>{idx + 1}) {note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {hasInterview && university.interviewTips && (
              <div className="panel-section">
                <h3>면접 준비 팁</h3>
                <ul className="tips-list">
                  {university.interviewTips.map((tip, idx) => (
                    <li key={idx} className="tip-item">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 전형 일정 */}
        {activeTab === 'schedule' && (
          <div className="tab-panel schedule-panel">
            <div className="schedule-timeline">
              {/* 원서 접수 */}
              <div className="timeline-item">
                <div className="timeline-marker">1</div>
                <div className="timeline-content">
                  <h4>원서 접수</h4>
                  <p className="schedule-date">{university.scheduleInfo.applicationPeriod}</p>
                  {university.scheduleInfo.applicationNote && (
                    <p className="schedule-note">{university.scheduleInfo.applicationNote}</p>
                  )}
                </div>
              </div>

              {/* 서류 제출 */}
              {university.scheduleInfo.documentSubmission && (
                <div className="timeline-item">
                  <div className="timeline-marker">2</div>
                  <div className="timeline-content">
                    <h4>지원서류 제출 (해당자에 한함)</h4>
                    <p className="schedule-date">{university.scheduleInfo.documentSubmission}</p>
                    {university.scheduleInfo.documentSubmissionLocation && (
                      <p className="schedule-location">장소: {university.scheduleInfo.documentSubmissionLocation}</p>
                    )}
                    {university.scheduleInfo.documentSubmissionNote && (
                      <p className="schedule-note">{university.scheduleInfo.documentSubmissionNote}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 추천서/자기소개서 제출 */}
              {university.scheduleInfo.stage1AnnouncementSchedule && (
                <div className="timeline-item">
                  <div className="timeline-marker">3</div>
                  <div className="timeline-content">
                    <h4>추천대상자명단 제출(학교장추천전형만 해당)</h4>
                    <p className="schedule-date">{university.scheduleInfo.stage1AnnouncementSchedule}</p>
                    {university.scheduleInfo.stage1AnnouncementLocation && (
                      <p className="schedule-location">장소: {university.scheduleInfo.stage1AnnouncementLocation}</p>
                    )}
                    {university.scheduleInfo.stage1AnnouncementNote && (
                      <p className="schedule-note">{university.scheduleInfo.stage1AnnouncementNote}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 1단계 합격자 발표 */}
              {university.scheduleInfo.firstStageAnnouncement && (
                <div className="timeline-item">
                  <div className="timeline-marker">4</div>
                  <div className="timeline-content">
                    <h4>1단계 합격자 발표 - 학생부종합전형(면접형)</h4>
                    <p className="schedule-date">{university.scheduleInfo.firstStageAnnouncement}</p>
                    {university.scheduleInfo.firstStageAnnouncementLocation && (
                      <p className="schedule-location">장소: {university.scheduleInfo.firstStageAnnouncementLocation}</p>
                    )}
                    {university.scheduleInfo.firstStageAnnouncementNote && (
                      <p className="schedule-note">{university.scheduleInfo.firstStageAnnouncementNote}</p>
                    )}
                  </div>
                </div>
              )}
              {university.scheduleInfo.stage1Announcement && !university.scheduleInfo.firstStageAnnouncement && (
                <div className="timeline-item">
                  <div className="timeline-marker">4</div>
                  <div className="timeline-content">
                    <h4>1단계 합격자 발표</h4>
                    <p className="schedule-date">{university.scheduleInfo.stage1Announcement}</p>
                    {university.scheduleInfo.stage1AnnouncementNote && (
                      <p className="schedule-note">{university.scheduleInfo.stage1AnnouncementNote}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 고사장 확인 */}
              {university.scheduleInfo.admissionConfirm && (
                <div className="timeline-item">
                  <div className="timeline-marker">5</div>
                  <div className="timeline-content">
                    <h4>고사장 확인</h4>
                    <p className="schedule-date">{university.scheduleInfo.admissionConfirm}</p>
                    {university.scheduleInfo.admissionConfirmNote && (
                      <p className="schedule-note">{university.scheduleInfo.admissionConfirmNote}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 면접 일정 */}
              {hasInterview && university.scheduleInfo.interviewSchedule && (
                <div className="timeline-item">
                  <div className="timeline-marker">6</div>
                  <div className="timeline-content">
                    <h4>면접 평가 - 학생부종합전형(면접형), 논술전형</h4>
                    <div className="interview-schedule-table">
                      <table>
                        <thead>
                          <tr>
                            <th>구분</th>
                            <th>면접고사 일자</th>
                            <th>해당 모집단위</th>
                            <th>면접장소</th>
                            <th>비고</th>
                          </tr>
                        </thead>
                        <tbody>
                          {university.scheduleInfo.interviewSchedule.map((schedule, idx) => (
                            <tr key={idx}>
                              <td>학생부종합전형<br />(면접형)</td>
                              <td>
                                {schedule.date}<br />
                                {schedule.times.map((time, tidx) => (
                                  <span key={tidx}>
                                    {time}
                                    {tidx < schedule.times.length - 1 && ' / '}
                                  </span>
                                ))}
                              </td>
                              <td>{schedule.targetCampus}</td>
                              <td>{schedule.location}</td>
                              <td>{schedule.note || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {university.scheduleInfo.interviewNote && (
                      <p className="schedule-note">{university.scheduleInfo.interviewNote}</p>
                    )}
                  </div>
                </div>
              )}
              {hasInterview && university.scheduleInfo.interviewDate && !university.scheduleInfo.interviewSchedule && (
                <div className="timeline-item">
                  <div className="timeline-marker">6</div>
                  <div className="timeline-content">
                    <h4>면접 평가</h4>
                    <p className="schedule-date">{university.scheduleInfo.interviewDate}</p>
                    {university.scheduleInfo.interviewNote && (
                      <p className="schedule-note">{university.scheduleInfo.interviewNote}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 최종 합격자 발표 */}
              {university.scheduleInfo.finalAnnouncement && (
                <div className="timeline-item">
                  <div className="timeline-marker">7</div>
                  <div className="timeline-content">
                    <h4>최초 합격자 발표</h4>
                    <p className="schedule-date">{university.scheduleInfo.finalAnnouncement}</p>
                    {university.scheduleInfo.finalAnnouncementLocation && (
                      <p className="schedule-location">장소: {university.scheduleInfo.finalAnnouncementLocation}</p>
                    )}
                    {university.scheduleInfo.finalAnnouncementNote && (
                      <p className="schedule-note">{university.scheduleInfo.finalAnnouncementNote}</p>
                    )}
                  </div>
                </div>
              )}
              {!university.scheduleInfo.finalAnnouncement && university.scheduleInfo.announcement && (
                <div className="timeline-item">
                  <div className="timeline-marker">7</div>
                  <div className="timeline-content">
                    <h4>최종 합격자 발표</h4>
                    <p className="schedule-date">{university.scheduleInfo.announcement}</p>
                  </div>
                </div>
              )}

              {/* 최초 합격자 등록 */}
              {university.scheduleInfo.initialAcceptanceDeposit && (
                <div className="timeline-item">
                  <div className="timeline-marker">8</div>
                  <div className="timeline-content">
                    <h4>최초합격자 문서등록</h4>
                    <p className="schedule-date">{university.scheduleInfo.initialAcceptanceDeposit}</p>
                    {university.scheduleInfo.initialAcceptanceDepositLocation && (
                      <p className="schedule-location">장소: {university.scheduleInfo.initialAcceptanceDepositLocation}</p>
                    )}
                    {university.scheduleInfo.initialAcceptanceDepositNote && (
                      <p className="schedule-note">{university.scheduleInfo.initialAcceptanceDepositNote}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 추가 합격자 발표 */}
              {university.scheduleInfo.additionalAcceptanceAnnouncement && (
                <div className="timeline-item">
                  <div className="timeline-marker">9</div>
                  <div className="timeline-content">
                    <h4>추가 합격자 발표</h4>
                    <p className="schedule-date">{university.scheduleInfo.additionalAcceptanceAnnouncement}</p>
                    {university.scheduleInfo.additionalAcceptanceAnnouncementLocation && (
                      <p className="schedule-location">장소: {university.scheduleInfo.additionalAcceptanceAnnouncementLocation}</p>
                    )}
                    {university.scheduleInfo.additionalAcceptanceAnnouncementNote && (
                      <p className="schedule-note">{university.scheduleInfo.additionalAcceptanceAnnouncementNote}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 등록금 납부 */}
              {university.scheduleInfo.tuitionPayment && (
                <div className="timeline-item">
                  <div className="timeline-marker">10</div>
                  <div className="timeline-content">
                    <h4>등록금 납부</h4>
                    <p className="schedule-date">{university.scheduleInfo.tuitionPayment}</p>
                    {university.scheduleInfo.tuitionPaymentLocation && (
                      <p className="schedule-location">장소: {university.scheduleInfo.tuitionPaymentLocation}</p>
                    )}
                    {university.scheduleInfo.tuitionPaymentNote && (
                      <p className="schedule-note">{university.scheduleInfo.tuitionPaymentNote}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 평가 기준 */}
        {activeTab === 'criteria' && (
          <div className="tab-panel criteria-panel">
            <div className="criteria-intro">
              <h3>평가 항목 및 기준</h3>
              <p>각 평가 항목의 배점과 세부 기준을 확인하세요.</p>
            </div>

            {/* 서류평가 */}
            {university.documentEvaluationCriteria && (
              <div className="evaluation-section">
                <h4 className="evaluation-section-title">나. 서류평가</h4>
                <div className="evaluation-info">
                  <p>1) 전형자료: 학교생활기록부(학교생활기록부 대체 확인보고서)</p>
                  <p>2) 평가방법: 2인의 평가자가 블라인드 처리된 지원자의 제출 서류를 바탕으로 학업역량, 진로역량, 공동체역량을 정성적·종합적으로 평가합니다.</p>
                  <p>3) 평가요소 및 평가항목</p>
                </div>
                <div className="criteria-table-container">
                  <table className="criteria-table">
                    <thead>
                      <tr>
                        <th>평가요소</th>
                        <th>비율(%)</th>
                        <th>평가항목 및 평가내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      {university.documentEvaluationCriteria.map((criterion) => (
                        <tr key={criterion.id}>
                          <td className="criteria-name">{criterion.criterion}</td>
                          <td className="criteria-weight">{criterion.weight}</td>
                          <td className="criteria-details">
                            {criterion.description && (
                              <div className="criteria-description">{criterion.description}</div>
                            )}
                            {criterion.keyPoints && criterion.keyPoints.length > 0 && (
                              <ul className="criteria-keypoints-list">
                                {criterion.keyPoints.map((point, idx) => (
                                  <li key={idx}>{point}</li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 면접평가 */}
            {university.evaluationCriteria && (
              <div className="evaluation-section">
                <h4 className="evaluation-section-title">다. 면접평가</h4>
                <div className="evaluation-info">
                  <p>1) 전형자료: 학교생활기록부(학교생활기록부 대체 확인보고서)</p>
                  <p>2) 평가방법: 2인의 면접관이 블라인드 처리된 지원자의 제출 서류를 바탕으로 학업역량, 진로역량, 공동체역량을 종합적으로 평가합니다.</p>
                  <p>3) 평가요소 및 평가항목</p>
                </div>
                <div className="criteria-table-container">
                  <table className="criteria-table">
                    <thead>
                      <tr>
                        <th>평가요소</th>
                        <th>비율(%)</th>
                        <th>평가내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      {university.evaluationCriteria.map((criterion) => (
                        <tr key={criterion.id}>
                          <td className="criteria-name">{criterion.criterion}</td>
                          <td className="criteria-weight">{criterion.weight}</td>
                          <td className="criteria-details">
                            <div className="criteria-description">{criterion.description}</div>
                            {criterion.keyPoints && criterion.keyPoints.length > 0 && (
                              <ul className="criteria-keypoints-list">
                                {criterion.keyPoints.map((point, idx) => (
                                  <li key={idx}>{point}</li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 면접 정보 */}
        {activeTab === 'interview' && hasInterview && (
          <div className="tab-panel interview-panel">
            {/* 면접 기출문제 */}
            {university.pastInterviewQuestions && university.pastInterviewQuestions.length > 0 && (
              <div className="past-questions-section">
                <h3>면접 기출문제</h3>
                <p className="section-description">
                  실제 면접에서 출제되었던 기출문제입니다. 문제 유형과 평가 기준을 파악하는데 활용하세요.
                </p>

                {/* 기출문제 탭 네비게이션 */}
                <div className="question-tabs">
                  {university.pastInterviewQuestions.map((item, idx) => (
                    <button
                      key={idx}
                      className={`question-tab-btn ${activeQuestionTab === idx ? 'active' : ''}`}
                      onClick={() => setActiveQuestionTab(idx)}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>

                {/* 선택된 기출문제 표시 */}
                {university.pastInterviewQuestions.map((item, idx) => (
                  activeQuestionTab === idx && (
                    <div key={idx} className="past-question-card">
                      <div className="past-question-header">
                        <div className="past-question-meta">
                          <span className="past-question-year">{item.year}학년도</span>
                          <span className="past-question-date">{item.date}</span>
                          <span className="past-question-type">{item.type}</span>
                        </div>
                      </div>

                      {/* 문제 및 추가질문 섹션 */}
                      <div className="question-section">
                        <div className="main-question-box">
                          <h5 className="section-label">📋 문제</h5>
                          <p className="question-text">{item.mainQuestion}</p>
                        </div>

                        {item.additionalQuestions && item.additionalQuestions.length > 0 && (
                          <div className="additional-questions-box">
                            <h5 className="section-label">💬 추가질문</h5>
                            {item.additionalQuestions.map((addQ, aqIdx) => (
                              <div key={aqIdx} className="additional-question-item">
                                <div className="condition-badge">{addQ.condition}</div>
                                <p className="additional-question-text">{addQ.question}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 예시 모범답안 섹션 */}
                      {item.sampleAnswer && (
                        <div className="sample-answer-section">
                          <h5 className="section-label">✅ 예시 모범답안</h5>

                          {item.sampleAnswer.evaluationNote && (
                            <div className="evaluation-note-box">
                              <h6>평가시 참고 사항</h6>
                              <p>{item.sampleAnswer.evaluationNote}</p>
                            </div>
                          )}

                          {item.sampleAnswer.sdgGoalsTable && (
                            <div className="sdg-goals-box">
                              <h6>※ '지속 가능 발전 목표'의 구성 요소 (특히 연관항목은 음영처리 하였음)</h6>
                              <div className="sdg-table-wrapper">
                                <table className="sdg-goals-table">
                                  <thead>
                                    <tr>
                                      {item.sampleAnswer.sdgGoalsTable.header.map((cell, idx) => (
                                        <th
                                          key={idx}
                                          className={cell.highlighted ? 'highlighted' : ''}
                                        >
                                          {cell.text.split('\n').map((line, lineIdx) => (
                                            <React.Fragment key={lineIdx}>
                                              {line}
                                              {lineIdx < cell.text.split('\n').length - 1 && <br />}
                                            </React.Fragment>
                                          ))}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.sampleAnswer.sdgGoalsTable.rows.map((row, rowIdx) => (
                                      <tr key={rowIdx}>
                                        {row.map((cell, cellIdx) => (
                                          <td
                                            key={cellIdx}
                                            className={cell.highlighted ? 'highlighted' : ''}
                                          >
                                            {cell.text.split('\n').map((line, lineIdx) => (
                                              <React.Fragment key={lineIdx}>
                                                {line}
                                                {lineIdx < cell.text.split('\n').length - 1 && <br />}
                                              </React.Fragment>
                                            ))}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {item.sampleAnswer.answerExample && (
                            <div className="answer-example-box">
                              <pre className="answer-example-text">{item.sampleAnswer.answerExample}</pre>
                            </div>
                          )}

                          {/* 추가 모범답안 */}
                          {item.sampleAnswer.additionalAnswers && item.sampleAnswer.additionalAnswers.map((addAnswer, aaIdx) => (
                            <div key={aaIdx} className="additional-answer-box">
                              {addAnswer.title && <h6 className="additional-answer-title">{addAnswer.title}</h6>}
                              <pre className="answer-example-text">{addAnswer.content}</pre>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 평가 포인트 */}
                      {item.evaluationPoints && item.evaluationPoints.length > 0 && (
                        <div className="evaluation-points">
                          <h5>평가 포인트</h5>
                          <ul>
                            {item.evaluationPoints.map((point, pidx) => (
                              <li key={pidx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}

            <div className="interview-info-section">
              <h3>예상 면접 질문</h3>
              <p className="section-description">
                학생부와 전공적합성을 고려한 예상 질문입니다. 실제 면접에서는 다른 질문이 나올 수 있으니 참고용으로 활용하세요.
              </p>

              <div className="interview-questions-list">
                {university.interviewQuestions && university.interviewQuestions.map((question, idx) => (
                  <div key={idx} className="interview-question-card">
                    <div className="question-number">Q{idx + 1}</div>
                    <div className="question-content">
                      <p className="question-text">{typeof question === 'string' ? question : question.question}</p>
                      {question.category && (
                        <span className="question-category">{question.category}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 면접 평가 정보 */}
            {university.interviewEvaluation && (
              <div className="interview-evaluation-section">
                <h3>면접 평가 기준</h3>
                {university.interviewEvaluation.description && (
                  <p className="evaluation-description">{university.interviewEvaluation.description}</p>
                )}

                {/* 전형 방법 */}
                {university.interviewEvaluation.method && (
                  <div className="evaluation-method-section">
                    <h4>전형 방법</h4>
                    <div className="method-table">
                      <table>
                        <thead>
                          <tr>
                            <th>구분</th>
                            <th>서류평가</th>
                            <th>면접평가(인·적성면접)</th>
                            <th>총점</th>
                            <th>선발</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1단계</td>
                            <td>{university.interviewEvaluation.method.stage1.ratio}</td>
                            <td>-</td>
                            <td>{university.interviewEvaluation.method.stage1.ratio}</td>
                            <td>3배수</td>
                          </tr>
                          <tr>
                            <td>2단계</td>
                            <td>{university.interviewEvaluation.method.stage2.ratio}</td>
                            <td>{university.interviewEvaluation.method.stage2.components}</td>
                            <td>{university.interviewEvaluation.method.stage2.total}</td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {university.interviewEvaluation.method.stage2.notes && (
                      <div className="method-notes">
                        {university.interviewEvaluation.method.stage2.notes.map((note, idx) => (
                          <p key={idx}>{note}</p>
                        ))}
                      </div>
                    )}
                    <div className="method-info">
                      <div className="method-info-item">
                        <strong>{university.interviewEvaluation.method.documents.title}:</strong>
                        <span>{university.interviewEvaluation.method.documents.content}</span>
                      </div>
                      <div className="method-info-item">
                        <strong>{university.interviewEvaluation.method.evaluationMethod.title}:</strong>
                        <span>{university.interviewEvaluation.method.evaluationMethod.content}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 평가 기준 */}
                {university.interviewEvaluation.criteria && (
                  <div className="evaluation-criteria-grid">
                    {university.interviewEvaluation.criteria.map((criterion, idx) => (
                      <div key={idx} className="evaluation-criterion-card">
                        <div className="evaluation-criterion-header">
                          <h4>{criterion.name}</h4>
                          <span className="evaluation-weight">{criterion.weight}%</span>
                        </div>
                        <p className="evaluation-criterion-desc">{criterion.description}</p>
                        {criterion.details && criterion.details.length > 0 && (
                          <div className="evaluation-details">
                            <h5>평가 세부항목</h5>
                            <ul>
                              {criterion.details.map((detail, didx) => (
                                <li key={didx}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {university.interviewEvaluation.notes && university.interviewEvaluation.notes.length > 0 && (
                  <div className="evaluation-notes">
                    <h4>유의사항</h4>
                    <ul>
                      {university.interviewEvaluation.notes.map((note, nidx) => (
                        <li key={nidx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {university.interviewTips && university.interviewTips.length > 0 && (
              <div className="interview-tips-section">
                <h3>면접 준비 전략</h3>
                <div className="tips-grid">
                  {university.interviewTips.map((tip, idx) => (
                    <div key={idx} className="tip-card">
                      <div className="tip-icon">{idx + 1}</div>
                      <p className="tip-text">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityDetail;
