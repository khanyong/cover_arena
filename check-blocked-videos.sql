-- 차단된 영상 확인
SELECT 
  bv.youtube_id,
  bv.reason,
  bv.created_at,
  v.title,
  v.rank,
  v.site_score
FROM coversong_blocked_videos bv
LEFT JOIN coversong_videos v ON v.youtube_id = bv.youtube_id AND v.competition_id = 5
WHERE bv.is_active = true
  AND v.rank <= 10
ORDER BY v.rank;

-- 특히 상위 3개 확인
SELECT 
  youtube_id,
  reason,
  created_at
FROM coversong_blocked_videos 
WHERE youtube_id IN ('yebNIHKAC4A', 'dFMXEnsuY_Y', 'QGsevnbItdU', 'cWppAbqm9I8')
  AND is_active = true;