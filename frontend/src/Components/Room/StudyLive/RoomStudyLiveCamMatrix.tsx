import React, { useEffect, useState } from 'react';
import RoomStudyLiveCamListItem from './RoomStudyLiveCamListItem';
import UserModel from './user-model';
import { Grid } from '@mui/material';
type usersPropsType = {
  users: UserModel[];
};

function RoomStudyLiveCamMatrix({ users }: usersPropsType) {
  const [width, setWidth] = useState(12);
  useEffect(() => {
    if (users.length <= 1) {
      setWidth(12);
    } else if (users.length <= 4) {
      setWidth(6);
    } else if (users.length <= 9) {
      setWidth(4);
    } else {
      setWidth(3);
    }
  }, [users]);
  return (
    <>
      <Grid container columns={12} spacing={3}>
        {users.map((user) => {
          return (
            <Grid item xs={12} md={width}>
              <RoomStudyLiveCamListItem user={user} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

export default RoomStudyLiveCamMatrix;
