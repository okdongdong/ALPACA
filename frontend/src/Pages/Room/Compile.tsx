import React from 'react';
import { useParams } from 'react-router-dom';

function Compile() {
  const { problemId } = useParams();

  return <div>Compile : {problemId}</div>;
}

export default Compile;
