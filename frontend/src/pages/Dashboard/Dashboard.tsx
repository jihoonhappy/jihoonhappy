import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { Card } from '../../components/common/Card';
import { Header } from '../../components/layout/Header';
import { formatPoints } from '../../utils/formatters';
import { calculateWinRate } from '../../utils/gameLogic';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { points, stats } = useUserStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const winRate = calculateWinRate(stats.wins, stats.totalGames);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            환영합니다, {user.displayName}님!
          </h2>
          <p className="text-gray-600">게임 모드를 선택해주세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/pvc')}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">컴퓨터와 대결</h3>
              <p className="text-gray-600 mb-4">AI와 즉시 대결하세요</p>
              <div className="bg-primary-50 text-primary-700 py-2 px-4 rounded-lg">
                승리 시 +10 포인트
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/pvp')}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">⚔️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">플레이어 대결</h3>
              <p className="text-gray-600 mb-4">다른 플레이어와 실시간 대결</p>
              <div className="bg-green-50 text-green-700 py-2 px-4 rounded-lg">
                승리 시 +100 포인트
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/cvc')}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🎰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">관전 & 베팅</h3>
              <p className="text-gray-600 mb-4">AI 대결 관전 및 승부 예측</p>
              <div className="bg-purple-50 text-purple-700 py-2 px-4 rounded-lg">
                최대 3배 배당
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">내 전적</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">총 게임</span>
                <span className="text-2xl font-bold text-gray-900">
                  {stats.totalGames}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">승리</span>
                <span className="text-2xl font-bold text-green-600">{stats.wins}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">패배</span>
                <span className="text-2xl font-bold text-red-600">{stats.losses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">무승부</span>
                <span className="text-2xl font-bold text-gray-600">{stats.draws}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">승률</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {winRate}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">내 포인트</h3>
            <div className="text-center py-8">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {formatPoints(points)}
              </div>
              <p className="text-gray-600">포인트</p>
            </div>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                게임에서 승리하거나 베팅에 성공하여 포인트를 획득하세요!
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
