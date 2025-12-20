import { useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { useUsers } from '../../../shared/hooks/useCoverArena';
import { useQueryClient } from '@tanstack/react-query';

export default function UserManager() {
    const queryClient = useQueryClient();
    const [userFilter, setUserFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
    const { data: users = [], isLoading: userLoading } = useUsers(userFilter);

    const handleUserStatusChange = async (userId, newStatus) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    status: newStatus, // 'active', 'rejected', 'suspended'
                    approved: newStatus === 'active', // active일 때만 approved = true
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) {
                alert('회원 상태 변경에 실패했습니다: ' + error.message);
            } else {
                alert('회원 상태가 변경되었습니다.');
                queryClient.invalidateQueries(['users']); // 목록 새로고침
            }
        } catch (error) {
            alert('회원 상태 변경 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">👥 회원 관리</h2>
                <div className="flex gap-2">
                    {['all', 'pending', 'active', 'rejected', 'suspended'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setUserFilter(filter)}
                            className={`px-3 py-1 rounded text-sm capitalize ${userFilter === filter ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                    <button
                        onClick={() => queryClient.invalidateQueries(['users'])}
                        className="ml-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                    >
                        새로고침
                    </button>
                </div>
            </div>

            {userLoading ? (
                <div className="text-center text-white py-10">로딩 중...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-white">
                        <thead className="bg-white/10 text-gray-300">
                            <tr>
                                <th className="px-4 py-2 text-left">닉네임 / 이메일</th>
                                <th className="px-4 py-2 text-left">가입일</th>
                                <th className="px-4 py-2 text-left">상태</th>
                                <th className="px-4 py-2 text-left">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5">
                                    <td className="px-4 py-3">
                                        <div className="font-bold">{user.username || '이름 없음'}</div>
                                        <div className="text-xs text-gray-400">{user.email || user.id}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-300">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'active' ? 'bg-green-600' :
                                                user.status === 'suspended' ? 'bg-red-600' :
                                                    user.status === 'rejected' ? 'bg-gray-600' : 'bg-yellow-600'
                                            }`}>
                                            {user.status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={user.status || 'pending'}
                                            onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                                            className="bg-black/30 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="pending">대기</option>
                                            <option value="active">승인 (Active)</option>
                                            <option value="rejected">거절 (Rejected)</option>
                                            <option value="suspended">정지 (Suspended)</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-400">
                                        해당 조건의 회원이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
