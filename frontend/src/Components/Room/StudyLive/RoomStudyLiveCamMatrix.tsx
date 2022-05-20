import React, { useEffect, useState } from 'react';
import RoomStudyLiveCamListItem from './RoomStudyLiveCamListItem';
import UserModel from './user-model';
type usersPropsType = {
  users: UserModel[];
};

function RoomStudyLiveCamMatrix({ users }: usersPropsType) {
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const gridContainer = {
    display: 'grid',
    height: '100%',
    gridTemplateColumns: `repeat(${width}, calc(80vw / ${width}))`,
    gridTemplateRows: `repeat(${height}, calc(80vh / ${height}))`,
  };
  useEffect(() => {
    if (users.length <= 1) {
      setWidth(1);
    } else if (users.length <= 4) {
      setWidth(2);
    } else if (users.length <= 9) {
      setWidth(3);
    } else {
      setWidth(4);
    }

    if (users.length <= 2) {
      setHeight(1);
    } else if (users.length <= 6) {
      setHeight(2);
    } else {
      setHeight(3);
    }
  }, [users]);
  return (
    <>
      <div style={gridContainer}>
        {users.map((user, index) => {
          return (
            user !== undefined && (
              <RoomStudyLiveCamListItem key={`${user.getConnectionId}-${index}`} user={user} />
            )
          );
        })}
      </div>
    </>
  );
}

export default RoomStudyLiveCamMatrix;
