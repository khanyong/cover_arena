import React, { useState, useEffect } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { ReferenceData } from './paperData';

interface ReferencePdfPanelProps {
  reference: ReferenceData | null;
  onClose: () => void;
  lang: 'ko' | 'en';
}

export const ReferencePdfPanel: React.FC<ReferencePdfPanelProps> = ({ reference, onClose, lang }) => {
  const [pdfPublicUrl, setPdfPublicUrl] = useState<string>('');
  const [loadError, setLoadError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (!reference) return;

    const fetchPdf = async () => {
      setIsLoading(true);
      setLoadError(false);
      
      try {
        // 1. Supabase Storage 'academic-references' 버킷에서 reference.id + ".pdf" 로드 시도
        const fileName = `${reference.id}.pdf`;
        
        const { data } = supabase.storage
          .from('academic-references')
          .getPublicUrl(fileName);

        if (data && data.publicUrl) {
          // 브라우저의 PDF 뷰어로 이동하도록 page 넘버링 해시 추가 (#page=N)
          setPdfPublicUrl(`${data.publicUrl}#page=${reference.citedPage}`);
        } else {
          throw new Error("Public URL generation failed");
        }
      } catch (err) {
        console.warn("Supabase Storage fetch failed, using fallback scientific document viewer:", err);
        setLoadError(true);
        // Fallback: 공개 아카이브 PDF 뷰어 연동
        setPdfPublicUrl(`https://arxiv.org/pdf/quant-ph/0312059.pdf#page=${reference.citedPage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();
  }, [reference]);

  if (!reference) return null;

  // 로컬 파일 업로드 핸들러 (사용자가 웹 뷰에서 직접 PDF를 등록할 수 있게 지원)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setCustomFile(file);
    setIsUploading(true);

    try {
      const fileName = `${reference.id}.pdf`;
      const { error } = await supabase.storage
        .from('academic-references')
        .upload(fileName, file, { upsert: true });

      if (error) {
        alert(`Supabase Storage 업로드 오류: ${error.message}\n(버킷이 생성되어 있는지, 혹은 public 버킷인지 확인해 주세요.)`);
      } else {
        const { data } = supabase.storage
          .from('academic-references')
          .getPublicUrl(fileName);
        
        if (data) {
          setPdfPublicUrl(`${data.publicUrl}#page=${reference.citedPage}`);
          setLoadError(false);
          alert('PDF가 Supabase Storage 버킷에 성공적으로 업로드 및 동기화되었습니다!');
        }
      }
    } catch (err: any) {
      console.error(err);
      alert('업로드 중 예외가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f8f6] border-l border-zinc-250 text-zinc-800 overflow-hidden shadow-xl">
      
      {/* Panel Header */}
      <div className="p-4 border-b border-zinc-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-red-800/10 text-[#8b1a1a] border border-[#8b1a1a]/20 text-xs font-mono font-bold rounded-sm">
            Ref [{reference.id.replace('ref', '')}]
          </span>
          <h3 className="font-bold text-sm text-zinc-950 font-serif truncate max-w-[200px]" title={reference.title}>
            Reference Comparison
          </h3>
        </div>
        <button 
          onClick={onClose}
          className="text-zinc-550 hover:text-zinc-900 p-1.5 hover:bg-zinc-100 rounded transition-colors text-xs font-bold font-mono"
        >
          ✕ Close
        </button>
      </div>

      {/* Bibliography & Cited Context */}
      <div className="p-5 border-b border-zinc-200 bg-white space-y-4">
        <div>
          <h4 className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider mb-1 font-mono">인용 논문 서지 정보 (Bibliography)</h4>
          <p className="text-xs font-bold text-zinc-900 leading-snug font-serif">{reference.title}</p>
          <p className="text-[11px] text-zinc-500 mt-1 font-medium font-serif">
            {reference.authors} — <span className="italic">{reference.journal}</span>, {reference.year}
          </p>
        </div>

        {/* Pinpointed Citing Context */}
        <div className="p-3 bg-red-800/5 border border-[#8b1a1a]/15 rounded-sm space-y-1.5 relative overflow-hidden font-serif">
          <h5 className="text-[10px] font-bold text-[#8b1a1a] uppercase tracking-wider flex items-center gap-1 font-mono">
            🎯 Pinpointed Excerpt (인용 핵심 구절)
          </h5>
          <blockquote className="text-xs text-zinc-800 italic border-l-2 border-[#8b1a1a] pl-3 my-1 leading-relaxed">
            "{lang === 'ko' ? reference.citedContext.ko : reference.citedContext.en}"
          </blockquote>
          <p className="text-[9px] text-zinc-500 text-right font-mono">
            Page {reference.citedPage} 에서 인용됨 (자동 페이지 포커스)
          </p>
        </div>
      </div>

      {/* Embedded PDF Viewer */}
      <div className="flex-1 bg-zinc-100 flex flex-col relative min-h-[300px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
            <div className="w-6 h-6 border-2 border-[#8b1a1a] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-[10px] text-zinc-500 font-mono">Supabase Storage에서 PDF 로딩 중...</p>
          </div>
        ) : null}

        {/* Action Bar for Uploading Custom Reference */}
        <div className="bg-zinc-50 px-4 py-2 border-b border-zinc-200 text-[10px] text-zinc-500 flex flex-wrap justify-between items-center gap-2">
          <span>Storage Bucket: <code className="bg-zinc-200 px-1 py-0.5 text-[#8b1a1a] rounded-sm font-mono font-bold">academic-references</code></span>
          
          <label className="cursor-pointer px-2.5 py-1 bg-white hover:bg-zinc-50 rounded-sm border border-zinc-300 text-zinc-700 transition-colors flex items-center gap-1 font-mono font-bold shadow-xs">
            {isUploading ? 'Uploading...' : '📤 PDF 업로드 테스트'}
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileUpload} 
              disabled={isUploading}
              className="hidden" 
            />
          </label>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 w-full h-full relative bg-zinc-200">
          {pdfPublicUrl ? (
            <iframe
              src={pdfPublicUrl}
              className="w-full h-full border-none bg-white"
              title={`Reference PDF [${reference.id}]`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center h-full">
              <span className="text-2xl mb-2">📄</span>
              <p className="text-xs text-zinc-500 font-serif">PDF 파일 경로가 유효하지 않습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
