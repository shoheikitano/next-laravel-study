// user global state

import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from "recoil-persist";

type UserState = { id: number; userid:string; projid:string; iconpath:string; email:string; password:string; name:string; } | null;

const { persistAtom } = recoilPersist({
	key: "recoil-persist",
	storage: typeof window === "undefined" ? undefined : sessionStorage　//修正
});

const userState = atom<UserState>({
  key: 'user',
  default: null,
  effects_UNSTABLE: [persistAtom]
});

export const useUserState = () => {
  const [user, setUser] = useRecoilState<UserState>(userState);

  return { user, setUser };
};
