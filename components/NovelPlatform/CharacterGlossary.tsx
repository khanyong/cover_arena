import React, { useState, useEffect } from 'react';
import { CharacterDetails } from './novelData';

interface CharacterGlossaryProps {
  characters: CharacterDetails[];
  onAddCharacter: () => void;
  onUpdateCharacter: (id: string, updates: Partial<Omit<CharacterDetails, 'id'>>) => void;
  onDeleteCharacter: (id: string) => void;
}

export const CharacterGlossary: React.FC<CharacterGlossaryProps> = ({
  characters,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CharacterDetails>>({});

  useEffect(() => {
    if (characters.length > 0 && !characters.find(c => c.id === selectedCharId)) {
      setSelectedCharId(characters[0].id);
    } else if (characters.length === 0) {
      setSelectedCharId(null);
    }
  }, [characters, selectedCharId]);

  const selectedChar = characters.find(c => c.id === selectedCharId);

  const handleEditClick = (char: CharacterDetails) => {
    setEditingId(char.id);
    setEditForm({
      name: char.name,
      role: char.role,
      tagline: char.tagline,
      description: char.description
    });
  };

  const handleSave = (id: string) => {
    onUpdateCharacter(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-3xl font-black text-amber-500 flex items-center gap-2">
          <span>👥</span> 캐릭터 설정집
        </h2>
        <button
          onClick={() => {
            onAddCharacter();
            // The useEffect will handle selection if it's the first character,
            // but we want to select the newly added character if possible.
            // Since onAddCharacter adds it synchronously to state in parent, 
            // the list updates and we can just rely on user clicking it.
          }}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-xl transition-colors shadow-lg flex items-center gap-2"
        >
          <span>➕</span> 새로운 캐릭터 추가
        </button>
      </div>

      {(!characters || characters.length === 0) ? (
        <div className="flex-1 flex items-center justify-center text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800">
          등록된 캐릭터가 없습니다. 새 캐릭터를 추가해 보세요!
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
          
          {/* Left Sidebar (List) */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 shrink-0">
            {characters.map(char => (
              <button
                key={char.id}
                onClick={() => { 
                  setSelectedCharId(char.id); 
                  if (editingId !== char.id) setEditingId(null); 
                }}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedCharId === char.id 
                    ? 'bg-zinc-800 border-amber-500 shadow-md' 
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <span className="text-xs text-amber-500 font-bold block mb-1 uppercase tracking-wider">{char.role}</span>
                <span className="text-lg font-bold text-zinc-100">{char.name}</span>
              </button>
            ))}
          </div>

          {/* Right Main Area (Details/Edit) */}
          <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 p-8 shadow-inner relative">
            {selectedChar ? (
              editingId === selectedChar.id ? (
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <h3 className="text-xl font-bold text-zinc-100">캐릭터 설정 수정</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (confirm('이 캐릭터를 정말 삭제하시겠습니까?')) {
                            onDeleteCharacter(selectedChar.id);
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
                        onClick={() => handleSave(selectedChar.id)}
                        className="px-6 py-2 text-sm bg-amber-500 text-zinc-950 font-bold rounded-lg hover:bg-amber-400 transition-colors shadow-lg"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-zinc-500 font-bold mb-2 block">이름</label>
                      <input
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                        value={editForm.name || ''}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-zinc-500 font-bold mb-2 block">역할</label>
                      <input
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                        value={editForm.role || ''}
                        onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                        placeholder="예: 주인공, 빌런, 조력자"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-zinc-500 font-bold mb-2 block">한 줄 소개</label>
                    <input
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      value={editForm.tagline || ''}
                      onChange={e => setEditForm({ ...editForm, tagline: e.target.value })}
                      placeholder="캐릭터를 상징하는 짧은 문장이나 대사"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col min-h-[300px]">
                    <label className="text-sm text-zinc-500 font-bold mb-2 block">상세 설정 (성격, 외모, 배경, 목표 등)</label>
                    <textarea
                      className="flex-1 w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-zinc-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all leading-relaxed resize-none"
                      value={editForm.description || ''}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="자세한 설정을 입력하세요..."
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full relative group">
                  <button
                    onClick={() => handleEditClick(selectedChar)}
                    className="absolute top-0 right-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg transition-colors font-bold flex items-center gap-2"
                  >
                    <span>✏️</span> 설정 편집
                  </button>
                  
                  <div className="mb-8 pr-32">
                    <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 text-sm font-bold rounded-full mb-3 uppercase tracking-wider border border-amber-500/20">
                      {selectedChar.role}
                    </span>
                    <h3 className="text-4xl font-black text-zinc-100 mb-3 tracking-tight">{selectedChar.name}</h3>
                    <p className="text-lg text-zinc-400 italic border-l-4 border-amber-500/50 pl-4 py-1 bg-zinc-900/50 rounded-r-lg">
                      "{selectedChar.tagline}"
                    </p>
                  </div>
                  
                  <div className="flex-1 text-base text-zinc-300 whitespace-pre-wrap leading-loose border-t border-zinc-800/80 pt-8 mt-2">
                    {selectedChar.description}
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
