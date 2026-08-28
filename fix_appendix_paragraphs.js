require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  for (const slug of ['quantum-vibration-novel', 'quantum-vibration-novel-en']) {
    const { data } = await supabase.from('novel_documents').select('data').eq('id', slug).single();
    if (!data) continue;
    
    const appendix = data.data.acts[data.data.acts.length - 1];
    if (appendix.title !== 'APPENDIX') continue;

    for (let c = 0; c < appendix.chapters.length; c++) {
      const chapter = appendix.chapters[c];
      const scene = chapter.scenes[0];
      const oldParas = scene.paragraphs;
      const newParas = [];

      if (chapter.title.includes('Appendix A') || chapter.title.includes('Appendix B')) {
        // Merge every two paragraphs
        for (let i = 0; i < oldParas.length; i++) {
          const p1 = oldParas[i];
          if (p1.versions['v2.0'].content === '---') continue;
          
          if (i + 1 < oldParas.length && oldParas[i+1].versions['v2.0'].content !== '---') {
            const p2 = oldParas[i + 1];
            p1.versions['v2.0'].content = p1.versions['v2.0'].content + '\n\n' + p2.versions['v2.0'].content;
            newParas.push(p1);
            i++; // skip next
          } else {
            newParas.push(p1);
          }
        }
      } else if (chapter.title.includes('Appendix C')) {
        // Merge all paragraphs into one for references
        const p1 = oldParas[0];
        let mergedContent = p1.versions['v2.0'].content;
        for (let i = 1; i < oldParas.length; i++) {
            mergedContent += '\n\n' + oldParas[i].versions['v2.0'].content;
        }
        p1.versions['v2.0'].content = mergedContent;
        newParas.push(p1);
      }
      
      scene.paragraphs = newParas;
    }
    
    await supabase.from('novel_documents').update({ data: data.data }).eq('id', slug);
    console.log('Fixed paragraphs for', slug);
  }
}
run();
