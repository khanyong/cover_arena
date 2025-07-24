export default async function handler(req, res) {
  // CRON_SECRET 체크
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ code: 401, message: "Missing authorization header" });
  }

  const response = await fetch(
    "https://iklsghevdtqqkjuaympc.supabase.co/functions/v1/update-videos",
    { method: "POST" }
  );
  const data = await response.json();
  res.status(response.ok ? 200 : 500).json(data);
}
