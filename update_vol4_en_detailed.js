import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createParagraph = (ver, content) => {
  const id = `p-${crypto.randomUUID()}`;
  return {
    id: id,
    activeVersion: ver,
    versions: {
      [ver]: {
        version: ver,
        content: content,
        note: "Key elements / Dialogue",
        createdAt: new Date().toISOString().substring(0, 16)
      }
    },
    aiPrompts: []
  };
};

const vol4ActsDetailed = [
  {
    number: 0,
    title: "Prologue (The First Grain)",
    summary: `Years later, the seed planted at the end of Book I finally blossoms. Ian and Sarah successfully stabilize a topological winding in the spatial fluid, proving that tensor energy can be converted directly into mass (E_tensor -> mc^2). In a blinding flash within a vacuum chamber, humanity synthesizes its very first physical matter from the void: a single hydrogen atom.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "The First Grain", 
      paragraphs: [createParagraph('v_en-0.0.1', `(Enter Prologue content here)`)] 
    }]
  },
  {
    number: 1,
    title: "Act 1 (The Loom of Matter)",
    summary: `Matter is definitively proven to be nothing more than a stable geometric knot of space. However, the energy conversion efficiency is staggeringly low—this is not a magical, infinite resource generator. Soon, a profound mathematical breakthrough occurs: subatomic particles and the 'Severed Universes' discovered in Book III are proven to share the exact same mathematical fractal topology, differing only in scale.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "The Loom of Matter", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Elements]**\n* The synthesis of matter from spatial geometry.\n* The fractal revelation bridging quantum particles and macroscopic universes.`)] 
    }]
  },
  {
    number: 2,
    title: "Act 2 (Building a Universe)",
    summary: `The 'Genesis Engine' is constructed. Expansionists, led by Marcus Vance, argue that instead of fighting over the scorched remains of Earth, humanity should manufacture and expand into infinite new universes—'Edens.' By carefully calibrating the initial cosmological constants, humanity successfully and intentionally creates its first 'Daughter Universe.' While the world erupts in celebration at becoming gods, Ian is consumed by a profound, existential dread.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "Building a Universe", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Elements]**\n* The first intentional nucleation of a Baby Universe.\n* The shifting paradigm from survival to infinite expansion.`)] 
    }]
  },
  {
    number: 3,
    title: "Act 3 (The Creator's Paradox)",
    summary: `Mathematical models predict the potential for long-term complexity—the capacity for life—within the new baby universe. Overnight, laboratory ethics morphs into the theology of cosmology. Concurrently, powerful nations propose using the Genesis technology to create inescapable pocket-universes to permanently exile criminals and rogue AIs, repeating the sins of the past. Witnessing this, Ian's mother delivers her final, grounding counsel, closing her moral arc across the series.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "The Creator's Paradox", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Dialogue]**\nMother: "Your father was destroyed because powerful men decided one human being could be treated as a variable. Do not become powerful enough to treat a universe the same way."`)] 
    }]
  },
  {
    number: 4,
    title: "Act 4 (Architects of Genesis)",
    summary: `The final conflict erupts over the control of the Genesis technology. Ian realizes that the 'Umbilical Cord'—the topological tube tethering the baby universe to Earth—allows for observation and resource extraction, but it also serves as a chain of eternal subjugation. The man who spent his entire life striving to calculate and control every variable must now face his most agonizing choice: to save the universe he created from human greed, he must surrender all control and let it fall into an eternally unknowable state.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "Architects of Genesis", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Elements]**\n* The geopolitical war over the ownership of creation.\n* The philosophical paradox of the Umbilical Cord.`)] 
    }]
  },
  {
    number: 5,
    title: "Final Epilogue (The Compass)",
    summary: `At the main console, Ian executes the final, irreversible command: \`[Sever]\`. The umbilical topology dissolves, granting the baby universe absolute and complete independence. Standing in the silent control room, Ian holds his late father's silver drafting compass. He finally understands its true purpose: a compass is not just for drawing space; it is for drawing a boundary—to determine the absolute limits of one's own control. He gently closes the compass. The absolute silence and lack of any returning signal from the new universe is not a failure; it is the breathtaking proof of its true freedom.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "The Compass", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Dialogue]**\nIan: "I must let it go."`)] 
    }]
  }
];

async function main() {
  const { data: novels, error } = await supabase.from('novel_documents').select('*');
  if (error) throw error;
  
  let vol4en = novels.find(n => n.id === 'quantum-vibration-vol4-en');
  if (vol4en) {
    let data4 = { 
      ...vol4en.data, 
      acts: vol4ActsDetailed
    };
    await supabase.from('novel_documents').update({ data: data4 }).eq('id', 'quantum-vibration-vol4-en');
    console.log("Updated Book 4 EN with detailed synopses and dialogue");
  } else {
    console.log("Book 4 EN not found!");
  }
}

main().catch(console.error);
