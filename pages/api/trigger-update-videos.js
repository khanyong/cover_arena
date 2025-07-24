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
