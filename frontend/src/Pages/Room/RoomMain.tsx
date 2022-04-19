import React from 'react';
import { useParams } from 'react-router-dom';

function RoomMain() {
  const { roomId } = useParams();

  return <div>RoomMain : {roomId}</div>;
}

export default RoomMain;
