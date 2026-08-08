import React, { useState, useEffect } from 'react';
import { SceneDetails } from './novelData';

interface SceneGlossaryProps {
  scenes: SceneDetails[];
  onAddScene: () => void;
  onUpdateScene: (id: string, updates: Partial<Omit<SceneDetails, 'id'>>) => void;
  onDeleteScene: (id: string) => void;
}

export const SceneGlossary: React.FC<SceneGlossaryProps> = ({
  scenes,
  onAddScene,
  onUpdateScene,
  onDeleteScene
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SceneDetails>>({});

  useEffect(() => {
    if (scenes.length > 0 && !scenes.find(s => s.id === selectedSceneId)) {
      setSelectedSceneId(scenes[0].id);
    } else if (scenes.length === 0) {
      setSelectedSceneId(null);
    }
  }, [scenes, selectedSceneId]);

  const selectedScene = scenes.find(s => s.id === selectedSceneId);

  const handleEditClick = (scene: SceneDetails) => {
    setEditingId(scene.id);
    setEditForm({
      title: scene.title,
      position: scene.position,
      background: scene.background,
      relationship: scene.relationship,
      narrative: scene.narrative
    });
  };

  const handleSave = (id: string) => {
    onUpdateScene(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-3xl font-black text-indigo-400 flex items-center gap-2">
          <span>🎬</span> 장면 씬 드래프트
        </h2>
        <button
          onClick={onAddScene}
          className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-lg flex items-center gap-2"
        >
          <span>➕</span> 새로운 씬 추가
        </button>
      </div>

      {(!scenes || scenes.length === 0) ? (
        <div className="flex-1 flex items-center justify-center text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800">
          작성된 장면 씬이 없습니다. 구상 중인 씬을 추가해 보세요!
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
          
          {/* Left Sidebar (List) */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 shrink-0">
            {scenes.map(scene => (
              <button
                key={scene.id}
                onClick={() => { 
                  setSelectedSceneId(scene.id); 
                  if (editingId !== scene.id) setEditingId(null); 
                }}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedSceneId === scene.id 
                    ? 'bg-zinc-800 border-indigo-500 shadow-md' 
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <span className="text-xs text-indigo-400 font-bold block mb-1">
                  {scene.position ? `📍 ${scene.position}` : '📍 위치 미정'}
                </span>
                <span className="text-lg font-bold text-zinc-100">{scene.title}</span>
              </button>
            ))}
          </div>

          {/* Right Main Area (Details/Edit) */}
          <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 p-8 shadow-inner relative">
            {selectedScene ? (
              editingId === selectedScene.id ? (
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <h3 className="text-xl font-bold text-zinc-100">씬 구상 편집</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (confirm('이 씬을 정말 삭제하시겠습니까?')) {
                            onDeleteScene(selectedScene.id);
                          }
                        }}
                        className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-bold"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors font-bold"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleSave(selectedScene.id)}
                        className="px-6 py-2 text-sm bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-400 transition-colors shadow-lg"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-zinc-500 font-bold mb-2 block">씬 제목</label>
                      <input
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        value={editForm.title || ''}
                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="예: 1씬: 맥팔레인의 펍"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-zinc-500 font-bold mb-2 block">스토리 상 위치</label>
                      <input
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        value={editForm.position || ''}
                        onChange={e => setEditForm({ ...editForm, position: e.target.value })}
                        placeholder="예: 제 1막 후반부"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col min-h-[120px]">
                      <label className="text-sm text-zinc-500 font-bold mb-2 block">배경 및 상황</label>
                      <textarea
                        className="flex-1 w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed resize-none"
                        value={editForm.background || ''}
                        onChange={e => setEditForm({ ...editForm, background: e.target.value })}
                        placeholder="공간, 날씨, 시간대, 인물의 기본 액션 등..."
                      />
                    </div>

                    <div className="flex flex-col min-h-[120px]">
                      <label className="text-sm text-zinc-500 font-bold mb-2 block">스토리 전개와 관계성</label>
                      <textarea
                        className="flex-1 w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed resize-none"
                        value={editForm.relationship || ''}
                        onChange={e => setEditForm({ ...editForm, relationship: e.target.value })}
                        placeholder="인물 간의 대화, 갈등 상황, 전개 흐름..."
                      />
                    </div>

                    <div className="flex flex-col min-h-[120px]">
                      <label className="text-sm text-zinc-500 font-bold mb-2 block">서사적 기능 (성장의 계기 등)</label>
                      <textarea
                        className="flex-1 w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed resize-none"
                        value={editForm.narrative || ''}
                        onChange={e => setEditForm({ ...editForm, narrative: e.target.value })}
                        placeholder="이 씬이 전체 소설에서 가지는 의미나 복선..."
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full relative group">
                  <button
                    onClick={() => handleEditClick(selectedScene)}
                    className="absolute top-0 right-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg transition-colors font-bold flex items-center gap-2"
                  >
                    <span>✏️</span> 씬 편집
                  </button>
                  
                  <div className="mb-8 pr-32">
                    <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-sm font-bold rounded-full mb-3 tracking-wider border border-indigo-500/20">
                      📍 {selectedScene.position || '위치 미정'}
                    </span>
                    <h3 className="text-4xl font-black text-zinc-100 mb-6 tracking-tight">{selectedScene.title}</h3>
                    
                    <div className="space-y-8">
                      {selectedScene.background && (
                        <div>
                          <h4 className="text-lg font-bold text-zinc-300 mb-2 border-b border-zinc-800 pb-2">배경 및 상황</h4>
                          <p className="text-base text-zinc-400 whitespace-pre-wrap leading-relaxed">{selectedScene.background}</p>
                        </div>
                      )}
                      
                      {selectedScene.relationship && (
                        <div>
                          <h4 className="text-lg font-bold text-zinc-300 mb-2 border-b border-zinc-800 pb-2">스토리 전개와 관계성</h4>
                          <p className="text-base text-zinc-400 whitespace-pre-wrap leading-relaxed">{selectedScene.relationship}</p>
                        </div>
                      )}
                      
                      {selectedScene.narrative && (
                        <div>
                          <h4 className="text-lg font-bold text-zinc-300 mb-2 border-b border-zinc-800 pb-2">서사적 기능</h4>
                          <p className="text-base text-zinc-400 whitespace-pre-wrap leading-relaxed border-l-4 border-indigo-500/50 pl-4 py-1 bg-zinc-900/50 rounded-r-lg">
                            {selectedScene.narrative}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
