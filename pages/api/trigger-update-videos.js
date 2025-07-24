export default async function handler(req, res) {
  // Authorization 로그 및 체크
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log('Authorization header:', authHeader);

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ code: 401, message: "Missing authorization header" });
  }

  try {
    const response = await fetch(
      "https://iklsghevdtqqkjuaympc.supabase.co/functions/v1/update-videos",
      { method: "POST" }
    );
    const text = await response.text();
    console.log('Supabase Edge Function raw response:', text);
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }
    res.status(response.ok ? 200 : 500).json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    res.status(500).json({ code: 500, message: error.message || "Internal Server Error" });
  }
}
