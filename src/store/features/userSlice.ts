import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  image: string | null;
  emailVerified: boolean | null;
  loading: boolean;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  role: null,
  image: null,
  emailVerified: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Omit<UserState, 'loading'>>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.image = action.payload.image;
      state.emailVerified = action.payload.emailVerified;
      state.loading = false; 
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearUser(state) {
      state.id = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.image = null;
      state.emailVerified = null;
      state.loading = false;
    },
  },
});

export const { setUser, setLoading, clearUser } = userSlice.actions;
export default userSlice.reducer;