const jwt = require('jsonwebtoken');
const secret = 'YOUR_LEGACY_JWT_SECRET';

const token = jwt.sign(
  {
    role: 'service_role', // 또는 'authenticated'
    // 필요하다면 sub, exp 등 추가
  },
  secret,
  { algorithm: 'HS256', expiresIn: '1h' }
);

console.log(token);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  // ...이하 생략...
}
