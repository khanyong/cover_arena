import React, { useState, useEffect } from 'react';
import { LocationDetails } from './novelData';

interface LocationGlossaryProps {
  locations: LocationDetails[];
  onAddLocation: () => void;
  onUpdateLocation: (id: string, updates: Partial<Omit<LocationDetails, 'id'>>) => void;
  onDeleteLocation: (id: string) => void;
}

export const LocationGlossary: React.FC<LocationGlossaryProps> = ({
  locations,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LocationDetails>>({});

  useEffect(() => {
    if (locations.length > 0 && !locations.find(l => l.id === selectedLocationId)) {
      setSelectedLocationId(locations[0].id);
    } else if (locations.length === 0) {
      setSelectedLocationId(null);
    }
  }, [locations, selectedLocationId]);

  const selectedLocation = locations.find(l => l.id === selectedLocationId);

  const handleEditClick = (location: LocationDetails) => {
    setEditingId(location.id);
    setEditForm({
      name: location.name,
      description: location.description,
      visualTraits: location.visualTraits,
      importance: location.importance
    });
  };

  const handleSave = (id: string) => {
    onUpdateLocation(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-3xl font-black text-emerald-400 flex items-center gap-2">
          <span>🌍</span> 장소 구상
        </h2>
        <button
          onClick={onAddLocation}
          className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-lg flex items-center gap-2"
        >
          <span>➕</span> 새로운 장소 추가
        </button>
      </div>

      {(!locations || locations.length === 0) ? (
        <div className="flex-1 flex items-center justify-center text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800">
          작성된 장소가 없습니다. 소설의 주요 배경이 될 장소를 추가해 보세요!
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
          
          {/* Left Sidebar (List) */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 shrink-0">
            {locations.map(location => (
              <button
                key={location.id}
                onClick={() => { 
                  setSelectedLocationId(location.id); 
                  if (editingId !== location.id) setEditingId(null); 
                }}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedLocationId === location.id 
                    ? 'bg-zinc-800 border-emerald-500 shadow-md' 
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <span className="text-lg font-bold text-zinc-100">{location.name}</span>
              </button>
            ))}
          </div>

          {/* Right Main Area (Details/Edit) */}
          <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 p-8 shadow-inner relative">
            {selectedLocation ? (
              editingId === selectedLocation.id ? (
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <h3 className="text-xl font-bold text-zinc-100">장소 편집</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (confirm('이 장소를 정말 삭제하시겠습니까?')) {
                            onDeleteLocation(selectedLocation.id);
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
                        onClick={() => handleSave(selectedLocation.id)}
                        className="px-6 py-2 text-sm bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-400 transition-colors shadow-lg"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-sm text-zinc-500 font-bold mb-2 block">장소명</label>
                      <input
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        value={editForm.name || ''}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="예: 맥팔레인의 펍, NASA 통제실..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col min-h-[120px]">
                      <label className="text-sm text-zinc-500 font-bold mb-2 block">장소 특징 및 분위기</label>
                      <textarea
                        className="flex-1 w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-zinc-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all leading-relaxed resize-none"
                        value={editForm.description || ''}
                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="전체적인 분위기, 조명, 인구밀도, 소리 등..."
                      />
                    </div>

                    <div className="flex flex-col min-h-[120px]">
                      <label className="text-sm text-zinc-500 font-bold mb-2 block">구체적인 시각적 디테일</label>
                      <textarea
                        className="flex-1 w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-zinc-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all leading-relaxed resize-none"
                        value={editForm.visualTraits || ''}
                        onChange={e => setEditForm({ ...editForm, visualTraits: e.target.value })}
                        placeholder="주요 사물, 건축 양식, 색감, 특정 오브젝트..."
                      />
                    </div>

                    <div className="flex flex-col min-h-[120px]">
                      <label className="text-sm text-zinc-500 font-bold mb-2 block">스토리 내 중요도 및 상징성</label>
                      <textarea
                        className="flex-1 w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-zinc-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all leading-relaxed resize-none"
                        value={editForm.importance || ''}
                        onChange={e => setEditForm({ ...editForm, importance: e.target.value })}
                        placeholder="주인공이 각성하는 장소, 최종 결전의 무대 등..."
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full relative group">
                  <button
                    onClick={() => handleEditClick(selectedLocation)}
                    className="absolute top-0 right-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg transition-colors font-bold flex items-center gap-2"
                  >
                    <span>✏️</span> 장소 편집
                  </button>
                  
                  <div className="mb-8 pr-32">
                    <h3 className="text-4xl font-black text-zinc-100 mb-6 tracking-tight">{selectedLocation.name}</h3>
                    
                    <div className="space-y-8">
                      {selectedLocation.description && (
                        <div>
                          <h4 className="text-lg font-bold text-zinc-300 mb-2 border-b border-zinc-800 pb-2">장소 특징 및 분위기</h4>
                          <p className="text-base text-zinc-400 whitespace-pre-wrap leading-relaxed">{selectedLocation.description}</p>
                        </div>
                      )}
                      
                      {selectedLocation.visualTraits && (
                        <div>
                          <h4 className="text-lg font-bold text-zinc-300 mb-2 border-b border-zinc-800 pb-2">구체적인 시각적 디테일</h4>
                          <p className="text-base text-zinc-400 whitespace-pre-wrap leading-relaxed">{selectedLocation.visualTraits}</p>
                        </div>
                      )}
                      
                      {selectedLocation.importance && (
                        <div>
                          <h4 className="text-lg font-bold text-zinc-300 mb-2 border-b border-zinc-800 pb-2">스토리 내 중요도 및 상징성</h4>
                          <p className="text-base text-zinc-400 whitespace-pre-wrap leading-relaxed border-l-4 border-emerald-500/50 pl-4 py-1 bg-zinc-900/50 rounded-r-lg">
                            {selectedLocation.importance}
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
