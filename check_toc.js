import fs from 'fs';

const file = fs.readFileSync('/Users/M2proMini/Documents/khanyong_projects/pages/novel/[...slug].tsx', 'utf-8');
const lines = file.split('\n');

for (let i = 728; i <= 745; i++) {
  console.log(lines[i]);
}
