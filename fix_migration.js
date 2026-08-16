import fs from 'fs';
const path = '/Users/M2proMini/Documents/khanyong_projects/pages/novel/[...slug].tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `                if (ch.paragraphs && ch.paragraphs.length > 0 && (!ch.scenes || ch.scenes.length === 0)) {
                  ch.scenes = [{
                    id: \`scene-\${act.number}-\${ch.number}-1\`,
                    number: 1,
                    title: \`SCENE 1\`,
                    paragraphs: ch.paragraphs
                  }];
                  delete ch.paragraphs;
                }`;

const replacement = `                if (ch.paragraphs && ch.paragraphs.length > 0 && (!ch.scenes || ch.scenes.length === 0)) {
                  ch.scenes = ch.paragraphs.map((p, idx) => ({
                    id: \`scene-\${act.number}-\${ch.number}-\${idx + 1}\`,
                    number: idx + 1,
                    title: \`SCENE \${idx + 1}\`,
                    paragraphs: [p]
                  }));
                  delete ch.paragraphs;
                }`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content);
  console.log("Migration logic patched successfully!");
} else {
  console.log("Target not found!");
}
