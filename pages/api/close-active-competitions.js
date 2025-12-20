
import { supabaseAdmin } from '../../shared/lib/supabase'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { userId } = req.body

    if (!userId) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
        // 1. Verify User is Admin (Optional but recommended, relying on userId passed from client)
        // For tighter security, you'd check a session token.

        // 2. Update all 'active' competitions to 'ended'
        if (!supabaseAdmin) {
            console.error('SERVER CONFIG ERROR: supabaseAdmin is null. Check SUPABASE_SERVICE_ROLE_KEY.')
            return res.status(500).json({ message: 'Server configuration error' })
        }

        const { error: updateError } = await supabaseAdmin
            .from('coversong_competitions')
            .update({ status: 'ended' })
            .eq('status', 'active')

        if (updateError) {
            console.error('Failed to close active competitions:', updateError)
            return res.status(500).json({ message: 'Failed to close active competitions: ' + updateError.message })
        }

        return res.status(200).json({ success: true, message: 'All active competitions closed successfully' })

    } catch (error) {
        console.error('API Error:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
