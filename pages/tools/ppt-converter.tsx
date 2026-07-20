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
  
  // Current active slide index in viewer
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
        const count = tempDoc?.querySelectorAll('.slide').length || 0;

        setSlideWidth(width);
        setSlideHeight(height);
        setSlideCount(count);
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
  // LIVE DOM SIDE PANEL WATCHER (100% Layout-safe)
  // ====================================================
  // We keep the Iframe 100% READ-ONLY to completely avoid event-listener conflicts,
  // Tailwind compiling failures, or absolute layout breakages. Instead, we scan texts
  // and expose them cleanly in the Right-hand Edit Panel for real-time 2-way binding.
  useEffect(() => {
    if (!htmlContent) return;

    console.log('[DEBUG Editor] Setting up read-only view and collecting slide text nodes...');

    const timer = setInterval(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const iframeWin = iframeRef.current.contentWindow as any;
        const iframeDoc = iframeWin.document;

        const slides = iframeDoc.querySelectorAll('.slide');
        if (slides.length > 0) {
          const collectedTexts: EditableText[] = [];

          slides.forEach((slideEl: Element, slideIdx: number) => {
            // Scan for headings, paragraphs, and list blocks inside each slide
            const textNodes = slideEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, b, strong, td, th');
            
            let elementIdx = 0;
            textNodes.forEach((node: Element) => {
              const htmlEl = node as HTMLElement;
              
              // Skip empty spaces
              if (!htmlEl.textContent || htmlEl.textContent.trim() === '') return;

              // Filter out layout containers (only target leaf nodes with actual text content)
              const blockTags = ['DIV', 'P', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SECTION', 'ARTICLE', 'TABLE'];
              const hasBlockChildren = Array.from(htmlEl.children).some(child => 
                blockTags.includes(child.tagName.toUpperCase())
              );
              if (hasBlockChildren) return;

              // Extract tag type to display friendly labels in the panel
              const tagName = htmlEl.tagName.toLowerCase();

              // Add special marker index and store in state
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

          // Force hide system scroll bars and print banners inside iframe
          const styleId = 'iframe-visual-fixes';
          if (!iframeDoc.getElementById(styleId)) {
            const style = iframeDoc.createElement('style');
            style.id = styleId;
            style.innerHTML = `
              #print-guide, .print-banner { display: none !important; }
              /* Force hide iframe scrollbars to keep design completely clean */
              body::-webkit-scrollbar { display: none !important; }
              body { -ms-overflow-style: none; scrollbar-width: none; }
            `;
            iframeDoc.head.appendChild(style);
          }

          // Load html-to-image script internally inside loaded DOM if missing
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
    }, 250);

    return () => clearInterval(timer);
  }, [htmlContent]);

  // Update the live DOM text inside the Iframe when user types in the panel
  const handleTextChange = (slideIdx: number, elIdx: number, newValue: string) => {
    // 1. Update React state
    setEditableTexts(prev => prev.map(item => {
      if (item.slideIndex === slideIdx && item.elementIndex === elIdx) {
        return { ...item, currentText: newValue };
      }
      return item;
    }));

    // 2. Update Live Iframe DOM node immediately
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

        // Capture exactly what is visible in workspace at 2x resolution
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

  // Sidebar anchor scrolling and active slide sync helper
  const scrollToSlide = (index: number) => {
    setActiveSlideIndex(index);
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    const iframeDoc = iframeRef.current.contentWindow.document;
    const slideElements = iframeDoc.querySelectorAll('.slide');
    if (slideElements[index]) {
      slideElements[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter text nodes for currently active slide
  const activeSlideTexts = editableTexts.filter(item => item.slideIndex === activeSlideIndex);

  // Friendly name generator for label nodes
  const getFriendlyTagName = (tag: string) => {
    if (tag.startsWith('h')) return `Heading ${tag.replace('h', '')}`;
    if (tag === 'p') return 'Paragraph';
    if (tag === 'li') return 'List Item';
    if (tag === 'td' || tag === 'th') return 'Table Cell';
    return 'Text Box';
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans flex flex-col">
      <Head>
        <title>Visual WYSIWYG HTML to PPTX Editor</title>
        <meta name="description" content="Click and edit HTML slides visually in real-time, then export to pixel-perfect PowerPoint slides." />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      </Head>

      {/* Top Navigation Control Bar */}
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-950 px-6 flex justify-between items-center z-10 shadow-lg select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            ✨
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider font-mono">VISUAL PPT MAKER</h1>
            <p className="text-[10px] text-zinc-500 font-mono">WYSIWYG Workspace v3.0</p>
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
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold rounded-lg transition-all active:scale-95 shadow-md flex items-center gap-2"
            >
              🚀 Load HTML Slide File
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-zinc-400 font-semibold truncate max-w-[200px]">{file?.name}</p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  {slideCount} slides detected • {slideWidth}x{slideHeight}px
                </p>
              </div>
              
              <button
                onClick={handleExportToPptx}
                disabled={converting}
                className={`px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold font-mono transition-all shadow-md flex items-center gap-2 ${
                  converting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
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
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 rounded-lg text-xs transition-colors font-mono"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Slide Thumbnail Navigation */}
        {htmlContent && (
          <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950/70 p-4 flex flex-col gap-3 overflow-y-auto hidden md:flex select-none">
            <h2 className="text-[10px] font-bold text-zinc-500 tracking-wider font-mono mb-2 uppercase">
              Slide Navigator
            </h2>
            <div className="space-y-2">
              {Array.from({ length: slideCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSlide(i)}
                  className={`w-full p-3 border rounded-xl text-left text-xs transition-all flex items-center gap-3 group ${
                    activeSlideIndex === i
                      ? 'bg-purple-950/20 border-purple-800/80 text-purple-400'
                      : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800/60 text-zinc-400 hover:border-purple-900/40'
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold font-mono border ${
                    activeSlideIndex === i
                      ? 'bg-purple-900/20 border-purple-800 text-purple-400'
                      : 'bg-zinc-850 border-zinc-800 text-zinc-400'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="font-mono">Slide {i + 1}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Central Workspace Board */}
        <main className="flex-1 bg-zinc-900 overflow-y-auto p-8 flex flex-col items-center justify-start">
          {error && (
            <div className="w-full max-w-4xl mb-6 p-4 bg-red-950/20 border border-red-900/60 rounded-xl flex items-start gap-2.5 shadow-md">
              <span className="text-red-400 text-sm mt-0.5">⚠️</span>
              <p className="text-xs text-red-300 font-mono leading-relaxed">{error}</p>
            </div>
          )}

          {!htmlContent ? (
            <div className="w-full max-w-2xl mt-32 text-center p-12 bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`w-full border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                  dragOver
                    ? 'border-purple-500 bg-purple-950/10'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/10'
                }`}
              >
                <div className="p-5 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 shadow-inner w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                </div>
                <h2 className="text-sm font-semibold mb-1">Drag & drop your presentation HTML here</h2>
                <p className="text-xs text-zinc-500 font-mono">Supports all resolutions • Automatically scales</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="mb-6 bg-purple-950/20 text-purple-400 px-6 py-2.5 rounded-full text-xs font-bold border border-purple-900/60 shadow-md flex items-center gap-2 select-none">
                <span>💡</span> Use the Right-hand Panel to edit slide text in real-time.
              </div>

              {/* Visual Presentation Workspace Wrapper */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlContent}
                  title="WYSIWYG Presentation Workspace"
                  style={{
                    width: `${slideWidth}px`,
                    height: '10000px', // Large height to display multiple stacked slides comfortably
                    border: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar: Real-time Text Editing Panel */}
        {htmlContent && (
          <aside className="w-80 border-l border-zinc-800/80 bg-zinc-950/80 p-5 flex flex-col gap-4 overflow-y-auto select-none">
            <div>
              <h2 className="text-[10px] font-bold text-zinc-500 tracking-wider font-mono uppercase mb-1">
                Slide Edit Panel
              </h2>
              <p className="text-xs text-zinc-400">
                Editing Slide {activeSlideIndex + 1}
              </p>
            </div>
            
            <div className="border-t border-zinc-800 my-1"></div>

            <div className="flex-1 flex flex-col gap-4">
              {activeSlideTexts.length === 0 ? (
                <p className="text-xs text-zinc-600 italic text-center mt-20">
                  No editable text elements found on this slide.
                </p>
              ) : (
                activeSlideTexts.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-purple-400 font-mono uppercase">
                        {getFriendlyTagName(item.tagName)}
                      </span>
                      <span className="text-[9px] text-zinc-600 font-mono">
                        #{item.elementIndex + 1}
                      </span>
                    </div>
                    
                    {item.tagName.startsWith('h') ? (
                      <input
                        type="text"
                        value={item.currentText}
                        onChange={(e) => handleTextChange(item.slideIndex, item.elementIndex, e.target.value)}
                        className="w-full bg-zinc-900 hover:bg-zinc-850 focus:bg-zinc-900 border border-zinc-800 focus:border-purple-600 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors outline-none"
                      />
                    ) : (
                      <textarea
                        rows={3}
                        value={item.currentText}
                        onChange={(e) => handleTextChange(item.slideIndex, item.elementIndex, e.target.value)}
                        className="w-full bg-zinc-900 hover:bg-zinc-850 focus:bg-zinc-900 border border-zinc-800 focus:border-purple-600 rounded-lg px-3 py-2 text-xs text-zinc-300 transition-colors outline-none resize-none"
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
