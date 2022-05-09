import { useEffect, useState } from 'react';

const TIER_COLOR = [
  '#BE7936', // 브론즈
  '#577088', // 실버
  '#FFB800', // 골드
  '#70ECC3', // 플레티넘
  '#54CDFD', // 다이아
  '#FF5093', // 루비
];

interface CBadgeProps {
  tier: number;
  type?: 'user' | 'problem';
  width?: number;
  height?: number;
  labelOff?: boolean;
}

function CBadge({ tier, type = 'user', width = 20, height = 25, labelOff = false }: CBadgeProps) {
  const [tierText, setTierText] = useState<string | number>(0);
  const [tierColor, setTierColor] = useState<string>('#cdcdcd');

  const calTierInfo = () => {
    if (tier === 0) {
      if (type === 'problem') {
        setTierColor('#000');
        setTierText('?');
      }

      return;
    } else if (tier < 31) {
      const colorIdx = Math.floor((tier - 1) / 5);
      setTierColor(TIER_COLOR[colorIdx]);
      setTierText(5 - ((tier - 1) % 5));
    } else {
      setTierColor('#000');
      if (type === 'user') {
        setTierText('M');
      } else {
        setTierText('?');
      }
    }
  };

  useEffect(() => {
    calTierInfo();
  }, [tier]);
  return (
    <div style={{ position: 'relative', width: 20, height: 20 }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 47 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 5H47V37.2042C41.6504 47.3975 23.5 55 23.5 55C23.5 55 5.34957 47.3975 0 37.2042V5Z"
          fill={tierColor}
        />
        <rect width="47" height="3" fill={tierColor} />
      </svg>

      <div
        style={{
          position: 'absolute',
          top: height / 2,
          left: width / 2,
          color: '#fff',
          fontSize: 16,
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
        {labelOff || tierText}
      </div>
    </div>
  );
}

export default CBadge;
