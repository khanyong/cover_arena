import React, { useState, useRef } from 'react';
import Head from 'next/head';
import pptxgen from 'pptxgenjs';

export default function PptConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      validateAndSetFile(droppedFiles[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const isHtml = selectedFile.name.endsWith('.html') || selectedFile.name.endsWith('.htm');
    if (!isHtml) {
      setError('Only HTML files (.html, .htm) are supported.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // ==========================================
  // Color Converter Helper
  // ==========================================
  const parseColor = (colorStr: string): string | undefined => {
    if (!colorStr) return undefined;
    colorStr = colorStr.trim();
    if (colorStr.startsWith('#')) {
      let hex = colorStr.replace('#', '');
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      return hex.toUpperCase();
    } else if (colorStr.startsWith('rgb')) {
      const nums = colorStr.match(/\d+/g);
      if (nums && nums.length >= 3) {
        const r = parseInt(nums[0]).toString(16).padStart(2, '0');
        const g = parseInt(nums[1]).toString(16).padStart(2, '0');
        const b = parseInt(nums[2]).toString(16).padStart(2, '0');
        return (r + g + b).toUpperCase();
      }
    }
    return undefined;
  };

  // ==========================================
  // Recursive HTML Formatting Runs Collector
  // ==========================================
  interface TextRun {
    text: string;
    options?: any;
  }

  const parseTextRuns = (element: Element, defaultFont: any): TextRun[] => {
    const runs: TextRun[] = [];
    
    const recurse = (node: Node, currentStyle: any) => {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent || '';
          if (text.trim() || text === ' ') {
            runs.push({
              text,
              options: { ...currentStyle }
            });
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as Element;
          const tagName = el.tagName.toLowerCase();
          const nextStyle = { ...currentStyle };
          
          if (tagName === 'strong' || tagName === 'b') {
            nextStyle.bold = true;
          } else if (tagName === 'em' || tagName === 'i') {
            nextStyle.italic = true;
          } else if (tagName === 'code') {
            nextStyle.fontFace = 'Courier New';
          } else if (tagName === 'span') {
            const styleAttr = el.getAttribute('style') || '';
            const colorMatch = styleAttr.match(/color\s*:\s*([^;]+)/i);
            if (colorMatch) {
              const parsedC = parseColor(colorMatch[1]);
              if (parsedC) nextStyle.color = parsedC;
            }
          }
          recurse(child, nextStyle);
        }
      }
    };
    
    recurse(element, defaultFont);
    return runs;
  };

  const handleConvert = () => {
    if (!file) return;
    setConverting(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      let iframe: HTMLIFrameElement | null = null;
      try {
        const htmlText = e.target?.result as string;
        if (!htmlText) throw new Error('File is empty.');

        console.log('[DEBUG Layout Engine] Starting browser sandbox render...');

        // 1. Create a sandboxed iframe to visually render the HTML layout
        iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        iframe.style.width = '1123px'; // Standard slide layout A4 width
        iframe.style.height = '794px';  // Standard slide layout A4 height
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) throw new Error('Failed to mount sandbox iframe rendering context.');

        iframeDoc.open();
        iframeDoc.write(htmlText);
        iframeDoc.close();

        // 2. Wait for Tailwind CDN and font sheets to finish layout and loading
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const pptx = new pptxgen();
        pptx.layout = 'LAYOUT_16x9';

        const slideElements = iframeDoc.querySelectorAll('.slide');
        console.log('[DEBUG Layout Engine] Found slide layouts:', slideElements.length);

        if (slideElements.length === 0) {
          throw new Error('No elements with class "slide" found in the HTML document.');
        }

        slideElements.forEach((slideEl, index) => {
          console.log(`[DEBUG Layout Engine] Parsing Slide ${index + 1}...`);
          const slide = pptx.addSlide();
          const slideRect = slideEl.getBoundingClientRect();
          
          // Target 13.33 x 7.5 inches for widescreen slide
          const scaleX = 13.33 / (slideRect.width || 1123);
          const scaleY = 7.5 / (slideRect.height || 794);

          // Find semantic text nodes: h1-h6, p, ul, ol, explicit textboxes
          const textBlocks = slideEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, .pptx-text');
          
          // Filter to avoid double-parsing child nodes (e.g. rendering both <ul> and internal <li> separately)
          const activeTextBlocks: Element[] = [];
          textBlocks.forEach((el) => {
            let isNested = false;
            let parent = el.parentElement;
            while (parent && parent !== slideEl) {
              if (parent.matches('h1, h2, h3, h4, h5, h6, p, ul, ol, .pptx-text')) {
                isNested = true;
                break;
              }
              parent = parent.parentElement;
            }
            if (!isNested) {
              activeTextBlocks.push(el);
            }
          });

          console.log(`[DEBUG Layout Engine] Slide ${index + 1}: Found ${activeTextBlocks.length} active text blocks.`);

          // 1. Process Textboxes visually via computed styles
          activeTextBlocks.forEach((el) => {
            const elRect = el.getBoundingClientRect();
            const left = (elRect.left - slideRect.left) * scaleX;
            const top = (elRect.top - slideRect.top) * scaleY;
            const width = elRect.width * scaleX;
            const height = elRect.height * scaleY;

            if (width < 0.1 || height < 0.1) return;

            const computedStyle = window.getComputedStyle(el);
            
            // Extract visual font attributes
            const fontSizePx = parseFloat(computedStyle.fontSize) || 16;
            const sz = Math.round(fontSizePx * 0.75); // Convert px to pt
            const colorHex = parseColor(computedStyle.color) || '333333';
            const fontFace = computedStyle.fontFamily.split(',')[0].replace(/['"]/g, '') || 'Arial';
            const bold = parseInt(computedStyle.fontWeight) >= 600 || computedStyle.fontWeight === 'bold';
            const italic = computedStyle.fontStyle === 'italic';

            const defaultFont = { sz, fontFace, color: colorHex, bold, italic };

            const alignMap: any = { left: 'left', center: 'center', right: 'right', justify: 'justify' };
            const align = alignMap[computedStyle.textAlign] || 'left';

            const tagName = el.tagName.toLowerCase();
            
            if (tagName === 'ul' || tagName === 'ol') {
              const textObjects: any[] = [];
              el.querySelectorAll('li').forEach((li) => {
                const liStyle = window.getComputedStyle(li);
                const liSize = Math.round((parseFloat(liStyle.fontSize) || fontSizePx) * 0.75);
                const liColor = parseColor(liStyle.color) || colorHex;
                const liBold = parseInt(liStyle.fontWeight) >= 600 || liStyle.fontWeight === 'bold';
                
                const runs = parseTextRuns(li, { ...defaultFont, sz: liSize, color: liColor, bold: liBold });
                textObjects.push({
                  text: runs.map((r) => r.text).join(''),
                  options: { ...defaultFont, sz: liSize, color: liColor, bold: liBold, bullet: true }
                });
              });
              slide.addText(textObjects, { x: left, y: top, w: width, h: height + 0.3, align, wrap: true });
            } else {
              const runs = parseTextRuns(el, defaultFont);
              slide.addText(runs, { x: left, y: top, w: width, h: height + 0.15, align, wrap: true });
            }
          });

          // 2. Process Tables visually
          const tables = slideEl.querySelectorAll('table, .pptx-table');
          const activeTables: Element[] = [];
          tables.forEach((tbl) => {
            let isNested = false;
            let parent = tbl.parentElement;
            while (parent && parent !== slideEl) {
              if (parent.tagName.toLowerCase() === 'table') {
                isNested = true;
                break;
              }
              parent = parent.parentElement;
            }
            if (!isNested) {
              activeTables.push(tbl);
            }
          });

          console.log(`[DEBUG Layout Engine] Slide ${index + 1}: Found ${activeTables.length} active tables.`);

          activeTables.forEach((tbl) => {
            const tblRect = tbl.getBoundingClientRect();
            const left = (tblRect.left - slideRect.left) * scaleX;
            const top = (tblRect.top - slideRect.top) * scaleY;
            const width = tblRect.width * scaleX;
            const height = tblRect.height * scaleY;

            const rowElements = tbl.querySelectorAll('tr');
            const pptxRows: any[] = [];

            rowElements.forEach((rowEl) => {
              const rowStyle = window.getComputedStyle(rowEl);
              const rowBgColor = parseColor(rowStyle.backgroundColor);
              
              const cellElements = rowEl.querySelectorAll('td, th');
              const pptxCells: any[] = [];
              
              cellElements.forEach((cellEl) => {
                const cellStyle = window.getComputedStyle(cellEl);
                const cellBgColor = parseColor(cellStyle.backgroundColor) || rowBgColor;
                const cellTextColor = parseColor(cellStyle.color) || '000000';
                
                const isHeader = cellEl.tagName.toLowerCase() === 'th';
                const cellFontSize = Math.round((parseFloat(cellStyle.fontSize) || 16) * 0.75);
                const cellFontFace = cellStyle.fontFamily.split(',')[0].replace(/['"]/g, '') || 'Arial';
                const cellBold = parseInt(cellStyle.fontWeight) >= 600 || cellStyle.fontWeight === 'bold';

                pptxCells.push({
                  text: cellEl.textContent || '',
                  options: {
                    fill: cellBgColor && cellBgColor !== '000000' && cellBgColor !== 'FFFFFF' && cellBgColor !== 'TRANSPARENT' ? { color: cellBgColor } : undefined,
                    color: cellTextColor,
                    bold: cellBold || isHeader,
                    sz: cellFontSize,
                    fontFace: cellFontFace,
                    align: 'left',
                    valign: 'middle'
                  }
                });
              });
              if (pptxCells.length > 0) pptxRows.push(pptxCells);
            });

            if (pptxRows.length > 0) {
              slide.addTable(pptxRows, { x: left, y: top, w: width, h: height });
            }
          });

          // 3. Process Charts
          const charts = slideEl.querySelectorAll('.pptx-chart');
          console.log(`[DEBUG Layout Engine] Slide ${index + 1}: Found ${charts.length} charts.`);

          charts.forEach((crt) => {
            const crtRect = crt.getBoundingClientRect();
            const left = (crtRect.left - slideRect.left) * scaleX;
            const top = (crtRect.top - slideRect.top) * scaleY;
            const width = crtRect.width * scaleX;
            const height = crtRect.height * scaleY;
            
            const chartTypeStr = (crt.getAttribute('data-chart-type') || 'column').toLowerCase();
            const categoriesStr = crt.getAttribute('data-chart-categories');
            const seriesStr = crt.getAttribute('data-chart-series');
            const titleStr = crt.getAttribute('data-chart-title');
            
            if (!categoriesStr || !seriesStr) return;
            
            try {
              const categories = JSON.parse(categoriesStr);
              const seriesData = JSON.parse(seriesStr);
              
              const pptxChartData = seriesData.map((s: any) => ({
                name: s.name || 'Series',
                labels: categories,
                values: s.values || []
              }));
              
              const chartTypeMap: any = {
                column: pptx.ChartType.bar,
                bar: pptx.ChartType.bar,
                line: pptx.ChartType.line,
                pie: pptx.ChartType.pie,
                area: pptx.ChartType.area
              };
              
              const chartType = chartTypeMap[chartTypeStr] || pptx.ChartType.bar;
              const options: any = {
                x: left,
                y: top,
                w: width,
                h: height,
                showLegend: true,
                showTitle: !!titleStr,
                title: titleStr || undefined
              };
              
              if (chartTypeStr === 'bar') {
                options.barDir = 'bar';
              } else if (chartTypeStr === 'column') {
                options.barDir = 'col';
              }
              
              slide.addChart(chartType, pptxChartData, options);
            } catch (e) {
              console.error('[DEBUG Layout Engine] Chart parse failed:', e);
            }
          });
        });

        // Cleanup temporary iframe sandbox
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }

        const newFilename = file.name.replace(/\.(html|htm)$/i, '') + '.pptx';
        await pptx.writeFile({ fileName: newFilename });

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred during visual parsing.');
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      } finally {
        setConverting(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read the HTML file from disk.');
      setConverting(false);
    };

    reader.readAsText(file, 'utf-8');
  };

  const resetConverter = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans pb-16">
      <Head>
        <title>HTML to Editable PPTX Converter</title>
        <meta name="description" content="Convert structured HTML presentation sheets into fully editable PowerPoint PPTX files natively." />
      </Head>

      <main className="max-w-4xl mx-auto px-4 pt-12">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-900/60 bg-purple-950/20 text-purple-400 text-xs font-mono mb-4">
            <span>✨ Sandboxed Visual Rendering Engine (No Specific Markup Class Required)</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent font-mono mb-2">
            HTML TO EDITABLE PPTX
          </h1>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Convert standard HTML slide layouts with Tailwind CSS, Flex, or Grid directly into editable PowerPoint slides.
          </p>
        </header>

        <section className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md mb-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
              dragOver
                ? 'border-purple-500 bg-purple-950/10'
                : file
                ? 'border-emerald-800/60 bg-emerald-950/5'
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/10'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".html,.htm"
              className="hidden"
            />

            {!file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 shadow-inner">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Drag & drop your HTML slide file here</p>
                  <p className="text-xs text-zinc-500 font-mono">or click to browse local files</p>
                </div>
                <button
                  onClick={triggerFileSelect}
                  className="mt-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Choose File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-emerald-950/20 rounded-full border border-emerald-900/60 text-emerald-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-emerald-400 truncate max-w-md">{file.name}</p>
                  <p className="text-xs text-zinc-500 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleConvert}
                    disabled={converting}
                    className={`px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold font-mono transition-all shadow-lg shadow-purple-950/30 flex items-center gap-2 ${
                      converting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
                    }`}
                  >
                    {converting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Rendering & Converting...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Run PPTX Conversion
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetConverter}
                    disabled={converting}
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 rounded-lg text-xs transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-950/20 border border-red-900/60 rounded-lg flex items-start gap-2.5">
              <span className="text-red-400 text-xs mt-0.5">⚠️</span>
              <p className="text-xs text-red-300 font-mono leading-relaxed">{error}</p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold font-mono text-zinc-300 border-b border-zinc-800 pb-2">
            📖 Universal Layout Converter Guide
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The high-performance visual layout engine mounts a sandboxed iframe to render the slide's visual tree. It maps elements dynamically using their visual layout coordinates (px) to native editable PPTX components:
          </p>

          <div className="space-y-3">
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4">
              <h3 className="text-xs font-bold font-mono text-purple-400 mb-2">1. Visual Slide Container</h3>
              <p className="text-[11px] text-zinc-400 mb-2">
                Slides are identified by wrapping HTML elements with the class <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">slide</code>. There are no strict formatting tags or coordinate properties required for internal elements.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4">
              <h3 className="text-xs font-bold font-mono text-purple-400 mb-2">2. Dynamic Font & Colors</h3>
              <p className="text-[11px] text-zinc-400 mb-2">
                The visual engine reads the browser's computed styles (`getComputedStyle`). Standard semantic blocks like <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">h1-h6</code>, <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">p</code>, <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">ul</code>, <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">ol</code> are automatically extracted into editable PPTX shapes matching their relative locations.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4">
              <h3 className="text-xs font-bold font-mono text-purple-400 mb-2">3. Native PowerPoint Charts</h3>
              <p className="text-[11px] text-zinc-400 mb-2">
                For native vector charts, keep the class <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">pptx-chart</code> with categories and series serialization data-attributes.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
