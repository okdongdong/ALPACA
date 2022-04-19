import theme from './Lib/Theme'

interface Props {
  themeId : 'basic' | 'dark' | 'olivegreen' | 'peachpink';
}

function Testbtn({themeId}:Props) {
  return (
    <div>
      <button style={{backgroundColor: theme[themeId].background}}>
      testcolor
      </button>
      </div>
  )
}

export default Testbtn