import React, { useState } from 'react';
import { NovelDetails, AgentQuery } from './novelData';
import { novels } from '../../shared/lib/supabase';

interface QueryManagerProps {
  novel: NovelDetails;
  onUpdateNovel: (newNovel: NovelDetails) => void;
}

export const QueryManager: React.FC<QueryManagerProps> = ({ novel, onUpdateNovel }) => {
  const [selectedId, setSelectedId] = useState<string>('DEFAULT');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgency, setNewAgency] = useState('');
  const [newTargetNotes, setNewTargetNotes] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const [localDefaultQuery, setLocalDefaultQuery] = useState(novel.defaultQuery || '');
  const [localAgentQuery, setLocalAgentQuery] = useState('');
  const [activeToken, setActiveToken] = useState<any>(null);

  const defaultQuery = novel.defaultQuery || '';
  const agentQueries = novel.agentQueries || [];
  const selectedAgent = agentQueries.find(a => a.id === selectedId);

  // 탭이 바뀔 때 로컬 상태 초기화 및 토큰 상태 확인
  React.useEffect(() => {
    if (selectedId === 'DEFAULT') {
      setLocalDefaultQuery(novel.defaultQuery || '');
      setActiveToken(null);
    } else if (selectedAgent) {
      // 기존 데이터 하위 호환: fullQueryOverride가 없으면 customIntro와 defaultQuery를 합쳐서 초기값으로 줌
      const initialText = selectedAgent.fullQueryOverride || 
        (selectedAgent.customIntro ? `${selectedAgent.customIntro}\n\n${novel.defaultQuery || ''}` : (novel.defaultQuery || ''));
      setLocalAgentQuery(initialText);

      // 토큰 상태 확인
      novels.checkActiveAgentToken(selectedId).then(({ data }) => {
        setActiveToken(data);
      });
    }
  }, [selectedId, novel.defaultQuery, selectedAgent?.id]);

  const handleUpdateDefaultQuery = () => {
    onUpdateNovel({
      ...novel,
      defaultQuery: localDefaultQuery,
      updatedAt: new Date().toISOString().split('T')[0]
    });
    alert('공통 본문(템플릿)이 안전하게 저장되었습니다!');
  };

  const handleSaveAgentQuery = () => {
    if (!selectedAgent) return;
    const updatedAgent: AgentQuery = {
      ...selectedAgent,
      fullQueryOverride: localAgentQuery,
      isOverride: true // 명시적으로 독립 상태임을 표시 (하위 호환)
    };
    
    const updatedQueries = agentQueries.map(q => q.id === updatedAgent.id ? updatedAgent : q);
    onUpdateNovel({
      ...novel,
      agentQueries: updatedQueries,
      updatedAt: new Date().toISOString().split('T')[0]
    });
    alert('해당 에이전트의 맞춤 쿼리가 저장되었습니다!');
  };

  const handleGenerateMagicLink = async () => {
    if (!selectedAgent) return;
    if (isGeneratingLink) return;

    // slug가 한국어판인 경우 무조건 -en(영문판)으로 맵핑
    const targetSlug = novel.slug.endsWith('-en') ? novel.slug : `${novel.slug}-en`;
    
    setIsGeneratingLink(true);
    // 발급 전 기존 토큰 파기
    await novels.revokeAgentToken(selectedAgent.id);
    const { data, error } = await novels.createAgentToken(selectedAgent.id, targetSlug);
    setIsGeneratingLink(false);

    if (error || !data) {
      alert('링크 생성에 실패했습니다: ' + (error?.message || 'Unknown error'));
      return;
    }

    setActiveToken(data);

    const magicLinkUrl = `${window.location.origin}/reader?token=${data.token}`;
    const linkText = `\n\n---\n**Full Manuscript Access (1 Month):**\n${magicLinkUrl}\n---`;
    
    // 로컬 에디터에 링크 텍스트 추가
    setLocalAgentQuery(prev => prev + linkText);
    alert('매직 링크가 발급되어 에디터 하단에 추가되었습니다! (저장하기를 눌러 저장해주세요)');
  };

  const handleRevokeMagicLink = async () => {
    if (!selectedAgent || !activeToken) return;
    
    if (!window.confirm('정말 이 링크를 파기하시겠습니까? 에이전트가 더 이상 접속할 수 없게 됩니다.')) return;
    
    setIsGeneratingLink(true);
    await novels.revokeAgentToken(selectedAgent.id);
    setIsGeneratingLink(false);
    
    setActiveToken(null);
    alert('해당 에이전트의 모든 열람 링크가 즉시 파기되었습니다.');
  };

  const handleUpdateAgentStatus = (id: string, status: any) => {
    const updatedQueries = agentQueries.map(q => q.id === id ? { ...q, status } : q);
    onUpdateNovel({
      ...novel,
      agentQueries: updatedQueries,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const newAgent: AgentQuery = {
      id: Math.random().toString(36).substr(2, 9),
      agentName: newAgentName.trim(),
      agency: newAgency.trim(),
      targetNotes: newTargetNotes.trim(),
      fullQueryOverride: novel.defaultQuery || '', // 새 에이전트는 생성 시점의 템플릿 복사
      status: 'Draft',
      isOverride: true
    };

    onUpdateNovel({
      ...novel,
      agentQueries: [...agentQueries, newAgent],
      updatedAt: new Date().toISOString().split('T')[0]
    });

    setNewAgentName('');
    setNewAgency('');
    setNewTargetNotes('');
    setShowAddModal(false);
    setSelectedId(newAgent.id);
  };

  const handleDeleteAgent = (id: string) => {
    const updatedQueries = agentQueries.filter(q => q.id !== id);
    onUpdateNovel({
      ...novel,
      agentQueries: updatedQueries,
      updatedAt: new Date().toISOString().split('T')[0]
    });
    if (selectedId === id) setSelectedId('DEFAULT');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('클립보드에 복사되었습니다.');
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Sent': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Full Request': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Rejected': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700'; // Draft
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] animate-fade-in">
      {/* 왼쪽 패널: 리스트 (Master) */}
      <div className="w-full lg:w-1/3 flex flex-col bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900 z-10">
          <h2 className="text-sm font-bold text-amber-400">쿼리 타겟 목록</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            + 타겟 추가
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800">
          <button
            onClick={() => setSelectedId('DEFAULT')}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selectedId === 'DEFAULT' 
                ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5' 
                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">⭐️</span>
              <span className={`font-bold ${selectedId === 'DEFAULT' ? 'text-amber-400' : 'text-zinc-300'}`}>
                공통 쿼리 템플릿
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 pl-7">새 타겟을 추가할 때 기본으로 복사되는 텍스트</div>
          </button>

          <div className="h-px bg-zinc-800 my-4" />

          {agentQueries.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedId(agent.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedId === agent.id 
                  ? 'bg-indigo-500/10 border-indigo-500/50 shadow-md shadow-indigo-500/5' 
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className={`font-bold ${selectedId === agent.id ? 'text-indigo-300' : 'text-zinc-300'}`}>
                    {agent.agentName}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1 line-clamp-1">
                    {agent.agency ? `🏢 ${agent.agency} ` : ''}
                    {agent.targetNotes ? `📝 ${agent.targetNotes}` : ''}
                  </div>
                </div>
                <div className={`text-[10px] px-2 py-0.5 rounded border ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </div>
              </div>
            </button>
          ))}
          {agentQueries.length === 0 && (
            <div className="text-center py-8 text-zinc-500 text-xs">
              타겟 에이전트가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽 패널: 에디터 (Detail) */}
      <div className="w-full lg:w-2/3 flex flex-col bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden relative">
        
        {/* 공통 본문 뷰 */}
        {selectedId === 'DEFAULT' && (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-5 border-b border-zinc-800 bg-zinc-900 flex-shrink-0 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <span>⭐️</span> 공통 쿼리 템플릿
                </h2>
                <p className="text-zinc-400 text-xs mt-1">이곳의 내용은 '새 에이전트'를 추가할 때 초기값으로 복사됩니다.</p>
              </div>
              <button
                onClick={handleUpdateDefaultQuery}
                className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2 transition-colors"
              >
                💾 템플릿 저장하기
              </button>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <textarea
                value={localDefaultQuery}
                onChange={(e) => setLocalDefaultQuery(e.target.value)}
                className="flex-1 w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-200 font-sans focus:outline-none focus:border-amber-500 leading-relaxed resize-none scrollbar-thin scrollbar-thumb-zinc-800"
                placeholder="Dear [Agent Name],\n\nI am seeking representation for my hard science fiction novel..."
              />
            </div>
          </div>
        )}

        {/* 에이전트 타겟 뷰 */}
        {selectedId !== 'DEFAULT' && selectedAgent && (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-5 border-b border-zinc-800 bg-zinc-900 flex-shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                  <span>🎯</span> {selectedAgent.agentName}
                </h2>
                <div className="text-xs text-zinc-400 mt-1 flex gap-4">
                  {selectedAgent.agency && <span>🏢 {selectedAgent.agency}</span>}
                  {selectedAgent.targetNotes && <span>📝 {selectedAgent.targetNotes}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {activeToken ? (
                  <button
                    onClick={handleRevokeMagicLink}
                    disabled={isGeneratingLink}
                    className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/50 font-bold px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    {isGeneratingLink ? '⏳ 처리중...' : '🚫 기존 링크 파기 (비활성화)'}
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateMagicLink}
                    disabled={isGeneratingLink}
                    className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 font-bold px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    {isGeneratingLink ? '⏳ 생성중...' : '🔑 읽기 권한 1개월 링크 발급'}
                  </button>
                )}
                <select
                  value={selectedAgent.status || 'Draft'}
                  onChange={(e) => handleUpdateAgentStatus(selectedAgent.id, e.target.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-bold focus:outline-none cursor-pointer ${getStatusColor(selectedAgent.status)}`}
                >
                  <option value="Draft" className="bg-zinc-900 text-zinc-300">Draft</option>
                  <option value="Sent" className="bg-zinc-900 text-blue-300">Sent</option>
                  <option value="Full Request" className="bg-zinc-900 text-emerald-300">Full Request</option>
                  <option value="Rejected" className="bg-zinc-900 text-rose-300">Rejected</option>
                </select>
                <button
                  onClick={handleSaveAgentQuery}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-4 py-1.5 rounded-lg text-sm shadow-lg transition-colors"
                >
                  💾 저장하기
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('정말 삭제하시겠습니까?')) {
                      handleDeleteAgent(selectedAgent.id);
                    }
                  }}
                  className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-lg transition-colors ml-2"
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col h-full">
              <textarea
                value={localAgentQuery}
                onChange={(e) => setLocalAgentQuery(e.target.value)}
                className="flex-1 w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-200 font-sans focus:outline-none focus:border-indigo-500 leading-relaxed resize-none scrollbar-thin scrollbar-thumb-zinc-800"
                placeholder="해당 에이전트에게 보낼 전체 쿼리를 수정하세요..."
              />
              <div className="flex justify-end pt-4 shrink-0">
                <button
                  onClick={() => copyToClipboard(localAgentQuery)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  📋 이 쿼리 전체 복사하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 새 타겟 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-indigo-400 mb-4">새 에이전트 타겟 추가</h2>
            <form onSubmit={handleAddAgent} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">에이전트 이름 *</label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                  placeholder="예: Jack Mozley"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">소속 에이전시</label>
                <input
                  type="text"
                  value={newAgency}
                  onChange={(e) => setNewAgency(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                  placeholder="선택 사항"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">타겟 노트</label>
                <input
                  type="text"
                  value={newTargetNotes}
                  onChange={(e) => setNewTargetNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                  placeholder="예: 양자역학 박사, 하드 SF 선호"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-lg transition-colors text-sm"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-lg shadow-indigo-500/20"
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
