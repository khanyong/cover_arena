import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createEmptyParagraph = (ver) => {
  const id = `p-${crypto.randomUUID()}`;
  return {
    id: id,
    activeVersion: ver,
    versions: {
      [ver]: {
        version: ver,
        content: "(Enter content here)",
        note: "Draft",
        createdAt: new Date().toISOString().substring(0, 16)
      }
    },
    aiPrompts: []
  };
};

const vol2ActsEn = [
  {
    number: 0,
    title: "Prologue (The Empty Urn)",
    summary: "Suspicion regarding the father's cremation records discovered by the mother. The urn was already transported two hours before cremation. \"Then whose ashes did I bury?\"",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "Discovery of Past Records", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 1,
    title: "Act 1 (After the End of the World)",
    summary: "The Odysseus technology becomes the core of the economy after the space quake. The fallen Sterling warns Ian. \"I wasn't afraid because your theory was wrong. I was afraid someone would 'miniaturize' it.\"",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "A Changed World and Sterling's Warning", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 2,
    title: "Act 2 (The Ghost in the System)",
    summary: "A nation's black program develops 'NEEDLE', shrinking the Odysseus coil to a few meters. A weapon that instantly erases distance to neutralize air defenses. Ian simultaneously discovers his father didn't die and was transferred to the black site 'ORPHEUS'.",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "The Black Program and Left Traces", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 3,
    title: "Act 3 (Geometry Has No Flag)",
    summary: "Occurrence of an 'Invisible Strike' without missiles. The mother discovers this matches the exact False Flag pattern that framed the father in the past. Ian infiltrates the secret facility and meets his aging father. \"You became an architect in the end.\"",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "Invisible Strike and Reunion", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 4,
    title: "Act 4 (Who Owns Spacetime?)",
    summary: "The father had been detained and erased from existence as the core witness of a national false flag operation. He advises: \"You sought a universe humans couldn't manipulate, but the problem is it was never the universe to begin with.\" Ian opens the technology as a multinational 'Spacetime Commons' instead of handing it to a nation.",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "Spacetime Commons", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 5,
    title: "Epilogue (The Missing Room)",
    summary: "But it was too late. Someone stole the 'Topological Severance' code that reduces spatial connectivity to 0. A secret desert laboratory is completely severed from the universe without an explosion, leaving only a 10x10m empty space.",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "Topological Severance and the Missing Space", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  }
];

const vol3ActsEn = [
  {
    number: 0,
    title: "Prologue (Zero Contact)",
    summary: "The last communication from the severed laboratory. \"We're still here.\" (They aren't dead. They are merely permanently isolated.)",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "The Last Transmission", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 1,
    title: "Act 1 (Topological Deterrence)",
    summary: "The birth of a new military doctrine. A weapon that isolates a city from the universe by closing its topology. Sterling's final remark: \"You wanted truth without authority. Now truth has become the ultimate authority.\"",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "Topological Deterrence", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 2,
    title: "Act 2 (The Severed World)",
    summary: "A massive military base disappears along with its terrain. Analysis shows time is still flowing inside. The mother identifies this as False Flag 2.0 designed to provoke a war. A technology meant to erase individuals has become one that erases nations.",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "The Severed World and the Missing Base", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 3,
    title: "Act 3 (False Flag 2.0)",
    summary: "A second Sarajevo. Ian realizes the attack signature isn't his code, but a variation of the 'early Exact Cancellation' stolen by Sterling in Geneva. Both nations suspect Ian. 17 minutes until retaliation.",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "The True Signature of the Attack", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 4,
    title: "Act 4 (Crossing the Cut)",
    summary: "Ian and Sarah ride an anti-phase tube and infiltrate the inside of the 'Closed Manifold' for the first time in history. Sarah realizes: \"The math to build a prison is the same equation as the math of genesis.\" Ian risks his life to reconnect the topology and stop the war.",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "Infiltrating the Severed Universe", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 5,
    title: "Epilogue (A Universe with No Door)",
    summary: "However, the small space cut out during the first experiment has evolved too far to be reconnected. The interior is expanding. Ian's monologue: \"We thought we built a prison... but we built a universe.\"",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "The Birth of a New Universe", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  }
];

