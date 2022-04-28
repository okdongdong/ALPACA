import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function RoomStudyLiveChatInput() {
  const session = useSelector((state: any) => state.openviduReducer.session);
  const [message, setMessage] = useState<string>('안녕안녕');

  const sendChat = () => {
    session.signal({
      data: JSON.stringify({ message: message, profileImg: '' }),
      to: [],
      type: 'chat',
    });
  };
  return (
    <div>
      <button onClick={sendChat}>전송</button>
    </div>
  );
}

export default RoomStudyLiveChatInput;
