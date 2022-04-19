import React from 'react';
import { useParams } from 'react-router-dom';

function Invite() {
  const { inviteId } = useParams();

  return <div>Invite : {inviteId}</div>;
}

export default Invite;
