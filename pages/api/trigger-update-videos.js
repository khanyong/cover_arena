export default async function handler(req, res) {
  const response = await fetch(
    "https://iklsghevdtqqkjuaympc.supabase.co/functions/v1/update-videos",
    { method: "POST" }
  );
  const data = await response.json();
  res.status(response.ok ? 200 : 500).json(data);
}
