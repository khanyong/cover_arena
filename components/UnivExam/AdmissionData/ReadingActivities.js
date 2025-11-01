import React, { useState } from 'react';
import parsedStudentRecord from '../Data/parsedStudentRecord';

/**
 * 독서활동상황 컴포넌트
 * 학년별 독서 목록을 카드 형식으로 표시
 */
const ReadingActivities = () => {
  const { readingActivities } = parsedStudentRecord;
  const [activeGrade, setActiveGrade] = useState(1);

  // 도서 데이터를 파싱하여 상세 정보 추가
  const parseBookData = (rawData) => {
    const books = [];

    rawData.forEach(item => {
      const subject = item.과목또는영역;
      const booksText = item.도서명;

      // 쉼표로 구분된 책들을 분리
      const bookList = booksText.split(',').map(b => b.trim());

      bookList.forEach(bookStr => {
        // 괄호 안의 저자 추출
        const match = bookStr.match(/(.+?)\((.+?)\)/);
        if (match) {
          const title = match[1].trim();
          const author = match[2].trim();
          books.push({
            subject,
            title,
            author,
            summary: getBookSummary(title, author),
            genre: getBookGenre(subject)
          });
        } else {
          books.push({
            subject,
            title: bookStr,
            author: '저자 미상',
            summary: '책에 대한 설명이 추가될 예정입니다.',
            genre: getBookGenre(subject)
          });
        }
      });
    });

    return books;
  };

  // 책 요약 정보 (실제로는 데이터베이스에서 가져와야 함)
  const getBookSummary = (title, author) => {
    const summaries = {
      '동물농장': '조지 오웰의 우화 소설로, 동물들이 인간을 몰아내고 농장을 차지하지만 결국 새로운 독재 체제가 형성되는 과정을 그립니다. 전체주의와 권력의 부패에 대한 날카로운 풍자를 담고 있습니다.',
      'Wonder': 'R. J. Palacio의 감동적인 소설로, 선천적 안면 기형을 가진 소년 어기의 학교생활을 통해 차이에 대한 이해와 수용, 진정한 용기의 의미를 전달합니다.',
      'Forrest Gump': 'Winston Groom의 소설로, 지적 장애를 가진 포레스트 검프가 자신만의 순수함과 선함으로 삶의 모든 역경을 극복하고 성공을 이루는 이야기입니다.',
      'Beloved': 'Toni Morrison의 퓰리처상 수상작으로, 노예제의 비인간성과 그 트라우마가 한 여성의 삶에 미친 영향을 강렬하게 그려냅니다.'
    };

    return summaries[title] || `${author}의 작품으로, 학생의 관심 분야와 연계된 깊이 있는 독서 활동을 통해 지적 성장과 인문학적 소양을 함양했습니다.`;
  };

  const getBookGenre = (subject) => {
    const genres = {
      '국어': '문학',
      '수학': '수학/과학',
      '영어': '외국문학',
      '통합사회': '사회/역사',
      '통합과학': '과학',
      '스페인어 회화 I': '외국어/문화',
      '독서': '인문/교양',
      '문학': '문학',
      '사회·문화': '사회과학',
      '생활과윤리': '철학/윤리',
      '스페인어과 문화': '외국어/문화'
    };

    return genres[subject] || '교양';
  };

  // 학년별 도서 파싱
  const grade1Books = parseBookData(readingActivities.grade1);
  const grade2Books = parseBookData(readingActivities.grade2);
  const grade3Books = parseBookData(readingActivities.grade3);

  // 현재 활성 학년의 책 목록
  const currentBooks = activeGrade === 1 ? grade1Books : activeGrade === 2 ? grade2Books : activeGrade === 3 ? grade3Books : [];

  return (
    <div className="reading-activities-container">
      {/* 헤더 */}
      <div className="table-header">
        <h2 className="table-title">독서활동상황</h2>
        <p className="table-subtitle">학년별 독서 목록 및 상세 정보</p>
      </div>

      {/* 학년 탭 */}
      <div className="grade-tabs-reading">
        <button
          className={`grade-tab-reading ${activeGrade === 1 ? 'active' : ''}`}
          onClick={() => setActiveGrade(1)}
        >
          1학년 <span className="book-count-badge">{grade1Books.length}권</span>
        </button>
        <button
          className={`grade-tab-reading ${activeGrade === 2 ? 'active' : ''}`}
          onClick={() => setActiveGrade(2)}
        >
          2학년 <span className="book-count-badge">{grade2Books.length}권</span>
        </button>
        <button
          className={`grade-tab-reading ${activeGrade === 3 ? 'active' : ''}`}
          onClick={() => setActiveGrade(3)}
        >
          3학년 <span className="book-count-badge">{grade3Books.length}권</span>
        </button>
      </div>

      {/* 도서 목록 */}
      <div className="books-list">
        {currentBooks.map((book, idx) => (
          <div key={idx} className="book-detail-card">
            <div className="book-header">
              <div className="book-number">#{idx + 1}</div>
              <div className="book-meta">
                <span className="genre-tag">{book.genre}</span>
                <span className="subject-tag">{book.subject}</span>
              </div>
            </div>
            <div className="book-body">
              <h3 className="book-title-main">{book.title}</h3>
              <p className="book-author">저자: {book.author}</p>
              <div className="book-summary">
                <h4>주요 내용</h4>
                <p>{book.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 통계 요약 */}
      <div className="reading-stats-summary">
        <h3>📊 독서 통계</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">총 독서량</div>
            <div className="stat-value">{currentBooks.length}권</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">과목 수</div>
            <div className="stat-value">
              {new Set(currentBooks.map(b => b.subject)).size}개
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">장르 수</div>
            <div className="stat-value">
              {new Set(currentBooks.map(b => b.genre)).size}개
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingActivities;
