import { Button, styled } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setLoading } from './Redux/commonReducer';
import { setTheme } from './Redux/themeReducer';

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
}));

function Testbtn() {
  const dispatch = useDispatch();

  return (
    <div>
      <CustomButton>버튼이다</CustomButton>
      <Button onClick={() => dispatch(setTheme('basic'))}>1</Button>
      <Button onClick={() => dispatch(setTheme('dark'))}>2</Button>
      <Button onClick={() => dispatch(setTheme('olivegreen'))}>3</Button>
      <Button onClick={() => dispatch(setTheme('peachpink'))}>4</Button>
      <Button onClick={() => dispatch(setLoading(true))}>5</Button>
    </div>
  );
}

export default Testbtn;
