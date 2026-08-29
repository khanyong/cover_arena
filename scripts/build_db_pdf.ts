import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const slug = process.argv[2] || 'quantum-vibration-novel-en';

async function main() {
  console.log('Fetching novel data from DB...');
  const { data: mainDocs, error: mainErr } = await supabase
    .from('novel_documents')
    .select('*')
    .eq('id', slug);

  if (mainErr || !mainDocs || mainDocs.length === 0) {
    console.error('Novel not found', mainErr);
    process.exit(1);
  }

  const novel = mainDocs[0].data;

  const { data: actDocs, error: actErr } = await supabase
    .from('novel_documents')
    .select('*')
    .like('id', `${slug}-act-%`);

  if (actErr) {
    console.error('Error fetching acts', actErr);
  } else if (actDocs) {
    for (const doc of actDocs) {
      const actNum = parseInt(doc.id.split('-act-')[1]);
      if (!novel.acts) novel.acts = [];
      novel.acts[actNum] = doc.data;
    }
  }

  console.log('Assembling markdown...');
  
  let markdown = `---
toc: true
toc-title: "Contents"
geometry:
  - top=1in
  - bottom=1in
  - left=1.25in
  - right=1.25in
fontfamily: mathptmx
fontsize: 11pt
header-includes:
  - \\usepackage{fancyhdr}
  - \\pagestyle{plain}
  - \\usepackage[utf8]{inputenc}
  - \\usepackage{amsmath}
  - \\usepackage{kotex}
---

\\newpage

`;

  novel.acts?.forEach((act: any) => {
    // Skip Act 1 as it is the Title Page / Copyright which is handled by cover.tex
    if (act.number === 1) return;

    if (act.number > 0 && act.number <= 9 && act.title && !act.title.toLowerCase().includes('unknown act')) {
      markdown += `# ${act.title}\n\n`;
    }
    
    act.chapters?.forEach((ch: any) => {
      if (ch.title && !ch.title.toLowerCase().includes('front cover') && !ch.title.toLowerCase().includes('opening')) {
         markdown += `## ${ch.title}\n\n`;
      }
      
      ch.scenes?.forEach((scene: any) => {
        if (scene.number > 1) {
          markdown += `\n* * *\n\n`;
        }
        
        scene.paragraphs?.forEach((p: any) => {
          let text = '';
          if (p.versions && p.activeVersion && p.versions[p.activeVersion]) {
             text = p.versions[p.activeVersion].content || '';
          }
          // Fallback just in case
          if (!text && p.text) text = p.text;

          if (text && text.trim().length > 0) {
            markdown += `${text.trim()}\n\n`;
          }
        });
      });
      markdown += `\n\\newpage\n\n`;
    });
  });

  const buildDir = path.join(process.cwd(), 'build');
  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

  const combinedMdPath = path.join(buildDir, 'combined_db.md');
  const coverTexPath = path.join(buildDir, 'cover.tex');
  const backcoverTexPath = path.join(buildDir, 'backcover.tex');
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const pdfPath = path.join(publicDir, 'The_Resonance_of_Space_Latest.pdf');

  fs.writeFileSync(combinedMdPath, markdown, 'utf-8');

  // Copy cover/backcover generation from scratch/build_pdf.py
  const cover_tex = `\\begin{titlepage}
\\begin{center}
\\vspace*{5cm}
{\\Huge \\textbf{THE RESONANCE\\\\[0.2cm] OF SPACE}}\\\\[1.5cm]
{\\Large ARCHITECTS OF SPACETIME}\\\\[1cm]
{\\large A HARD SCIENCE-FICTION NOVEL}\\\\[0.5cm]
{\\small Based on \\textit{Mechanics of Spatial Vibration I--V}}\\\\[0.5cm]
{\\small \\textsc{A NOVEL OF TOPOLOGY, MEMORY, AND THE FRACTURE OF REALITY}}\\\\[1.5cm]
\\rule{10cm}{0.4pt}\\\\[1cm]
{\\Large \\textbf{KWANG YONG YOO}}
\\end{center}
\\end{titlepage}

\\newpage
\\vspace*{5cm}
\\begin{center}
{\\Huge \\textbf{The Resonance of Space}}\\\\[1cm]
{\\Large Architects of Spacetime}\\\\[1cm]
{\\Large Kwang Yong Yoo}\\\\[1cm]
A hard science-fiction novel based on \\textit{Mechanics of Spatial Vibration I--V}\\\\[1cm]
Copyright \\copyright{} Kwang Yong Yoo. All rights reserved.\\\\[1cm]
Printed manuscript copy
\\end{center}
\\newpage
`;
  
  const backcover_tex = `\\newpage
\\vspace*{5cm}
\\begin{center}
{\\LARGE \\textbf{BACK COVER}}\\\\[1.5cm]
{\\Large \\textbf{When space begins to remember, reality becomes the equation.}}\\\\[1cm]
After a hidden catastrophe beneath Geneva, an exiled physicist and a fugitive engineer uncover a cosmic fault line moving toward Earth. To survive, they must persuade the machinery of capital to fund an impossible architecture before the local metric of reality comes apart.\\\\[1.5cm]
\\rule{10cm}{0.4pt}\\\\[1cm]
{\\Large KWANG YONG YOO}
\\end{center}
\\newpage
`;

  fs.writeFileSync(coverTexPath, cover_tex, 'utf-8');
  fs.writeFileSync(backcoverTexPath, backcover_tex, 'utf-8');

  const pandocCmd = [
    'pandoc',
    combinedMdPath,
    '-o', pdfPath,
    '--pdf-engine=xelatex',
    `--include-before-body=${coverTexPath}`,
    `--include-after-body=${backcoverTexPath}`,
    '--toc',
    '--toc-depth=3'
  ].join(' ');

  console.log(`Running pandoc command: ${pandocCmd}`);
  try {
    execSync(pandocCmd, { stdio: 'inherit' });
    console.log(`PDF successfully built at ${pdfPath}`);
  } catch (err) {
    console.error('Pandoc failed!', err);
    process.exit(1);
  }
}

main();
