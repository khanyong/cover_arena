import { supabaseAdmin, supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const dbClient = supabaseAdmin || supabase;

  switch (req.method) {
    case 'GET':
      try {
        // 차단된 채널 목록 가져오기
        const { data: blockedChannels, error } = await dbClient
          .from('coversong_blocked_channels')
          .select('*')
          .eq('is_active', true)
          .order('blocked_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching blocked channels:', error);
          return res.status(200).json({ blockedChannels: [] });
        }
        
        res.status(200).json({ blockedChannels: blockedChannels || [] });
      } catch (error) {
        console.error('Server error:', error);
        res.status(200).json({ blockedChannels: [] });
      }
      break;

    case 'POST':
      try {
        const { channel_name, channel_id, reason } = req.body;
        
        if (!channel_name && !channel_id) {
          return res.status(400).json({ error: 'Channel name or channel ID is required' });
        }

        // 이미 차단된 채널인지 확인
        let checkQuery = dbClient
          .from('coversong_blocked_channels')
          .select('*')
          .eq('is_active', true);
        
        // OR 조건으로 검색 (채널명 또는 채널ID가 일치하는 경우)
        if (channel_name && channel_id) {
          checkQuery = checkQuery.or(`channel_name.eq.${channel_name},channel_id.eq.${channel_id}`);
        } else if (channel_name) {
          checkQuery = checkQuery.eq('channel_name', channel_name);
        } else if (channel_id) {
          checkQuery = checkQuery.eq('channel_id', channel_id);
        }
        
        const { data: existing, error: checkError } = await checkQuery;
        
        if (checkError) {
          console.error('Error checking existing channel:', checkError);
        }

        if (existing && existing.length > 0) {
          return res.status(400).json({ error: 'Channel is already blocked' });
        }

        // 채널 차단 추가
        const insertData = {
          channel_name: channel_name || null,
          channel_id: channel_id || null,
          reason: reason || `채널 차단 - 관리자에 의해 차단됨`,
          blocked_by: req.body.user_id || null
        };
        
        console.log('Inserting blocked channel:', insertData);
        
        const { data, error } = await dbClient
          .from('coversong_blocked_channels')
          .insert(insertData)
          .select();

        if (error) {
          console.error('Error blocking channel:', error);
          return res.status(500).json({ 
            error: 'Failed to block channel',
            details: error.message,
            hint: error.hint 
          });
        }

        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
      }
      break;

    case 'DELETE':
      try {
        const { channel_name, channel_id } = req.body;
        
        if (!channel_name && !channel_id) {
          return res.status(400).json({ error: 'Channel name or channel ID is required' });
        }

        // 채널 차단 해제 (soft delete)
        let query = dbClient
          .from('coversong_blocked_channels')
          .update({ 
            is_active: false,
            unblocked_at: new Date().toISOString()
          })
          .eq('is_active', true);
        
        if (channel_name) {
          query = query.eq('channel_name', channel_name);
        } else if (channel_id) {
          query = query.eq('channel_id', channel_id);
        }
        
        const { error } = await query;

        if (error) {
          console.error('Error unblocking channel:', error);
          return res.status(500).json({ error: 'Failed to unblock channel' });
        }

        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}