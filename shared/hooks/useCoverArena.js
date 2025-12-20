import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

// 1. 메인 타이틀 (Config)
export const useMainTitle = () => {
    return useQuery({
        queryKey: ['mainTitle'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('coversong_config')
                .select('value')
                .eq('key', 'main_title')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            if (error) throw error;
            return data?.value || '';
        }
    });
};

// 2. 주제 제안 목록
export const useSuggestedTopics = () => {
    return useQuery({
        queryKey: ['suggestedTopics'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('coversong_topics')
                .select('*')
                .order('votes_count', { ascending: false });
            if (error) throw error;
            return data || [];
        }
    });
};

// 3. 현재 진행중인 Competition (Admin용 - 최신순)
export const useCurrentCompetition = () => {
    return useQuery({
        queryKey: ['currentCompetition'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('coversong_competitions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            // PGRST116: 결과 없음 (정상)
            if (error && error.code !== 'PGRST116') throw error;
            return data || null;
        }
    });
};

// 3-1. 활성화된 Competition (Consumer용 - status='active')
export const useActiveCompetition = () => {
    return useQuery({
        queryKey: ['activeCompetition'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('coversong_competitions')
                .select('*')
                .eq('status', 'active')
                .order('start_time', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data || null;
        }
    });
};

// 4. Competition 히스토리
export const useCompetitionHistory = () => {
    return useQuery({
        queryKey: ['competitionHistory'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('coversong_competitions')
                .select('*')
                .eq('status', 'ended')
                .order('updated_at', { ascending: false })
                .limit(20);
            if (error) throw error;
            return data || [];
        }
    });
};

// 5. 차단된 영상 목록
export const useBlockedVideos = () => {
    return useQuery({
        queryKey: ['blockedVideos'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('coversong_blocked_videos')
                .select('*')
                .eq('is_active', true)
                .order('blocked_at', { ascending: false });
            if (error) throw error;
            return data || [];
        }
    });
};

// 6. 차단된 채널 목록
export const useBlockedChannels = () => {
    return useQuery({
        queryKey: ['blockedChannels'],
        queryFn: async () => {
            const response = await fetch('/api/blocked-channels');
            if (!response.ok) throw new Error('채널 차단 목록 로드 실패');
            const data = await response.json();
            return data.blockedChannels || [];
        }
    });
};

// 7. 회원 목록
export const useUsers = (filter = 'all') => {
    return useQuery({
        queryKey: ['users', filter],
        queryFn: async () => {
            let query = supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (filter !== 'all') {
                query = query.eq('status', filter);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        }
    });
};

// 8. 최종 결과 계산 
export const useFinalResults = (competitionId) => {
    return useQuery({
        queryKey: ['finalResults', competitionId],
        queryFn: async () => {
            if (!competitionId) return [];

            // 차단 목록 가져오기 (API 호출은 느릴 수 있으므로 여기서는 생략하거나 별도 처리)
            // consumer 쪽에서는 API로 가져오지만 admin은 DB 접근 가능.
            // 여기서는 단순화하여 videos 조회

            const { data, error } = await supabase
                .from('coversong_videos')
                .select('*')
                .eq('competition_id', competitionId)
                .order('site_score', { ascending: false })
                .limit(100);

            if (error) throw error;
            return data.map((video, index) => ({
                ...video,
                final_rank: index + 1
            }));
        },
        enabled: !!competitionId
    });
};

// 9. 최근 발표된 Competition 확인
export const useAnnouncedCompetition = () => {
    return useQuery({
        queryKey: ['announcedCompetition'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('coversong_competitions')
                .select('*')
                .eq('status', 'ended')
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();

            if (data && !error) {
                const announcementTime = new Date(data.updated_at);
                const now = new Date();
                const hoursDiff = (now - announcementTime) / (1000 * 60 * 60);
                if (hoursDiff <= 24) return data;
            }
            return null;
        }
    });
};

// 10. Competition 비디오 목록 (Consumer Main 로직)
export const useCompetitionVideos = (competitionId) => {
    return useQuery({
        queryKey: ['competitionVideos', competitionId],
        queryFn: async () => {
            if (!competitionId) return [];

            // 차단 목록 (API)
            let blockedIds = [];
            try {
                const response = await fetch('/api/blocked-videos');
                const data = await response.json();
                blockedIds = data.blockedIds || [];
            } catch (error) {
                console.error('Failed to fetch blocked videos:', error);
            }

            let query = supabase
                .from('coversong_videos_filtered')
                .select('*')
                .eq('competition_id', competitionId)
                .order('rank', { ascending: true });

            let videos = [];
            if (blockedIds.length > 0) {
                const { data, error } = await query.not('youtube_id', 'in', `(${blockedIds.map(id => `"${id}"`).join(',')})`);
                if (error) throw error;
                videos = data || [];
            } else {
                const { data, error } = await query;
                if (error) throw error;
                videos = data || [];
            }

            // 순위 재계산 로직
            const processedVideos = videos.map((video, index) => {
                const displayRank = index + 1;
                let displayPreviousRank = null;

                if (video.previous_rank != null) {
                    const allPreviousRanks = videos
                        .filter(v => v.previous_rank != null)
                        .map(v => v.previous_rank)
                        .sort((a, b) => a - b);
                    const idx = allPreviousRanks.indexOf(video.previous_rank);
                    if (idx !== -1) displayPreviousRank = idx + 1;
                }

                return {
                    ...video,
                    displayRank,
                    displayPreviousRank,
                    originalRank: video.rank,
                    originalPreviousRank: video.previous_rank
                };
            });

            return processedVideos;
        },
        enabled: !!competitionId
    });
};
