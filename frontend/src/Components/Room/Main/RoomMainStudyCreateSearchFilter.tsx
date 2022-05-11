import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  styled,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Member, memberQueryCheck } from '../../../Redux/roomReducer';
import CBadge from '../../Commons/CBadge';
import CProfile from '../../Commons/CProfile';

interface RoomMainStudyCreateSearchFilterProps {
  tierValue: number;
  setTierValue: React.Dispatch<React.SetStateAction<number>>;
}

const TierBox = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
}));

function RoomMainStudyCreateSearchFilter({
  tierValue,
  setTierValue,
}: RoomMainStudyCreateSearchFilterProps) {
  const dispatch = useDispatch();

  const members = useSelector((state: any) => state.room.members);

  const onTierChageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTierValue(parseInt(event.target.value));
  };

  const onMemberCheckedChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    dispatch(memberQueryCheck({ idx, isChecked: event.target.checked }));
  };

  return (
    <>
      <FormControl sx={{ width: '100%' }}>
        <FormLabel id="problem-tier">문제 난이도</FormLabel>
        <RadioGroup
          row
          aria-labelledby="problem-tier"
          onChange={onTierChageHandler}
          value={tierValue}
          sx={{ width: '100%' }}>
          <Stack sx={{ width: '100%' }}>
            <TierBox>
              <FormControlLabel value={0} control={<Radio />} label="전체" />
            </TierBox>
            <TierBox>
              <FormControlLabel
                value={1}
                control={<Radio />}
                label={<CBadge tier={1} labelOff />}
              />
              <FormControlLabel
                value={6}
                control={<Radio />}
                label={<CBadge tier={6} labelOff />}
              />
              <FormControlLabel
                value={11}
                control={<Radio />}
                label={<CBadge tier={11} labelOff />}
              />
            </TierBox>
            <TierBox>
              <FormControlLabel
                value={16}
                control={<Radio />}
                label={<CBadge tier={16} labelOff />}
              />
              <FormControlLabel
                value={21}
                control={<Radio />}
                label={<CBadge tier={21} labelOff />}
              />
              <FormControlLabel
                value={26}
                control={<Radio />}
                label={<CBadge tier={26} labelOff />}
              />
            </TierBox>
          </Stack>
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel id="problem-member">멤버가 풀지 않은 문제만</FormLabel>
        <RadioGroup aria-labelledby="problem-member">
          <FormControlLabel
            value={0}
            control={<Checkbox checked={true} onChange={() => {}} name="전체" />}
            label={'전체'}
          />
          <div>
            {members.map((member: Member, idx: number) => (
              <FormControlLabel
                key={idx}
                value={1}
                control={
                  <Checkbox
                    checked={member.isQuery}
                    onChange={(event) => onMemberCheckedChangeHandler(event, idx)}
                    name={member.nickname}
                  />
                }
                label={<CProfile nickname={member.nickname} profileImg={member.profileImg} />}
              />
            ))}
          </div>
        </RadioGroup>
      </FormControl>
    </>
  );
}

export default RoomMainStudyCreateSearchFilter;
