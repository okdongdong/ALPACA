import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Button, styled } from '@mui/material';
import CBadge from './CBadge';

interface CProblemProps {
  number: number;
  level: number;
  title: string;
  backgroundColor?: string;
  button?: ReactJSXElement;
}

const ProblemContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  display: 'flex',
  justifyContent: 'space-around',
}));

const ProblemBox = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
}));

function CProblem({ number, level, title, button, backgroundColor }: CProblemProps) {
  // 새 창에서 문제페이지 띄워줌
  const onClickHandler = () => {
    window.open(`https://www.acmicpc.net/problem/${number}`, '_blank');
  };
  return (
    <ProblemContainer style={{ backgroundColor: backgroundColor }}>
      <ProblemBox onClick={onClickHandler}>
        <div>
          <CBadge tier={level} type="problem" />
          <div>{number}</div>
        </div>
        <div>{title}</div>
      </ProblemBox>
      {button}
    </ProblemContainer>
  );
}

export default CProblem;
