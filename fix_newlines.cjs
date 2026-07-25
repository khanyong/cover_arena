const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// replace literal '\\n' with actual '\n' (which in string form is '\\n', meaning a single backslash followed by n)
// Wait, if it is currently written as "\\n" in the file, it means there are two backslashes.
// We want to replace it with a single backslash followed by n, which in JS string literal is '\\n'.
content = content.replace(/\\\\n/g, '\\n');

fs.writeFileSync(targetPath, content);
console.log('Fixed literal newlines in novelData.ts');
