import theme from './Lib/theme'

interface Props {
  themeId : 'basic' | 'dark' | 'olivegreen' | 'peachpink';
}

function Testbtn({themeId}:Props) {
  return (
    <div>
      <button style={{backgroundColor: theme[themeId].warning}}>
      testcolor
      </button>
      </div>
  )
}

export default Testbtn