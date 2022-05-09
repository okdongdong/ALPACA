import { createSlice } from '@reduxjs/toolkit';

interface Member {
  userId: number;
  isRoomMaker: boolean;
  nickname: string;
  profileImg: string;
}

interface MemberDict {
  [key: number]: { nickname: string; profileImg: string };
}

interface Schedule {
  id: number;
  finishedAt: Date;
  startedAt: Date;
}

interface roomInfo {
  title: string;
  info: string;
  members: Member[];
  memberDict: MemberDict;
  schedules: Schedule[];
  selectedDay: Date;
  selectedDayIdx: number;
  isStudyExist: boolean;
}

const initialState: roomInfo = {
  title: '',
  info: '',
  members: [],
  memberDict: {},
  schedules: [],
  selectedDay: new Date(),
  selectedDayIdx: 0,
  isStudyExist: false,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomInfo: (state, action) => ({ ...state, ...action.payload }),
    logout: (state) => {
      localStorage.clear();
      return {
        ...initialState,
      };
    },
  },
});

export const { setRoomInfo } = roomSlice.actions;

export default roomSlice.reducer;
