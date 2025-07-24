export default async function handler(req, res) {
  console.log('Authorization header:', req.headers.authorization);
  // CRON_SECRET 체크
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ code: 401, message: "Missing authorization header" });
  }

  const response = await fetch(
    "https://iklsghevdtqqkjuaympc.supabase.co/functions/v1/update-videos",
    { method: "POST" }
  );
  const data = await response.json();
  res.status(response.ok ? 200 : 500).json(data);
}
