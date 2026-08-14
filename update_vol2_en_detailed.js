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

const vol2ActsDetailed = [
  {
    number: 0,
    title: "Prologue (The Empty Urn)",
    summary: `While organizing old documents, Ian's mother discovers a terrifying anomaly in Yoo Ji-man's cremation records from fifteen years ago. The official logs show that the sealed urn was transported away two full hours *before* the cremation was officially completed. There are no DNA verification records. The foundation of their past is shattered.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "The Empty Urn", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Dialogue]**\n"Then whose ashes did I bury?"`)] 
    }]
  },
  {
    number: 1,
    title: "Act 1 (After the End of the World)",
    summary: `The world has survived the Cosmic Quake. The tensor geometry that powered the *Odysseus* project has now become the absolute core of the global economy, revolutionizing energy and transport. In the midst of this new world order, a disgraced and fallen Professor Sterling seeks out Ian. Sterling delivers a chilling warning about the true danger of Ian's equations.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "Sterling's Warning", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Dialogue]**\nSterling: "You think I was afraid of your theory because it was wrong, Ian. I wasn't. I was afraid because I knew eventually, someone would miniaturize it."`)] 
    }]
  },
  {
    number: 2,
    title: "Act 2 (The Ghost in the System)",
    summary: `Sterling's warning becomes reality. A classified black program belonging to a powerful nation has successfully shrunk the massive Odysseus phase-coils down to a few meters. Code-named 'NEEDLE,' it is a weapon capable of instantaneously erasing the distance between a warhead and its target, rendering all global air defenses obsolete. Concurrently, Ian hacks into highly classified archives and discovers that his father did not commit suicide; he was administratively deleted and transferred to a shadow black site known as 'ORPHEUS.'`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "NEEDLE and ORPHEUS", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Elements]**\n* Weaponization of geometry (Miniaturization).\n* Discovery of the 'ORPHEUS' black site.`)] 
    }]
  },
  {
    number: 3,
    title: "Act 3 (Geometry Has No Flag)",
    summary: `A highly secure military facility is annihilated from the inside out without a single missile or perimeter breach—an 'Invisible Strike.' Ian's mother analyzes the procurement and operational patterns of the strike, realizing it is the exact same 'False Flag' methodology used to frame her husband decades ago. Driven by this revelation, Ian physically infiltrates the ORPHEUS black site and finally comes face-to-face with his aged father.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "Invisible Strike", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Dialogue]**\nYoo Ji-man: "You became an architect after all."`)] 
    }]
  },
  {
    number: 4,
    title: "Act 4 (Who Owns Spacetime?)",
    summary: `The truth of the past is fully unveiled. Yoo Ji-man was a core witness who could have exposed a massive state-sponsored false flag operation. Instead of killing him, the state erased his existence and kept him imprisoned. Faced with the ugly reality of human power, Ian's father offers a profound piece of advice. Realizing the danger of national monopolies, Ian refuses to hand the spatial technology over to any single government. Instead, he implements a decentralized, multinational 'Spacetime Commons' to share the power.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "Spacetime Commons", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Dialogue]**\nYoo Ji-man: "You spent your life searching for a universe men couldn't manipulate. But the problem was never the universe, Ian."`)] 
    }]
  },
  {
    number: 5,
    title: "Epilogue (The Missing Room)",
    summary: `Ian's attempt at a balanced 'Spacetime Commons' comes too late. An unknown rogue entity successfully steals a modified, catastrophic formula: the 'Topological Severance' code. Instead of bridging distance to zero, this code reduces spatial connectivity to absolute zero. Somewhere in an isolated desert, a top-secret laboratory vanishes. There is no explosion, no flash of light. Only a perfectly smooth, 10x10-meter spherical void remains. The room hasn't been destroyed; it has been completely and permanently severed from our universe. *The seed for Book III is planted.*`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "Topological Severance", 
      paragraphs: [createParagraph('v_en-0.0.1', `(Enter Epilogue content here)`)] 
    }]
  }
];

async function main() {
  const { data: novels, error } = await supabase.from('novel_documents').select('*');
  if (error) throw error;
  
  let vol2en = novels.find(n => n.id === 'quantum-vibration-vol2-en');
  if (vol2en) {
    let data2 = { 
      ...vol2en.data, 
      acts: vol2ActsDetailed
    };
    await supabase.from('novel_documents').update({ data: data2 }).eq('id', 'quantum-vibration-vol2-en');
    console.log("Updated Book 2 EN with detailed synopses and dialogue");
  } else {
    console.log("Book 2 EN not found!");
  }
}

main().catch(console.error);
