import React from 'react';
import RoomStudyLiveCamListItem from './RoomStudyLiveCamListItem';
import UserModel from './user-model';
import { Stack, Item } from '@mui/material';

type usersPropsType = {
  users: UserModel[];
};

function RoomStudyLiveCamList({ users }: usersPropsType) {
  return (
    <Stack sx={{ width: '5vw' }}>
      {users.map((user) => {
        return (
          user !== undefined && (
            <RoomStudyLiveCamListItem key={user.getConnectionId()} user={user} />
          )
        );
      })}
    </Stack>
  );
}

export default RoomStudyLiveCamList;
