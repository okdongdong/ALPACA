import React from 'react';
import ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import MainHeatmapChartDetail from './MainHeatmapChartDetail';
import { CalendarHeatmap } from 'reaviz';

const data = [
  {
    key: new Date(2020, 1, 1, 8, 0, 0, 0),
    data: 46,
  },
  {
    key: new Date(2020, 1, 2, 8, 0, 0, 0),
    data: 24,
  },
  {
    key: new Date(2020, 1, 3, 8, 0, 0, 0),
    data: 46,
  },
  {
    key: new Date(2020, 1, 4, 8, 0, 0, 0),
    data: 15,
  },
  {
    key: new Date(2020, 1, 5, 8, 0, 0, 0),
    data: 27,
  },
];

function MainHeatmapChart() {
  const [selected, setSelected] = React.useState('');

  const MainGridDiv = styled('div')({
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    marginBottom: '20px',
  });
  return (
    <MainGridDiv>
      <div>
        <div style={{ margin: '55px', textAlign: 'center' }}>
          <CalendarHeatmap height={115} width={715} data={data} />
        </div>
      </div>
    </MainGridDiv>
  );
}

export default MainHeatmapChart;
