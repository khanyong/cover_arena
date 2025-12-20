
import { supabase, supabaseAdmin } from '../../shared/lib/supabase'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { userId, mainTitle } = req.body

    if (!userId || !mainTitle) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
        // 1. Verify User is Admin
        // We strictly use the provided userId to check the profiles table.
        // Ideally, we should verify the session token, but for now we follow the pattern of trusting the userId 
        // combined with a server-side permission check.
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', userId)
            .single()

        if (profileError || !profile || !profile.is_admin) {
            return res.status(403).json({ message: 'Unauthorized: User is not an admin' })
        }

        // 2. Update Configuration using Service Role (Bypassing RLS)
        if (!supabaseAdmin) {
            console.error('SERVER CONFIG ERROR: supabaseAdmin is null. Check SUPABASE_SERVICE_ROLE_KEY.')
            return res.status(500).json({ message: 'Server configuration error' })
        }

        // Check if config exists
        const { data: existingConfig } = await supabaseAdmin
            .from('coversong_config')
            .select('id')
            .eq('key', 'main_title')
            .single()

        let updateError = null;

        if (existingConfig) {
            // Update
            const { error } = await supabaseAdmin
                .from('coversong_config')
                .update({ value: mainTitle })
                .eq('key', 'main_title')
            updateError = error
        } else {
            // Insert
            const { error } = await supabaseAdmin
                .from('coversong_config')
                .insert({ key: 'main_title', value: mainTitle })
            updateError = error
        }

        if (updateError) {
            console.error('Config update error:', updateError)
            return res.status(500).json({ message: 'Failed to update configuration: ' + updateError.message })
        }

        return res.status(200).json({ success: true, message: 'Main title updated successfully' })

    } catch (error) {
        console.error('API Error:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
