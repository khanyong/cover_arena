
import { supabaseAdmin } from '../../shared/lib/supabase'
import { searchVideosByTopic } from '../../lib/youtube'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { userId, selectedTopics, votingPeriod } = req.body

    if (!userId || !selectedTopics || selectedTopics.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
        // 1. Verify User is Admin (Check permissions)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('is_admin')
            .eq('id', userId)
            .single()

        if (profileError || !profile || !profile.is_admin) {
            return res.status(403).json({ message: 'Unauthorized: User is not an admin' })
        }

        if (!supabaseAdmin) {
            return res.status(500).json({ message: 'Server configuration error: supabaseAdmin is null' })
        }

        console.log('[API] Closing active competitions...')
        // 2. Close existing active competitions
        const { error: closeError } = await supabaseAdmin
            .from('coversong_competitions')
            .update({ status: 'ended' })
            .eq('status', 'active')

        if (closeError) {
            console.error('Failed to close active competitions:', closeError)
            return res.status(500).json({ message: 'Failed to close active competitions' })
        }

        // 3. Create new competition
        const currentStartTime = new Date().toISOString()
        const { data: compData, error: compError } = await supabaseAdmin
            .from('coversong_competitions')
            .insert({
                topic: selectedTopics.join(', '),
                start_time: currentStartTime,
                end_time: votingPeriod.endTime,
                status: 'active'
            })
            .select()
            .single()

        if (compError || !compData) {
            console.error('Failed to create competition:', compError)
            return res.status(500).json({ message: 'Failed to create competition' })
        }
        const competitionId = compData.id

        // 4. Link topics
        const topicRows = selectedTopics.map(topic => ({ competition_id: competitionId, topic }))
        const { error: topicError } = await supabaseAdmin
            .from('coversong_competition_topics')
            .insert(topicRows)

        if (topicError) {
            console.error('Failed to insert topics:', topicError)
            // Non-critical, continue
        }

        // 5. Scrape and insert videos
        let totalVideos = 0
        for (const topic of selectedTopics) {
            console.log(`[API] Scraping topic: ${topic}`)
            // Fetch safe 50 results to avoid timeout, client side did 100 but server might be faster or limited
            let videos = await searchVideosByTopic(topic, 200)
            videos = videos.slice(0, 100) // Keep top 100 relevant

            if (videos.length > 0) {
                const videoRows = videos.map(v => ({
                    id: v.id,
                    title: v.title,
                    channel: v.channel,
                    thumbnail: v.thumbnail,
                    youtube_id: v.youtubeId,
                    views: v.views,
                    likes: v.likes,
                    arena_likes: 0,
                    topic,
                    competition_id: competitionId
                }))

                const { error: videoError } = await supabaseAdmin
                    .from('coversong_videos')
                    .upsert(videoRows, { onConflict: ['id'] })

                if (videoError) {
                    console.error(`Failed to insert videos for topic ${topic}:`, videoError)
                } else {
                    totalVideos += videoRows.length
                }
            }
        }

        // 6. Update Main Title Config
        const newMainTitle = selectedTopics.join(', ')
        const { error: configError } = await supabaseAdmin
            .from('coversong_config')
            .upsert({ key: 'main_title', value: newMainTitle }, { onConflict: 'key' })

        if (configError) {
            console.error('Failed to update main title:', configError)
        }

        return res.status(200).json({
            success: true,
            message: 'Competition started successfully',
            competitionId,
            totalVideos,
            newMainTitle
        })

    } catch (error) {
        console.error('API Error:', error)
        return res.status(500).json({ message: 'Internal server error: ' + error.message })
    }
}
