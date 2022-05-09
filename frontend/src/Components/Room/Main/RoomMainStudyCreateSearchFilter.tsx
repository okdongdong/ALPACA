import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  styled,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Member } from '../../../Redux/roomReducer';
import CBadge from '../../Commons/CBadge';
import CProfile from '../../Commons/CProfile';

interface RoomMainStudyCreateSearchFilterProps {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const TierBox = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
}));

function RoomMainStudyCreateSearchFilter({ setQuery }: RoomMainStudyCreateSearchFilterProps) {
  const members = useSelector((state: any) => state.room.members);

  const [tierValue, setTierValue] = useState<number>(1);
  const [memberChecked, setMemberChecked] = useState<boolean[]>(
    new Array(members.length).fill(false),
  );

  const onTierChageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTierValue(parseInt(event.target.value));
  };

  const onMemberCheckedChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const tempMemberChecked = [...memberChecked];

    tempMemberChecked[idx] = event.target.checked;

    setMemberChecked(tempMemberChecked);
  };

  useEffect(() => {
    setQuery('1');
  }, [tierValue]);

  return (
    <>
      <FormControl>
        <FormLabel id="problem-tier">문제 난이도</FormLabel>
        <RadioGroup row aria-labelledby="problem-tier" onChange={onTierChageHandler}>
          <TierBox>
            <FormControlLabel value={1} control={<Radio />} label={<CBadge tier={1} labelOff />} />
            <FormControlLabel value={6} control={<Radio />} label={<CBadge tier={6} labelOff />} />
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
                    checked={memberChecked[idx]}
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
