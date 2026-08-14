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

const vol3ActsDetailed = [
  {
    number: 0,
    title: "Prologue (Zero Contact)",
    summary: `Inside the classified desert laboratory that vanished at the end of Book II, the research team realizes their horrifying situation. There is no explosion, no death—only a complete severance from the parent universe. A final, faint transmission manages to pierce the closing topological boundary before the connection drops to absolute zero.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "The Last Transmission", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Dialogue]**\n"We're still here."`)] 
    }]
  },
  {
    number: 1,
    title: "Act 1 (Topological Deterrence)",
    summary: `A terrifying new military doctrine is born: Topological Deterrence. There is no longer a need to kill millions with nuclear warheads. Instead, nations threaten to close the topological phase around enemy cities, entirely isolating them from the universe. In the face of this existential dread, an aging Professor Sterling delivers a final, cynical observation to Ian.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "Topological Deterrence", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Dialogue]**\nSterling: "You wanted truth without authority. Now truth has become the ultimate authority."`)] 
    }]
  },
  {
    number: 2,
    title: "Act 2 (The Severed World)",
    summary: `A massive military base, along with its surrounding terrain, completely vanishes. Analysis reveals a chilling fact: time is still flowing normally inside the severed topological bubble. The inhabitants are alive, trapped in a permanent, doorless prison. Ian's mother recognizes the geopolitical maneuvering behind the incident—it is 'False Flag 2.0.' The very methodology once used to erase a single individual (Ian's father) has evolved into a mechanism to erase entire territories to spark a global war.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "False Flag 2.0", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Elements]**\n* The terrifying reality of the severed zone (A prison of existence).\n* The evolution of the false flag operation on a macroscopic scale.`)] 
    }]
  },
  {
    number: 3,
    title: "Act 3 (False Flag 2.0)",
    summary: `The world stands on the brink of the 'Second Sarajevo.' As two superpowers prepare for all-out war, both point the finger at Ian, suspecting him to be the architect of the attack. However, Ian analyzes the mathematical signature of the spatial severance and realizes it is not his current code. It is a corrupted, weaponized mutation of the original 'Exact Cancellation' algorithm that Sterling stole from Geneva years ago. With the global command system counting down, there are only seventeen minutes left until mutually assured retaliation.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "The Second Sarajevo", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Elements]**\n* A 17-minute ticking clock to global topological retaliation.\n* The return of the stolen Geneva code.`)] 
    }]
  },
  {
    number: 4,
    title: "Act 4 (Crossing the Cut)",
    summary: `With the clock ticking down, Ian and Sarah take an unprecedented risk. Using an anti-phase topological tube, they become the first humans to physically infiltrate a 'Closed Manifold'—the severed space itself. Inside, Sarah uncovers a breathtaking mathematical truth bridging destruction and creation. Risking his own existence, Ian manually executes a topological reconnection, tearing the manifold back open to the parent universe, exposing the false flag, and halting the war at the final second.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "Crossing the Cut", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Dialogue]**\nSarah: "The math for a prison and the math for Genesis... they are the exact same equation."`)] 
    }]
  },
  {
    number: 5,
    title: "Epilogue (A Universe with No Door)",
    summary: `The immediate war is averted, but the very first small test space that was severed in Book II cannot be saved. Ian discovers that the isolated manifold has evolved too far; its internal topology is rapidly expanding, making reconnection physically impossible. It is no longer just an isolated room.`,
    chapters: [{ 
      number: 1, 
      title: "Chapter 1", 
      synopsis: "Evolution of the Manifold", 
      paragraphs: [createParagraph('v_en-0.0.1', `**[Key Dialogue]**\nIan: "We thought we built a prison... We built a universe."`)] 
    }]
  }
];

async function main() {
  const { data: novels, error } = await supabase.from('novel_documents').select('*');
  if (error) throw error;
  
  let vol3en = novels.find(n => n.id === 'quantum-vibration-vol3-en');
  if (vol3en) {
    let data3 = { 
      ...vol3en.data, 
      acts: vol3ActsDetailed
    };
    await supabase.from('novel_documents').update({ data: data3 }).eq('id', 'quantum-vibration-vol3-en');
    console.log("Updated Book 3 EN with detailed synopses and dialogue");
  } else {
    console.log("Book 3 EN not found!");
  }
}

main().catch(console.error);
