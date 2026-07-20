import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import pptxgen from 'pptxgenjs';

interface EditableText {
  slideIndex: number;
  elementIndex: number;
  originalText: string;
  currentText: string;
  tagName: string;
}

export default function PptConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dynamic slide dimension states resolved from first-page measurements
  const [slideWidth, setSlideWidth] = useState<number>(1123);
  const [slideHeight, setSlideHeight] = useState<number>(794);
  const [slideCount, setSlideCount] = useState<number>(0);
  
  // Current active slide index in viewer (0-indexed)
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  
  // List of all editable text nodes collected from slides
  const [editableTexts, setEditableTexts] = useState<EditableText[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setError(null);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      validateAndLoadFile(droppedFiles[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndLoadFile(e.target.files[0]);
    }
  };

  const validateAndLoadFile = (selectedFile: File) => {
    const isHtml = selectedFile.name.endsWith('.html') || selectedFile.name.endsWith('.htm');
    if (!isHtml) {
      setError('Only HTML files (.html, .htm) are supported.');
      setFile(null);
      setHtmlContent(null);
      return;
    }
    setFile(selectedFile);
    parseAndPrepareEditor(selectedFile);
  };

  // Measure and store dimensions, set the initial source HTML in state
  const parseAndPrepareEditor = (uploadedFile: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawHtml = event.target?.result as string;
        if (!rawHtml) throw new Error('Selected HTML file is empty.');

        // 1. Measure dimensions dynamically using a temporary viewport iframe
        const tempIframe = document.createElement('iframe');
        tempIframe.style.position = 'absolute';
        tempIframe.style.top = '-9999px';
        tempIframe.style.left = '-9999px';
        tempIframe.style.width = '1920px';
        document.body.appendChild(tempIframe);
        
        const tempDoc = tempIframe.contentDocument || tempIframe.contentWindow?.document;
        if (tempDoc) {
          tempDoc.open();
          tempDoc.write(rawHtml);
          tempDoc.close();
        }

        const measuredSlide = tempDoc?.querySelector('.slide') as HTMLElement;
        const width = measuredSlide ? measuredSlide.offsetWidth : 1123;
        const height = measuredSlide ? measuredSlide.offsetHeight : 794;

        setSlideWidth(width);
        setSlideHeight(height);
        setActiveSlideIndex(0);

        if (tempIframe.parentNode) {
          tempIframe.parentNode.removeChild(tempIframe);
        }

        // Set raw HTML to start mounting.
        setHtmlContent(rawHtml);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to parse visual editor trees.');
      }
    };
    reader.readAsText(uploadedFile, 'utf-8');
  };

  // ====================================================
  // COMPREHENSIVE TEXT SCANNER & LAYOUT CONTROLLER
  // ====================================================
  useEffect(() => {
    if (!htmlContent) return;

    console.log('[DEBUG Editor] Analyzing DOM and injecting layout performance rules...');

    const timer = setInterval(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const iframeWin = iframeRef.current.contentWindow as any;
        const iframeDoc = iframeWin.document;

        const slides = iframeDoc.querySelectorAll('.slide');
        if (slides.length > 0) {
          // Set accurate slide count resolved from live mounted Iframe DOM
          setSlideCount(slides.length);

          const collectedTexts: EditableText[] = [];

          slides.forEach((slideEl: Element, slideIdx: number) => {
            const textNodes = slideEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, li, b, strong, td, th, div');
            
            let elementIdx = 0;
            textNodes.forEach((node: Element) => {
              const htmlEl = node as HTMLElement;
              
              if (!htmlEl.textContent || htmlEl.textContent.trim() === '') return;

              const blockTags = ['DIV', 'P', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SECTION', 'ARTICLE', 'TABLE'];
              const hasBlockChildren = Array.from(htmlEl.children).some(child => 
                blockTags.includes(child.tagName.toUpperCase())
              );
              if (hasBlockChildren) return;

              const tagName = htmlEl.tagName.toLowerCase();

              // Inject unique tracking IDs
              htmlEl.setAttribute('data-ppt-editable-id', `${slideIdx}-${elementIdx}`);

              collectedTexts.push({
                slideIndex: slideIdx,
                elementIndex: elementIdx,
                originalText: htmlEl.textContent.trim(),
                currentText: htmlEl.textContent.trim(),
                tagName
              });
              
              elementIdx++;
            });
          });

          setEditableTexts(collectedTexts);

          // Force hide system scroll bars, print banners, and all non-active slides
          const styleId = 'iframe-performance-fixes';
          if (!iframeDoc.getElementById(styleId)) {
            const style = iframeDoc.createElement('style');
            style.id = styleId;
            
            let slideVisibilityRules = '';
            for (let idx = 0; idx < slides.length; idx++) {
              slideVisibilityRules += `
                body[data-active-slide-idx="${idx}"] .slide:nth-of-type(${idx + 1}) {
                  display: block !important;
                }
              `;
            }

            style.innerHTML = `
              #print-guide, .print-banner { display: none !important; }
              body::-webkit-scrollbar { display: none !important; }
              body { -ms-overflow-style: none; scrollbar-width: none; background: #ffffff !important; overflow: hidden !important; margin: 0 !important; }
              
              .slide {
                display: none !important;
                margin: 0 !important;
                box-shadow: none !important;
              }
              
              ${slideVisibilityRules}
            `;
            iframeDoc.head.appendChild(style);
          }

          iframeDoc.body.setAttribute('data-active-slide-idx', '0');

          const scriptId = 'html-to-image-helper';
          if (!iframeDoc.getElementById(scriptId)) {
            const script = iframeDoc.createElement('script');
            script.id = scriptId;
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js';
            iframeDoc.head.appendChild(script);
          }

          clearInterval(timer);
        }
      }
    }, 200);

    return () => clearInterval(timer);
  }, [htmlContent]);

  // Sync active slide index toggle directly to Iframe body data attribute
  useEffect(() => {
    if (!htmlContent || !iframeRef.current || !iframeRef.current.contentWindow) return;
    
    const iframeDoc = iframeRef.current.contentWindow.document;
    if (iframeDoc && iframeDoc.body) {
      iframeDoc.body.setAttribute('data-active-slide-idx', String(activeSlideIndex));
    }
  }, [activeSlideIndex, htmlContent]);

  // Update the live DOM text inside the Iframe when user types in the panel
  const handleTextChange = (slideIdx: number, elIdx: number, newValue: string) => {
    setEditableTexts(prev => prev.map(item => {
      if (item.slideIndex === slideIdx && item.elementIndex === elIdx) {
        return { ...item, currentText: newValue };
      }
      return item;
    }));

    if (iframeRef.current && iframeRef.current.contentWindow) {
      const iframeDoc = iframeRef.current.contentWindow.document;
      const targetNode = iframeDoc.querySelector(`[data-ppt-editable-id="${slideIdx}-${elIdx}"]`);
      if (targetNode) {
        targetNode.textContent = newValue;
      }
    }
  };

  // ====================================================
  // Capture Current Workspace DOM and Export to PPTX
  // ====================================================
  const handleExportToPptx = async () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow || !file) return;
    setConverting(true);
    setError(null);

    const originalActiveIdx = activeSlideIndex;

    try {
      const iframeWin = iframeRef.current.contentWindow as any;
      const iframeDoc = iframeWin.document;

      if (!iframeWin.htmlToImage) {
        throw new Error('html-to-image capture module is not loaded inside workspace.');
      }

      const pptx = new pptxgen();
      
      // Calculate layout matching measured size ratio (11.69 inches standard width base)
      const aspectRatio = slideHeight / slideWidth;
      const pptWidth = 11.69;
      const pptHeight = Number((pptWidth * aspectRatio).toFixed(2));

      pptx.defineLayout({ name: 'DYNAMIC_SLIDE_LAYOUT', width: pptWidth, height: pptHeight });
      pptx.layout = 'DYNAMIC_SLIDE_LAYOUT';

      const slideElements = iframeDoc.querySelectorAll('.slide');
      
      for (let i = 0; i < slideElements.length; i++) {
        const slideEl = slideElements[i] as HTMLElement;
        const slide = pptx.addSlide();

        iframeDoc.body.setAttribute('data-active-slide-idx', String(i));

        await new Promise((resolve) => setTimeout(resolve, 150));

        const slideBase64 = await iframeWin.htmlToImage.toPng(slideEl, {
          pixelRatio: 2,
          style: {
            transform: 'none',
            transformOrigin: 'top left'
          }
        });

        slide.addImage({
          data: slideBase64,
          x: 0,
          y: 0,
          w: pptWidth,
          h: pptHeight
        });
      }

      iframeDoc.body.setAttribute('data-active-slide-idx', String(originalActiveIdx));

      const newFilename = file.name.replace(/\.(html|htm)$/i, '') + '_edited.pptx';
      await pptx.writeFile({ fileName: newFilename });

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during PPTX layout compilation.');
    } finally {
      setConverting(false);
    }
  };

  const resetEditor = () => {
    setFile(null);
    setHtmlContent(null);
    setError(null);
    setSlideCount(0);
    setEditableTexts([]);
    setActiveSlideIndex(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleNextPage = () => {
    if (activeSlideIndex < slideCount - 1) {
      setActiveSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
    }
  };

  const activeSlideTexts = editableTexts.filter(item => item.slideIndex === activeSlideIndex);

  const getFriendlyTagName = (tag: string) => {
    if (tag.startsWith('h')) return `Heading ${tag.replace('h', '')}`;
    if (tag === 'p') return 'Paragraph';
    if (tag === 'li') return 'List Item';
    if (tag === 'td' || tag === 'th') return 'Table Cell';
    return 'Text Box';
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] text-[#f4f4f5] font-sans flex flex-col transition-colors duration-300">
      <Head>
        <title>Visual WYSIWYG HTML to PPTX Editor</title>
        <meta name="description" content="Click and edit HTML slides visually in real-time, then export to pixel-perfect PowerPoint slides." />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      </Head>

      {/* Top Navigation Control Bar - Layered Slate Navy */}
      <header className="h-16 border-b border-zinc-800/60 bg-[#11131c] px-6 flex justify-between items-center z-10 shadow-lg select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            ✨
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider font-mono text-zinc-100">VISUAL PPT MAKER</h1>
            <p className="text-[10px] text-purple-400/80 font-mono">WYSIWYG Workspace v4.0</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".html,.htm"
            className="hidden"
          />

          {!htmlContent ? (
            <button
              onClick={triggerFileSelect}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-md flex items-center gap-2 font-mono"
            >
              🚀 Get Started
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-zinc-300 font-semibold truncate max-w-[200px]">{file?.name}</p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  {slideCount} slides detected • {slideWidth}x{slideHeight}px
                </p>
              </div>
              
              <button
                onClick={handleExportToPptx}
                disabled={converting || slideCount === 0}
                className={`px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold font-mono transition-all shadow-md flex items-center gap-2 ${
                  (converting || slideCount === 0) ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
                }`}
              >
                {converting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating PPTX...
                  </>
                ) : (
                  <>
                    💾 Save & Export PPTX
                  </>
                )}
              </button>

              <button
                onClick={resetEditor}
                className="px-3.5 py-2 bg-[#1c1e2d] hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 rounded-lg text-xs transition-colors font-mono"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Slide Thumbnail Navigation - Dark Slate Navy */}
        {htmlContent && slideCount > 0 && (
          <aside className="w-64 border-r border-zinc-800/60 bg-[#11131c]/90 p-4 flex flex-col gap-3 overflow-y-auto hidden md:flex select-none">
            <h2 className="text-[10px] font-bold text-zinc-400 tracking-wider font-mono mb-2 uppercase">
              Slide Navigator
            </h2>
            <div className="space-y-2">
              {Array.from({ length: slideCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlideIndex(i)}
                  className={`w-full p-3 border rounded-xl text-left text-xs transition-all flex items-center gap-3 group cursor-pointer ${
                    activeSlideIndex === i
                      ? 'bg-purple-950/20 border-purple-500/60 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                      : 'bg-[#1c1e2d]/50 hover:bg-[#1c1e2d] border-zinc-800/60 text-zinc-400 hover:border-purple-950/40'
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold font-mono border ${
                    activeSlideIndex === i
                      ? 'bg-purple-900/20 border-purple-500/60 text-purple-300'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-500'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="font-mono">Slide {i + 1}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Central Workspace Board - Medium Midnight Slate */}
        <main className="flex-1 bg-[#151722] overflow-y-auto p-8 flex flex-col items-center justify-start">
          {error && (
            <div className="w-full max-w-4xl mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-2.5 shadow-md">
              <span className="text-red-400 text-sm mt-0.5">⚠️</span>
              <p className="text-xs text-red-300 font-mono leading-relaxed">{error}</p>
            </div>
          )}

          {!htmlContent ? (
            <div className="w-full max-w-4xl mt-6 flex flex-col items-center gap-12 py-10 animate-fade-in select-none">
              
              {/* Premium Hero Title & Neon Flare Badge */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-950/30 text-purple-300 text-[10px] font-bold tracking-wider font-mono uppercase shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                  ⚡ WYSIWYG Visual Editor v4.0
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-zinc-100">
                  Convert HTML to Premium
                  <span className="block mt-2 bg-gradient-to-r from-purple-400 via-violet-200 to-indigo-400 bg-clip-text text-transparent font-extrabold">
                    PowerPoint Presentations
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed font-mono">
                  Modify contents directly on our live 2-way sync panel and export pixel-perfect, high-definition PPTX slides.
                </p>
              </div>

              {/* Steps Flow Guide - Brightened Dark Metal Cards */}
              <div className="w-full max-w-3xl grid grid-cols-3 gap-4 text-center">
                {[
                  { step: '01', title: 'Upload HTML', desc: 'Drag-and-drop raw presentation sheets' },
                  { step: '02', title: 'Edit Text', desc: 'Change titles or data on the sidebar' },
                  { step: '03', title: 'Get PPTX', desc: 'Download HD 1:1 formatted powerpoints' }
                ].map((s, idx) => (
                  <div key={idx} className="relative bg-[#1c1e2d] border border-zinc-800/80 rounded-xl p-4 flex flex-col items-center gap-1 shadow-md">
                    <span className="text-[10px] font-bold font-mono text-purple-400">{s.step}</span>
                    <h3 className="text-xs font-bold text-zinc-200 font-mono">{s.title}</h3>
                    <p className="text-[10px] text-zinc-400/80">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Premium Drag & Drop Area with Neon Flare Aura */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`w-full max-w-3xl border-2 border-dashed rounded-2xl p-14 text-center transition-all cursor-pointer shadow-2xl relative group ${
                  dragOver
                    ? 'border-purple-500 bg-[#1c1e2d]/90 shadow-[0_0_50px_rgba(139,92,246,0.25)]'
                    : 'border-zinc-700/60 hover:border-purple-500/40 bg-[#11131c]/60 shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.12)]'
                }`}
              >
                <div className="p-5 bg-[#1c1e2d] rounded-2xl border border-zinc-800 text-zinc-400 group-hover:text-purple-400 group-hover:border-purple-500/40 shadow-inner w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                </div>
                <h2 className="text-sm font-semibold mb-1 group-hover:text-zinc-100 transition-colors text-zinc-200">
                  Drag & drop your presentation HTML file here
                </h2>
                <p className="text-xs text-zinc-500 font-mono">
                  or <span className="text-purple-400 group-hover:text-purple-300 font-bold underline decoration-purple-600/40 underline-offset-4">browse local files</span>
                </p>
                <p className="text-[10px] text-zinc-500 font-mono mt-4">
                  Supports .html and .htm format • Scales aspect ratio dynamically
                </p>
              </div>

              {/* Feature Highlights Grid - Layered Bright Cards */}
              <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: '🔮', title: 'WYSIWYG Sidebar', desc: 'No coding required. Modify text cards easily via input fields in our side editor panel.' },
                  { icon: '⚡', title: 'Zero Layout Break', desc: 'Caches custom web fonts and retains raw Flexbox and CSS Grids without shifts.' },
                  { icon: '📐', title: 'Auto-Scaling', desc: 'Widescreen 16:9 or A4 portrait. Scales slides dynamically to keep layout proportions intact.' }
                ].map((f, idx) => (
                  <div key={idx} className="bg-[#1c1e2d] border border-zinc-800/80 rounded-xl p-5 shadow-lg space-y-2 hover:border-zinc-700/80 transition-colors">
                    <span className="text-2xl">{f.icon}</span>
                    <h3 className="text-xs font-bold text-zinc-200 font-mono">{f.title}</h3>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              {/* Pagination Controls */}
              {slideCount > 0 && (
                <div className="mb-6 flex items-center gap-4 bg-[#11131c] px-5 py-2.5 rounded-full border border-zinc-850 shadow-lg select-none">
                  <button
                    onClick={handlePrevPage}
                    disabled={activeSlideIndex === 0}
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center active:scale-95 text-sm font-bold cursor-pointer"
                  >
                    ◀
                  </button>
                  <span className="text-xs font-mono text-zinc-400 font-bold px-2">
                    PAGE {activeSlideIndex + 1} / {slideCount}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={activeSlideIndex === slideCount - 1}
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center active:scale-95 text-sm font-bold cursor-pointer"
                  >
                    ▶
                  </button>
                </div>
              )}

              {/* Visual Presentation Workspace Wrapper - Single slide displayed strictly */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlContent}
                  title="WYSIWYG Presentation Workspace"
                  style={{
                    width: `${slideWidth}px`,
                    height: `${slideHeight}px`,
                    border: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar: Real-time Text Editing Panel - Layered Slate Navy */}
        {htmlContent && slideCount > 0 && (
          <aside className="w-80 border-l border-zinc-800/60 bg-[#11131c]/90 p-5 flex flex-col gap-4 overflow-y-auto select-none">
            <div>
              <h2 className="text-[10px] font-bold text-zinc-400 tracking-wider font-mono uppercase mb-1">
                Slide Edit Panel
              </h2>
              <p className="text-xs text-zinc-300">
                Editing Slide {activeSlideIndex + 1}
              </p>
            </div>
            
            <div className="border-t border-zinc-800 my-1"></div>

            <div className="flex-1 flex flex-col gap-4">
              {activeSlideTexts.length === 0 ? (
                <p className="text-xs text-zinc-500 italic text-center mt-20">
                  No editable text elements found on this slide.
                </p>
              ) : (
                activeSlideTexts.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-purple-400 font-mono uppercase">
                        {getFriendlyTagName(item.tagName)}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        #{item.elementIndex + 1}
                      </span>
                    </div>
                    
                    {item.tagName.startsWith('h') ? (
                      <input
                        type="text"
                        value={item.currentText}
                        onChange={(e) => handleTextChange(item.slideIndex, item.elementIndex, e.target.value)}
                        className="w-full bg-[#1c1e2d] hover:bg-zinc-850 focus:bg-zinc-900 border border-zinc-700/60 focus:border-purple-600 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors outline-none"
                      />
                    ) : (
                      <textarea
                        rows={3}
                        value={item.currentText}
                        onChange={(e) => handleTextChange(item.slideIndex, item.elementIndex, e.target.value)}
                        className="w-full bg-[#1c1e2d] hover:bg-zinc-850 focus:bg-zinc-900 border border-zinc-700/60 focus:border-purple-600 rounded-lg px-3 py-2 text-xs text-zinc-300 transition-colors outline-none resize-none"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