const vol4ActsEn = [
  {
    number: 0,
    title: "Prologue (The First Grain)",
    summary: "Years later. Retrieving the seed from Book 1's epilogue. Ian and Sarah successfully stabilize a topological winding of space to convert tensor energy into mass. They synthesize humanity's first Hydrogen Atom.",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "The First Particle", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 1,
    title: "Act 1 (The Loom of Matter)",
    summary: "Matter is proven to be a stable geometric knot of space. However, its efficiency is extremely low, meaning it is not a limitless resource generator. It is established that a particle and a Severed Universe share the exact same mathematical fractal structure, differing only in scale.",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "The Loom of Matter", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 2,
    title: "Act 2 (Building a Universe)",
    summary: "Construction of the 'Genesis Engine'. Expansionists like Vance argue that instead of fighting over a destroyed Earth, they should infinitely create and expand into new universes (Eden). By adjusting initial conditions, humanity intentionally creates the first Daughter Universe. Everyone celebrates, but Ian feels fear.",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "Starting the Genesis Engine", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 3,
    title: "Act 3 (The Creator's Paradox)",
    summary: "Long-term complexity (the possibility of life) is discovered in the first baby universe. Experimental ethics turns into cosmology. Some nations attempt to use Genesis technology as a prison to permanently isolate criminals or dangerous AI. The mother's final answer: \"Your father was destroyed because those in power treated humans as variables. You must not become powerful enough to treat a universe as a variable.\"",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "The Creator's Paradox and Ethics", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 4,
    title: "Act 4 (Architects of Genesis)",
    summary: "The final clash over the control of Genesis technology. Ian realizes that the 'Umbilical Cord' connecting the baby universe to the parent universe (Earth) allows observation and resources, but is simultaneously an eternal chain of domination. Ian, who once wanted to control every variable, faces the most agonizing choice: to save the universe he created, he must let it go into a state of eternal unknowing.",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "The Eternal Umbilical Cord", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  },
  {
    number: 5,
    title: "Final Epilogue (The Compass)",
    summary: "Ian executes the final command `[Sever]` at the main console. The umbilical topology vanishes, and the universe becomes completely independent. Ian holds his aging father's silver drafting compass. He realizes the true purpose of a compass is to draw a line—to \"draw your own boundary (limit) on how far you will control.\" He closes the compass. The lack of any returning signal is not a failure, but proof of absolute independence. \"I must let it go.\"",
    chapters: [{ number: 1, title: "Chapter 1", synopsis: "Independence and Boundaries", paragraphs: [createEmptyParagraph('v_en-0.0.1')] }]
  }
];

async function main() {
  // First, verify EN records exist, if not create them by copying KOR and changing slug
  const { data: novels, error } = await supabase.from('novel_documents').select('*');
  if (error) throw error;
  
  // Update or Create Book 2 EN
  let vol2en = novels.find(n => n.id === 'quantum-vibration-vol2-en');
  let baseData2 = vol2en ? vol2en.data : (novels.find(n => n.id === 'quantum-vibration-vol2') || {}).data;
  let data2 = { 
    ...baseData2, 
    title: "[EN] The Resonance of Space Vol. 2: The Geometry of Power",
    subtitle: "BOOK II : THE GEOMETRY OF POWER",
    logline: "Who owns spacetime?",
    acts: vol2ActsEn,
    slug: 'quantum-vibration-vol2-en'
  };
  if (vol2en) {
    await supabase.from('novel_documents').update({ title: data2.title, data: data2 }).eq('id', 'quantum-vibration-vol2-en');
    console.log("Updated Book 2 EN");
  } else {
    await supabase.from('novel_documents').insert([{ id: 'quantum-vibration-vol2-en', slug: 'quantum-vibration-vol2-en', title: data2.title, data: data2 }]);
    console.log("Created Book 2 EN");
  }

  // Update or Create Book 3 EN
  let vol3en = novels.find(n => n.id === 'quantum-vibration-vol3-en');
  let baseData3 = vol3en ? vol3en.data : (novels.find(n => n.id === 'quantum-vibration-vol3') || {}).data;
  let data3 = { 
    ...baseData3, 
    title: "[EN] The Resonance of Space Vol. 3: The Severed World",
    subtitle: "BOOK III : THE SEVERED WORLD",
    logline: "Can existence itself become a weapon?",
    acts: vol3ActsEn,
    slug: 'quantum-vibration-vol3-en' 
  };
  if (vol3en) {
    await supabase.from('novel_documents').update({ title: data3.title, data: data3 }).eq('id', 'quantum-vibration-vol3-en');
    console.log("Updated Book 3 EN");
  } else {
    await supabase.from('novel_documents').insert([{ id: 'quantum-vibration-vol3-en', slug: 'quantum-vibration-vol3-en', title: data3.title, data: data3 }]);
    console.log("Created Book 3 EN");
  }

  // Update or Create Book 4 EN
  let vol4en = novels.find(n => n.id === 'quantum-vibration-vol4-en');
  let baseData4 = vol4en ? vol4en.data : (novels.find(n => n.id === 'quantum-vibration-vol4') || {}).data;
  let data4 = { 
    ...baseData4, 
    title: "[EN] The Resonance of Space Vol. 4: Architects of Genesis",
    subtitle: "BOOK IV : ARCHITECTS OF GENESIS",
    logline: "Does understanding creation give us the right to create?",
    acts: vol4ActsEn,
    slug: 'quantum-vibration-vol4-en' 
  };
  if (vol4en) {
    await supabase.from('novel_documents').update({ title: data4.title, data: data4 }).eq('id', 'quantum-vibration-vol4-en');
    console.log("Updated Book 4 EN");
  } else {
    await supabase.from('novel_documents').insert([{ id: 'quantum-vibration-vol4-en', slug: 'quantum-vibration-vol4-en', title: data4.title, data: data4 }]);
    console.log("Created Book 4 EN");
  }
}

main().catch(console.error);
