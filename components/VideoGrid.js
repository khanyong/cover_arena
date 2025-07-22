import VideoCard from './VideoCard';

export default function VideoGrid({ videos, setVideos, user, setSelectedVideo }) {
  // Arena 크기
  const arenaW = 1200;
  const arenaH = 1400;
  const cx = arenaW / 2;
  const cy = arenaH / 2;
  const rOuter = Math.min(cx, cy) - 80; // 바깥쪽 반지름
  const rInner = 120; // 중앙(1~3위) 반지름

  // 좋아요 기반 정렬
  const sorted = [...videos]
    .map((v, i) => ({ ...v, originalIndex: i }))
    .sort((a, b) => (b.arenaLikes || 0) - (a.arenaLikes || 0));

  // spiralRectPositions: 직사각형 나선형(spiral) 좌표 생성 함수
  function spiralRectPositions(arenaW, arenaH, sizes) {
    // 중앙 빈 공간 영역
    const centerW = 300;
    const centerH = 200;
    const centerX = (arenaW - centerW) / 2;
    const centerY = (arenaH - centerH) / 2;
    const spiralMargin = 160; // 상하좌우 여백
    const n = sizes.length;
    const positions = Array(n);
    let left = spiralMargin, right = arenaW - spiralMargin, top = spiralMargin, bottom = arenaH - spiralMargin;
    let dir = 0; // 0: left, 1: up, 2: right, 3: down
    let x = right, y = bottom;
    let step = 0;
    for (let i = n - 1; i >= 0; i--) { // 큰 것부터 중앙에 배치
      const { width, height } = sizes[i];
      let tryCount = 0;
      while (true) {
        // 방향에 따라 위치 계산
        if (dir === 0) { // ← 왼쪽
          x = right - width;
          y = bottom - height;
          right -= width * 0.05;
        } else if (dir === 1) { // ↑ 위
          x = left;
          y = bottom - height;
          bottom -= height * 0.05;
        } else if (dir === 2) { // → 오른쪽
          x = left;
          y = top;
          left += width * 0.05;
        } else if (dir === 3) { // ↓ 아래
          x = right - width;
          y = top;
          top += height * 0.05;
        }
        // 중앙 빈 공간과 겹치면 spiral 한 칸 더 진행
        const overlap = !(x + width < centerX || x > centerX + centerW || y + height < centerY || y > centerY + centerH);
        if (!overlap || tryCount > 10) break;
        dir = (dir + 1) % 4;
        tryCount++;
      }
      positions[i] = { x, y };
      dir = (dir + 1) % 4;
      step++;
    }
    return positions;
  }

  // VS 중앙 빈 공간 영역
  const centerW = 300;
  const centerH = 200;
  const centerX = (arenaW - centerW) / 2;
  const centerY = (arenaH - centerH) / 2;

  // site_score 기준 내림차순 정렬 (큰 수가 중앙)
  const sortedByScore = [...videos]
    .map((v, i) => ({ ...v, originalIndex: i }))
    .sort((a, b) => (b.site_score || 0) - (a.site_score || 0));

  // 1,2,3위는 VS 주변에 고정 배치
  const top3Angles = [Math.PI / 2, Math.PI, 3 * Math.PI / 2]; // 위, 왼, 아래 (시계방향)
  const top3Positions = top3Angles.map((angle, idx) => {
    // VS 영역의 중심을 기준으로, VS 영역 바깥쪽에 위치
    const r = Math.max(centerW, centerH) / 2 + 80; // VS 영역 반지름 + 여유
    const cx = centerX + centerW / 2;
    const cy = centerY + centerH / 2;
    const x = cx + r * Math.cos(angle) - 80; // 80은 대략 썸네일 절반 폭
    const y = cy + r * Math.sin(angle) - 45; // 45는 대략 썸네일 절반 높이
    return { x, y };
  });

  // 동적 크기 계산 (site_score 기반)
  const minSize = 160;
  const maxSize = 400;
  const siteScores = sortedByScore.map(v => v.site_score || 0);
  const maxScore = Math.max(...siteScores, 1);
  const minScore = Math.min(...siteScores, 0);
  const sizes = sortedByScore.map(v => {
    // site_score가 0~maxScore 사이에서 선형 보간
    const score = v.site_score || 0;
    const ratio = maxScore === minScore ? 0 : (score - minScore) / (maxScore - minScore);
    const width = minSize + (maxSize - minSize) * ratio;
    return { width, height: width * 9 / 16 };
  });
  // spiral 경로 좌표 생성 (site_score 큰 것부터, 1~3위 제외)
  const spiralPositions = spiralRectPositions(
    arenaW,
    arenaH,
    sizes.slice(3)
  );
  // 각 영상의 실제 위치를 spiralPositions/top3Positions에서 찾아 매칭
  const positionsForVideo = Array(videos.length);
  // 1,2,3위는 VS 주변에 고정
  for (let i = 0; i < 3 && i < sortedByScore.length; i++) {
    positionsForVideo[sortedByScore[i].originalIndex] = top3Positions[i];
  }
  // 나머지는 spiral
  sortedByScore.slice(3).forEach((v, i) => {
    positionsForVideo[v.originalIndex] = spiralPositions[i] || { x: 0, y: 0 };
  });

  return (
    <div
      className="arena-container"
      style={{
        position: 'relative',
        width: arenaW,
        height: 1400,
        margin: '40px auto 40px auto',
        overflow: 'hidden',
      }}
    >
      {/* 중앙 VS 텍스트 (항상 영상 위에 보이도록 zIndex를 크게) */}
      <div
        style={{
          position: 'absolute',
          left: `${centerX}px`,
          top: `${centerY}px`,
          width: centerW,
          height: centerH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontWeight: 'bold',
            color: 'rgba(255,255,255,0.28)',
            textShadow: '0 4px 32px rgba(0,0,0,0.85), 0 0 0 #fff, 2px 2px 8px #000',
            letterSpacing: 16,
            userSelect: 'none',
            WebkitTextStroke: '2px #222',
          }}
        >
          VS
        </span>
      </div>
      {videos.map((video, i) => {
        const size = sizes[sortedByScore.findIndex(v => v.originalIndex === i)];
        const pos = positionsForVideo[i] || { x: 0, y: 0 };
        // zIndex: 1~3위가 가장 높게, 나머지는 낮게
        const z = sorted.findIndex(v => v.originalIndex === i);
        const opacity = z <= 2 ? 1 : 0.85;
        return (
          <div
            key={video.id}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: size.width,
              height: size.height,
              zIndex: 100 + (2 - z),
              opacity,
              boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.7s cubic-bezier(0.4,0,0.6,1)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={() => setSelectedVideo(video)}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', flex: 1 }}
            />
            <div style={{ padding: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>🏆 {video.arenaLikes || 0}</span>
                <span>❤️ {video.likes}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 