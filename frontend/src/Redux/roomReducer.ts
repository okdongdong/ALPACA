import { createSlice } from '@reduxjs/toolkit';

export interface Member {
  userId: number;
  roomMaker: boolean;
  nickname: string;
  profileImg: string;
  bojId: string;
  isQuery?: boolean; // 문제검색 필터링시 사용
}

export interface MemberDict {
  [key: number]: { nickname: string; profileImg: string };
}

export interface Schedule {
  id: number;
  finishedAt: Date;
  startedAt: Date;
}

export interface DailySchedule {
  day: Date;
  schedule?: Schedule;
}

export interface SolvedMemberList {
  bojId: string;
  id: number;
  info: string;
  nickname: string;
  preferredLanguage: string;
  profileImg: string;
  theme: string;
  username: string;
}

export interface ProblemRes {
  level: number;
  problemNumber: number;
  title: string;
  solvedMemberList?: SolvedMemberList[];
}

export interface RoomInfo {
  title: string;
  info: string;
  members: Member[];
  memberDict: MemberDict;
  schedules: Schedule[];
  selectedDay: Date;
  selectedDayIdx: number;
  isStudyExist: boolean;

  // 현재 달력의 날짜계산 및 스케줄저장을 위한 변수
  dateRange: DailySchedule[];

  // 일정 수정모드 체크
  isEdit: boolean;

  // 스터디 조회
  startedAt: Date | null;
  finishedAt: Date | null;
  problemListRes: ProblemRes[];

  // 채팅 이전기록 조회
  offsetId: string;

  // 선택된 스케줄 아이디
  scheduleId: number | undefined;

  // 세팅창 오픈
  isSetting: boolean;
}

const initialState: RoomInfo = {
  title: '',
  info: '',
  members: [],
  memberDict: {},
  schedules: [],
  selectedDay: new Date(),
  selectedDayIdx: 0,
  isStudyExist: false,
  dateRange: [],
  isEdit: false,
  startedAt: new Date(),
  finishedAt: new Date(),
  problemListRes: [],
  offsetId: '',
  scheduleId: 0,
  isSetting: false,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomInfo: (state, action) => ({
      ...state,
      ...action.payload,
      schedules: action.payload.scheduleListRes,
    }),
    resetRoomInfo: (state) => ({ ...initialState }),
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setInfo: (state, action) => {
      state.info = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    setMemberDict: (state, action) => {
      state.memberDict = action.payload;
    },
    setSchedules: (state, action) => {
      state.schedules = action.payload;
    },
    setSelectedDay: (state, action) => {
      state.selectedDay = action.payload;
    },
    setSelectedDayIdx: (state, action) => {
      state.selectedDayIdx = action.payload;
      state.selectedDay = state.dateRange[action.payload]?.day;
    },
    setIsStudyExist: (state, action) => {
      state.isStudyExist = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    setStartedAt: (state, action) => {
      state.startedAt = action.payload;
    },
    setFinishedAt: (state, action) => {
      state.finishedAt = action.payload;
    },
    setProblemListRes: (state, action) => {
      state.problemListRes = action.payload;
    },
    setOffsetId: (state, action) => {
      state.offsetId = action.payload;
    },
    setScheduleId: (state, action) => {
      state.scheduleId = action.payload;
    },
    addSchedule: (state, action) => {
      state.dateRange[action.payload.idx].schedule = action.payload.schedule;
    },
    settingOn: (state) => {
      state.isSetting = !state.isSetting;
    },
    memberQueryCheck: (state, action) => {
      state.members[action.payload.idx].isQuery = action.payload.isChecked;
    },
    memberQueryUncheck: (state) => {
      state.members.forEach((member) => (member.isQuery = false));
    },
    resetProblemList: (state) => {
      state.problemListRes = [];
    },
    changeSelectedDay: (state, action) => {
      state.isEdit = false;
      state.problemListRes = [];
      state.isStudyExist = Boolean(state.dateRange[action.payload]?.schedule);
      state.scheduleId = state.dateRange[action.payload]?.schedule?.id;
    },
    setDailySchedule: (state) => {
      state.dateRange = calDailySchedule(state.dateRange, state.schedules);
    },
  },
});

const calDailySchedule = (dateRange: DailySchedule[], schedules: Schedule[]) => {
  let scheduleIdx = 0;
  for (let i = 0; i < dateRange.length; i++) {
    if (scheduleIdx < schedules.length) {
      let scheduleDay = new Date(schedules[scheduleIdx].startedAt);
      if (
        dateRange[i].day.getFullYear() === scheduleDay.getFullYear() &&
        dateRange[i].day.getMonth() === scheduleDay.getMonth() &&
        dateRange[i].day.getDate() === scheduleDay.getDate()
      ) {
        dateRange[i].schedule = schedules[scheduleIdx++];
      }
    }
  }
  return dateRange;
};

export const {
  setRoomInfo,
  resetRoomInfo,
  setTitle,
  setInfo,
  setMembers,
  setMemberDict,
  setSchedules,
  setSelectedDay,
  setSelectedDayIdx,
  setIsStudyExist,
  setDateRange,
  setIsEdit,
  setStartedAt,
  setFinishedAt,
  setProblemListRes,
  setOffsetId,
  setScheduleId,
  addSchedule,
  settingOn,
  memberQueryCheck,
  memberQueryUncheck,
  resetProblemList,
  changeSelectedDay,
  setDailySchedule,
} = roomSlice.actions;

export default roomSlice.reducer;
