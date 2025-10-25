import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { authService } from '../../services/auth.service';
import { formatPoints } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { points } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <h1 className="text-2xl font-bold text-primary-600">가위바위보</h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">포인트:</span>
              <span className="text-lg font-bold text-primary-600">
                {formatPoints(points)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {user.displayName}
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
