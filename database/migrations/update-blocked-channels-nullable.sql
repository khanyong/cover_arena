-- channel_name을 nullable로 변경하고 UNIQUE 제약 제거
ALTER TABLE coversong_blocked_channels 
DROP CONSTRAINT IF EXISTS coversong_blocked_channels_channel_name_key;

ALTER TABLE coversong_blocked_channels 
ALTER COLUMN channel_name DROP NOT NULL;

-- channel_id에도 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_blocked_channels_channel_id ON coversong_blocked_channels(channel_id);

-- 채널명과 채널ID 조합에 대한 부분 유니크 인덱스 생성
-- (둘 다 NULL이 아닌 경우에만 중복 방지)
CREATE UNIQUE INDEX IF NOT EXISTS idx_blocked_channels_name_unique 
ON coversong_blocked_channels(channel_name) 
WHERE channel_name IS NOT NULL AND is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_blocked_channels_id_unique 
ON coversong_blocked_channels(channel_id) 
WHERE channel_id IS NOT NULL AND is_active = true;

-- 최소 하나는 있어야 한다는 체크 제약 추가
ALTER TABLE coversong_blocked_channels 
ADD CONSTRAINT check_channel_identifier 
CHECK (channel_name IS NOT NULL OR channel_id IS NOT NULL);

SELECT 'Blocked channels table updated successfully!' as message;