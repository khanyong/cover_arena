import React, { useState } from 'react';
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CharacterDetails>>({});

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
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-amber-500 flex items-center gap-2">
          <span>👥</span> 캐릭터 설정집
        </h2>
        <button
          onClick={onAddCharacter}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-xl transition-colors shadow-lg flex items-center gap-2"
        >
          <span>➕</span> 새로운 캐릭터 추가
        </button>
      </div>

      {(!characters || characters.length === 0) ? (
        <div className="text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800">
          등록된 캐릭터가 없습니다. 새 캐릭터를 추가해 보세요!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map(char => (
            <div 
              key={char.id} 
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col group transition-all hover:border-amber-500/30 shadow-lg"
            >
              {editingId === char.id ? (
                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-zinc-500 font-bold mb-1 block">이름</label>
                    <input
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500"
                      value={editForm.name || ''}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 font-bold mb-1 block">역할 (예: 주인공, 빌런)</label>
                    <input
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500"
                      value={editForm.role || ''}
                      onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 font-bold mb-1 block">한 줄 소개</label>
                    <input
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500"
                      value={editForm.tagline || ''}
                      onChange={e => setEditForm({ ...editForm, tagline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 font-bold mb-1 block">상세 설정</label>
                    <textarea
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500"
                      rows={5}
                      value={editForm.description || ''}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-2 border-t border-zinc-800 pt-4">
                    <button
                      onClick={() => {
                        if(confirm('이 캐릭터를 정말 삭제하시겠습니까?')) {
                          onDeleteCharacter(char.id);
                        }
                      }}
                      className="px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 rounded mr-auto"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleSave(char.id)}
                      className="px-3 py-1.5 text-xs bg-amber-500 text-zinc-950 font-bold rounded hover:bg-amber-400"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 flex flex-col h-full relative">
                  <button
                    onClick={() => handleEditClick(char)}
                    className="absolute top-4 right-4 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✏️ 수정
                  </button>
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-full mb-2 uppercase tracking-wider">
                      {char.role}
                    </span>
                    <h3 className="text-xl font-black text-zinc-100">{char.name}</h3>
                    <p className="text-sm text-zinc-400 mt-1 italic">"{char.tagline}"</p>
                  </div>
                  <div className="flex-1 text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed border-t border-zinc-800 pt-4">
                    {char.description}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
