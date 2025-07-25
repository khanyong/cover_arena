import React, { useRef, useState, useEffect } from 'react';

// 반응형 Arena 크기
const arenaH = 400; // 기본 높이(모바일)
const arenaHmd = 700; // md 이상 높이
const maxSize = 400; // 1위 크기
const minSize = 120; // 최하위 크기
const packingWidth = 1200; // 가로 packing 너비 조정


export default function VideoGrid({ videos, setVideos, user, setSelectedVideo }) {
  const arenaRef = useRef(null);
  // 드래그/터치 스크롤 상태
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const isTouching = useRef(false);
  const dragThreshold = 8; // px
  const dragStart = useRef({ x: 0, y: 0 });
  const dragVideoId = useRef(null);

  // 1. 랭킹/크기 계산 (상위 100개만)
  const sorted = [...videos]
    .map((v, i) => ({ ...v, originalIndex: i }))
    .sort((a, b) => (b.site_score || 0) - (a.site_score || 0))
    .slice(0, 100);
  const videoWithRankAndSize = sorted.map((v, idx) => {
    const rank = idx + 1;
    const ratio = (sorted.length === 1) ? 1 : 1 - (rank - 1) / (sorted.length - 1);
    const size = minSize + (maxSize - minSize) * ratio;
    return { ...v, rank, size };
  });

  // 2. Packing: 좌상단부터 한 줄씩 채우기 (packingWidth 기준)
  let x = 0, y = 0, rowMaxH = 0;
  const gap = 10; // 영상 간 간격
  const positions = [];
  videoWithRankAndSize.forEach((v, i) => {
    if (x + v.size + gap > packingWidth) {
      x = 0;
      y += rowMaxH + gap;
      rowMaxH = 0;
    }
    positions.push({ ...v, x, y });
    x += v.size + gap;
    if (v.size > rowMaxH) rowMaxH = v.size;
  });
  const totalPackingHeight = y + rowMaxH;

  // 드래그 스크롤 이벤트 (수정)
  const onMouseDown = (e, videoId) => {
    if (e.button !== 0) return; // 좌클릭만 허용
    isDragging.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragVideoId.current = videoId;
    lastPos.current = { x: e.clientX, y: e.clientY };
    document.addEventListener('mousemove', onMouseMoveDoc);
    document.addEventListener('mouseup', onMouseUpDoc);
  };
  const onMouseMoveDoc = (e) => {
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
      isDragging.current = true;
    }
    if (isDragging.current) {
      if (arenaRef.current) {
        arenaRef.current.scrollLeft -= e.movementX;
        arenaRef.current.scrollTop -= e.movementY;
      }
    }
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUpDoc = (e) => {
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (!isDragging.current && Math.abs(dx) < dragThreshold && Math.abs(dy) < dragThreshold) {
      // 클릭으로 간주 → 영상 재생
      const video = positions.find(v => v.id === dragVideoId.current);
      if (video) setSelectedVideo(video);
    }
    isDragging.current = false;
    dragVideoId.current = null;
    document.removeEventListener('mousemove', onMouseMoveDoc);
    document.removeEventListener('mouseup', onMouseUpDoc);
  };

  // 터치 스크롤 이벤트 (수정)
  const onTouchStart = (e, videoId) => {
    isTouching.current = false;
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    dragVideoId.current = videoId;
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = (e) => {
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;
    if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
      isTouching.current = true;
    }
    if (isTouching.current) {
      if (arenaRef.current) {
        arenaRef.current.scrollLeft -= e.touches[0].clientX - lastPos.current.x;
        arenaRef.current.scrollTop -= e.touches[0].clientY - lastPos.current.y;
      }
    }
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e, video) => {
    const dx = lastPos.current.x - dragStart.current.x;
    const dy = lastPos.current.y - dragStart.current.y;
    if (!isTouching.current && Math.abs(dx) < dragThreshold && Math.abs(dy) < dragThreshold) {
      setSelectedVideo(video);
    }
    isTouching.current = false;
    dragVideoId.current = null;
  };

  // 미니맵 스크롤 상태
  const [scroll, setScroll] = useState({ left: 0, top: 0 });
  useEffect(() => {
    const handler = () => {
      if (!arenaRef.current) return;
      setScroll({
        left: arenaRef.current.scrollLeft,
        top: arenaRef.current.scrollTop,
      });
    };
    if (arenaRef.current) {
      arenaRef.current.addEventListener('scroll', handler);
    }
    return () => {
      if (arenaRef.current) {
        arenaRef.current.removeEventListener('scroll', handler);
      }
    };
  }, [videos.length]);



  return (
    <div className="mx-auto px-2 sm:px-4" style={{ position: 'relative', maxWidth: 1200, margin: '24px auto' }}>
      {/* 안내 문구 */}
      <div style={{
        position: 'absolute',
        top: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3000,
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        드래그로 스크롤하거나 영상을 클릭하여 상세 정보를 확인하세요
        </div>

      {/* Arena(스크롤 영역) */}
      <div
        ref={arenaRef}
        style={{
          width: '100%',
          height: '70vh',
          minHeight: 500,
          overflow: 'auto',
          background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.9))',
          borderRadius: 24,
          position: 'relative',
          cursor: isDragging.current || isTouching.current ? 'grabbing' : 'grab',
          scrollbarWidth: 'none',
          margin: '0 auto',
        }}
        className="hide-scrollbar"
      >
        {/* 영상들: packing absolute 배치 + 랭킹 뱃지 */}
        {positions.map(v => (
          <div
            key={v.id}
            style={{
              position: 'absolute',
              left: v.x,
              top: v.y,
              width: v.size,
              height: v.size,
              borderRadius: 10,
              overflow: 'hidden',
              background: '#222',
              cursor: 'pointer',
            }}
            onMouseDown={e => onMouseDown(e, v.id)}
            onDragStart={e => e.preventDefault()}
            onTouchStart={e => onTouchStart(e, v.id)}
            onTouchMove={onTouchMove}
            onTouchEnd={e => onTouchEnd(e, v)}
          >
            {/* 랭킹 숫자 뱃지 */}
            <div style={{
              position: 'absolute',
              top: 4,
              left: 4,
              zIndex: 10,
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 13,
              border: '1.5px solid #fff'
            }}>
              {v.rank}
            </div>
            <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} draggable={false} />
            <div style={{ padding: 2, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span>🏆 {v.arena_likes || 0}</span>
                <span>👤 {v.guest_likes || 0}</span>
              </div>
            </div>
          </div>
        ))}
        {/* Arena 스크롤바 숨김 (Webkit, Firefox) */}
        <style jsx global>{`
          .hide-scrollbar {
            scrollbar-width: none !important;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none !important;
          }
        `}</style>
      </div>

    </div>
  );
} 