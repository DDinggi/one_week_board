import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 새로고침해도 로그인 유지

const useUserStore = create(
  persist(
    (set) => ({
      user: null, // 초기 상태: 로그인 안됨
      isLoggedIn: false,
      login: (userInfo) => set({ user: userInfo, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'user-storage', // 로컬 스토리지에 저장될 이름
    }
  )
);

export default useUserStore;