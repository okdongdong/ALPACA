import React, { useEffect } from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { dateToStringDate } from '../../../Lib/dateToString';

interface RoomMainStudyCreateTimeProps {
  selectedDay: Date;
  startedAt: Date | null;
  finishedAt: Date | null;
  setStartedAt: React.Dispatch<React.SetStateAction<Date | null>>;
  setFinishedAt: React.Dispatch<React.SetStateAction<Date | null>>;
}

function RoomMainStudyCreateTime({
  selectedDay,
  startedAt,
  finishedAt,
  setStartedAt,
  setFinishedAt,
}: RoomMainStudyCreateTimeProps) {
  // 시작시간을 종료시간보다 더 늦게 설정했을 때
  useEffect(() => {
    if (!!startedAt && !!finishedAt && startedAt.getTime() > finishedAt.getTime()) {
      setFinishedAt(startedAt);
    }
  }, [startedAt]);

  // 종료시간을 시작시간보다 더 빠르게 설정했을 때
  useEffect(() => {
    if (!!startedAt && !!finishedAt && startedAt.getTime() > finishedAt.getTime()) {
      setStartedAt(finishedAt);
    }
  }, [finishedAt]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div>일시: {dateToStringDate(selectedDay)}</div>
      <div>
        시작시간:
        <TimePicker
          value={startedAt}
          onChange={setStartedAt}
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
      <div>
        종료시간:
        <TimePicker
          value={finishedAt}
          onChange={setFinishedAt}
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
    </LocalizationProvider>
  );
}

export default RoomMainStudyCreateTime;
