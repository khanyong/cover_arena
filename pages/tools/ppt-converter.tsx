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

  const parseDimension = (styleStr: string, propName: string): number | undefined => {
    const pattern = new RegExp(`(?:^|;\\s*)${propName}\\s*:\\s*([\\d.]+)\\s*(in|cm|pt|px)?`, 'i');
    const match = styleStr.match(pattern);
    if (!match) return undefined;
    
    const val = parseFloat(match[1]);
    const unit = (match[2] || 'in').toLowerCase();
    
    if (unit === 'in') return val;
    if (unit === 'cm') return val * 0.3937;
    if (unit === 'pt') return val / 72.0;
    if (unit === 'px') return val / 96.0;
    return val;
  };

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

  const processTextBox = (slide: any, el: Element) => {
    const styleStr = el.getAttribute('style') || '';
    const left = parseDimension(styleStr, 'left');
    const top = parseDimension(styleStr, 'top');
    const width = parseDimension(styleStr, 'width') || 5.0;
    const height = parseDimension(styleStr, 'height') || 1.0;
    
    if (left === undefined || top === undefined) return;
    
    const defaultFont = {
      fontSize: el.getAttribute('data-font-size') ? parseInt(el.getAttribute('data-font-size')!) : 14,
      fontFace: el.getAttribute('data-font-family') || el.getAttribute('data-font-name') || 'Arial',
      color: parseColor(el.getAttribute('data-font-color') || '') || '000000',
      bold: el.getAttribute('data-bold') === 'true',
      italic: el.getAttribute('data-italic') === 'true'
    };
    
    const alignMap: any = {
      left: 'left',
      center: 'center',
      right: 'right',
      justify: 'justify'
    };
    const align = alignMap[el.getAttribute('data-align')?.toLowerCase() || ''] || 'left';
    
    const blocks = el.querySelectorAll('ul, ol, p, div');
    if (blocks.length === 0) {
      const runs = parseTextRuns(el, defaultFont);
      slide.addText(runs, { x: left, y: top, w: width, h: height, align, wrap: true });
    } else {
      const textObjects: any[] = [];
      el.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent?.trim();
          if (text) {
            textObjects.push({ text, options: { ...defaultFont } });
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const blockEl = child as Element;
          const blockName = blockEl.tagName.toLowerCase();
          
          if (blockName === 'ul' || blockName === 'ol') {
            blockEl.querySelectorAll('li').forEach(li => {
              const runs = parseTextRuns(li, defaultFont);
              textObjects.push({
                text: runs.map(r => r.text).join(''),
                options: { ...defaultFont, bullet: true }
              });
            });
          } else if (blockName === 'p' || blockName === 'div') {
            const runs = parseTextRuns(blockEl, defaultFont);
            textObjects.push({
              text: runs.map(r => r.text).join(''),
              options: { ...defaultFont, breakLine: true }
            });
          }
        }
      });
      slide.addText(textObjects, { x: left, y: top, w: width, h: height, align, wrap: true });
    }
  };

  const processTable = (slide: any, el: Element) => {
    const styleStr = el.getAttribute('style') || '';
    const left = parseDimension(styleStr, 'left');
    const top = parseDimension(styleStr, 'top');
    const width = parseDimension(styleStr, 'width') || 8.0;
    const height = parseDimension(styleStr, 'height') || 2.0;
    
    if (left === undefined || top === undefined) return;
    
    const rowElements = el.querySelectorAll('tr');
    const pptxRows: any[] = [];
    
    let colWidths: number[] = [];
    const colWidthsStr = el.getAttribute('data-col-widths');
    if (colWidthsStr) {
      try {
        colWidths = JSON.parse(colWidthsStr);
      } catch (e) {
        console.error(e);
      }
    }
    
    const defaultFontSize = el.getAttribute('data-font-size') ? parseInt(el.getAttribute('data-font-size')!) : 12;
    
    rowElements.forEach(rowEl => {
      const rowStyle = rowEl.getAttribute('style') || '';
      const bgMatch = rowStyle.match(/background-color\s*:\s*([^;]+)/i);
      const rowBgColor = bgMatch ? parseColor(bgMatch[1]) : undefined;
      
      const cellElements = rowEl.querySelectorAll('td, th');
      const pptxCells: any[] = [];
      
      cellElements.forEach(cellEl => {
        const cellStyle = cellEl.getAttribute('style') || '';
        const cellBgMatch = cellStyle.match(/background-color\s*:\s*([^;]+)/i);
        const cellBgColor = cellBgMatch ? parseColor(cellBgMatch[1]) : rowBgColor;
        
        const colorMatch = (cellStyle + ';' + rowStyle).match(/color\s*:\s*([^;]+)/i);
        const cellTextColor = colorMatch ? parseColor(colorMatch[1]) : undefined;
        
        const isHeader = cellEl.tagName.toLowerCase() === 'th';
        
        pptxCells.push({
          text: cellEl.textContent || '',
          options: {
            fill: cellBgColor ? { color: cellBgColor } : undefined,
            color: cellTextColor || (isHeader ? 'FFFFFF' : '000000'),
            bold: isHeader,
            fontSize: defaultFontSize,
            align: 'left',
            valign: 'middle'
          }
        });
      });
      pptxRows.push(pptxCells);
    });
    
    slide.addTable(pptxRows, {
      x: left,
      y: top,
      w: width,
      h: height,
      colWidths: colWidths.length > 0 ? colWidths : undefined
    });
  };

  const processChart = (slide: any, el: Element, pptxInstance: any) => {
    const styleStr = el.getAttribute('style') || '';
    const left = parseDimension(styleStr, 'left');
    const top = parseDimension(styleStr, 'top');
    const width = parseDimension(styleStr, 'width') || 5.0;
    const height = parseDimension(styleStr, 'height') || 4.0;
    
    if (left === undefined || top === undefined) return;
    
    const chartTypeStr = (el.getAttribute('data-chart-type') || 'column').toLowerCase();
    
    const categoriesStr = el.getAttribute('data-chart-categories');
    const seriesStr = el.getAttribute('data-chart-series');
    const titleStr = el.getAttribute('data-chart-title');
    
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
        column: pptxInstance.ChartType.bar, 
        bar: pptxInstance.ChartType.bar,
        line: pptxInstance.ChartType.line,
        pie: pptxInstance.ChartType.pie,
        area: pptxInstance.ChartType.area
      };
      
      const chartType = chartTypeMap[chartTypeStr] || pptxInstance.ChartType.bar;
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
      console.error('Error parsing chart data inside browser:', e);
    }
  };

  const handleConvert = () => {
    if (!file) return;
    setConverting(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const htmlText = e.target?.result as string;
        if (!htmlText) throw new Error('File is empty.');

        const pptx = new pptxgen();
        pptx.layout = 'LAYOUT_16x9';

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        const slideElements = doc.querySelectorAll('.slide');
        if (slideElements.length === 0) {
          throw new Error('No elements with class "slide" found in the uploaded HTML.');
        }

        slideElements.forEach((slideEl) => {
          const slide = pptx.addSlide();

          const textBoxes = slideEl.querySelectorAll('.pptx-text');
          textBoxes.forEach((tb) => processTextBox(slide, tb));

          const tables = slideEl.querySelectorAll('.pptx-table');
          const standardTables = slideEl.querySelectorAll('table');
          const allTables = Array.from(new Set([...Array.from(tables), ...Array.from(standardTables)]));
          allTables.forEach((tbl) => processTable(slide, tbl));

          const charts = slideEl.querySelectorAll('.pptx-chart');
          charts.forEach((crt) => processChart(slide, crt, pptx));
        });

        const newFilename = file.name.replace(/\.(html|htm)$/i, '') + '.pptx';
        await pptx.writeFile({ fileName: newFilename });

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred during client-side conversion.');
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
            <span>✨ Pure Client-Side Conversion Engine (No External Servers)</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent font-mono mb-2">
            HTML TO EDITABLE PPTX
          </h1>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Convert custom structured HTML slide components into fully editable, native vector PowerPoint presentations.
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
                        Converting...
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
            📖 Slide HTML Markup Specification Guide
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The conversion engine parses the HTML file by looking for specific classes and mapping them directly to editable PowerPoint objects. Use the template structures below:
          </p>

          <div className="space-y-3">
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4">
              <h3 className="text-xs font-bold font-mono text-purple-400 mb-2">1. Slide Layout Container</h3>
              <p className="text-[11px] text-zinc-400 mb-2">
                Every slide must be wrapped in a container with the class <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">slide</code>. Default widescreen dimension is 13.33 x 7.5 inches.
              </p>
              <pre className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 text-[10px] text-emerald-500 overflow-x-auto font-mono">
{`<div class="slide">
  <!-- Slide elements go here -->
</div>`}
              </pre>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4">
              <h3 className="text-xs font-bold font-mono text-purple-400 mb-2">2. Editable Text Boxes</h3>
              <p className="text-[11px] text-zinc-400 mb-2">
                Use the class <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">pptx-text</code>. Coordinates and sizes must be defined as inline CSS styles (in, cm, pt, px). Use <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">data-</code> attributes for text configuration.
              </p>
              <pre className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 text-[10px] text-emerald-500 overflow-x-auto font-mono">
{`<div class="pptx-text" 
     style="top: 1.0in; left: 1.5in; width: 10.33in; height: 1.5in;"
     data-font-size="28" 
     data-font-family="Arial" 
     data-font-color="#2F5597" 
     data-bold="true" 
     data-align="center">
  <h2>Slide Title Header</h2>
  <p>Standard text with <strong>bold</strong> and <em>italic</em> inline tags.</p>
</div>`}
              </pre>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4">
              <h3 className="text-xs font-bold font-mono text-purple-400 mb-2">3. Editable Tables</h3>
              <p className="text-[11px] text-zinc-400 mb-2">
                Use the class <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">pptx-table</code> or standard table tags. Supports explicit column widths.
              </p>
              <pre className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 text-[10px] text-emerald-500 overflow-x-auto font-mono">
{`<table class="pptx-table" 
       style="top: 3.0in; left: 2.0in; width: 9.33in; height: 2.0in;"
       data-col-widths="[3.0, 3.0, 3.33]"
       data-font-size="12">
  <tr style="background-color: #2F5597; color: #FFFFFF;">
    <th>Item Name</th>
    <th>Quantity</th>
    <th>Price</th>
  </tr>
  <tr>
    <td>Hadron Model A</td>
    <td>5</td>
    <td>$1,200</td>
  </tr>
</table>`}
              </pre>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4">
              <h3 className="text-xs font-bold font-mono text-purple-400 mb-2">4. Native Excel-backed Charts</h3>
              <p className="text-[11px] text-zinc-400 mb-2">
                Use the class <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">pptx-chart</code>. Renders a native editable chart inside PowerPoint. Supported types: <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">column</code>, <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">bar</code>, <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">line</code>, <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">pie</code>.
              </p>
              <pre className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 text-[10px] text-emerald-500 overflow-x-auto font-mono">
{`<div class="pptx-chart" 
     style="top: 2.5in; left: 3.5in; width: 6.33in; height: 4.0in;"
     data-chart-type="column"
     data-chart-title="Topological Mass Splitting"
     data-chart-categories="[\\"Proton\\", \\"Neutron\\", \\"Pion\\", \\"Omega\\"]"
     data-chart-series="[
       {\"name\\": \\"Mass (MeV)\\", \\"values\\": [938.2, 939.6, 139.5, 1672.4]}
     ]">
</div>`}
              </pre>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
