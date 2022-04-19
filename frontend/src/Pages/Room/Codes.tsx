import React from 'react';
import { useParams } from 'react-router-dom';

function Codes() {
  const { codeId } = useParams();

  return <div>Codes : {codeId}</div>;
}

export default Codes;
