import React, { useState } from 'react';
import UniversityProfile from './UniversityProfile';
import EvaluationCriteria from './EvaluationCriteria';

/**
 * 5개 대학 선택 및 관리 컴포넌트
 */
const UniversitySelector = ({
  selectedUniversities,
  setSelectedUniversities,
  universityDatabase
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUnivForView, setSelectedUnivForView] = useState(null);

  // 대학 추가
  const addUniversity = (university) => {
    if (selectedUniversities.length >= 5) {
      alert('최대 5개의 대학까지 선택할 수 있습니다.');
      return;
    }

    if (selectedUniversities.find(u => u.id === university.id)) {
      alert('이미 선택된 대학입니다.');
      return;
    }

    setSelectedUniversities([...selectedUniversities, university]);
    setShowAddModal(false);
  };

  // 대학 제거
  const removeUniversity = (universityId) => {
    if (window.confirm('이 대학을 목록에서 제거하시겠습니까?')) {
      setSelectedUniversities(
        selectedUniversities.filter(u => u.id !== universityId)
      );
      if (selectedUnivForView?.id === universityId) {
        setSelectedUnivForView(null);
      }
    }
  };

  // 대학 순서 변경
  const moveUniversity = (index, direction) => {
    const newList = [...selectedUniversities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newList.length) return;

    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setSelectedUniversities(newList);
  };

  return (
    <div className="university-selector">
      <div className="selector-header">
        <h2>지원 대학 관리</h2>
        <p className="subtitle">
          최대 5개의 대학을 선택하고 각 대학의 면접 평가기준을 확인하세요
        </p>
      </div>

      {/* 선택된 대학 목록 */}
      <div className="selected-universities">
        <div className="section-header">
          <h3>선택된 대학 ({selectedUniversities.length}/5)</h3>
          <button
            className="btn-add-university"
            onClick={() => setShowAddModal(true)}
            disabled={selectedUniversities.length >= 5}
          >
            ➕ 대학 추가
          </button>
        </div>

        {selectedUniversities.length === 0 ? (
          <div className="empty-state">
            <p>아직 선택된 대학이 없습니다.</p>
            <button
              className="btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              첫 번째 대학 추가하기
            </button>
          </div>
        ) : (
          <div className="universities-list">
            {selectedUniversities.map((univ, index) => (
              <div
                key={univ.id}
                className={`university-card ${selectedUnivForView?.id === univ.id ? 'selected' : ''}`}
              >
                <div className="university-card-header">
                  <div className="university-rank">
                    {index + 1}지망
                  </div>
                  <div className="university-info">
                    <h4>{univ.name}</h4>
                    <p>{univ.department}</p>
                  </div>
                  <div className="university-actions">
                    <button
                      className="btn-icon"
                      onClick={() => moveUniversity(index, 'up')}
                      disabled={index === 0}
                      title="위로 이동"
                    >
                      ⬆️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => moveUniversity(index, 'down')}
                      disabled={index === selectedUniversities.length - 1}
                      title="아래로 이동"
                    >
                      ⬇️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => setSelectedUnivForView(univ)}
                      title="상세 보기"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-icon btn-remove"
                      onClick={() => removeUniversity(univ.id)}
                      title="제거"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="university-card-body">
                  <div className="university-meta">
                    <span>⏱️ {univ.duration}분</span>
                    <span>📋 {univ.type}</span>
                    <span>📊 {univ.evaluationCriteria.length}개 평가항목</span>
                  </div>

                  {/* 평가 기준 간단 요약 */}
                  <div className="criteria-summary">
                    {univ.evaluationCriteria.map(criterion => (
                      <div key={criterion.id} className="criterion-chip">
                        <span className="criterion-name">{criterion.criterion}</span>
                        <span className="criterion-weight">{criterion.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 대학 추가 모달 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>대학 선택</h3>
              <button
                className="btn-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="university-options">
                {universityDatabase
                  .filter(univ => !selectedUniversities.find(u => u.id === univ.id))
                  .map(univ => (
                    <div
                      key={univ.id}
                      className="university-option"
                      onClick={() => addUniversity(univ)}
                    >
                      <div className="option-header">
                        <h4>{univ.name}</h4>
                        <p>{univ.department}</p>
                      </div>
                      <div className="option-meta">
                        <span>⏱️ {univ.duration}분</span>
                        <span>│</span>
                        <span>📋 {univ.type}</span>
                      </div>
                      <div className="option-criteria">
                        {univ.evaluationCriteria.map(c => (
                          <span key={c.id} className="criteria-tag">
                            {c.criterion} {c.weight}%
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 대학 상세 보기 */}
      {selectedUnivForView && (
        <div className="university-detail-section">
          <div className="detail-header">
            <h3>{selectedUnivForView.name} {selectedUnivForView.department} 상세 정보</h3>
            <button
              className="btn-close"
              onClick={() => setSelectedUnivForView(null)}
            >
              ✕ 닫기
            </button>
          </div>

          <UniversityProfile university={selectedUnivForView} />

          <EvaluationCriteria
            criteria={selectedUnivForView.evaluationCriteria}
            universityName={selectedUnivForView.name}
          />
        </div>
      )}
    </div>
  );
};

export default UniversitySelector;
