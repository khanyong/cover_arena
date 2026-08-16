import { readFileSync } from 'fs';
const data = readFileSync('/Users/M2proMini/Documents/khanyong_projects/components/NovelPlatform/novelData.ts', 'utf8');

const regex = /title:\s*['"]제(\d+)막.*?['"]/g;
let match;
while ((match = regex.exec(data)) !== null) {
  console.log('Act', match[1]);
}
