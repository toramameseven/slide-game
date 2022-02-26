import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';

const Tile = (props) => {
  const tileSie = 8 * 4 + 20 + 1 + 4;
  let p = props.p;
  let i = props.i;
  let y = Math.trunc(p/4);
  let x = p % 4;

  if (props.i === 0 ) { return null; }

  return (
    <Box
      sx={{
        userSelect:'none',
        bgcolor: '#101010',
        color: 'grey.300',
        border: '1px solid',
        p: 2,
        borderRadius: 2,
        position: 'absolute',
        width: 20,
        height: 20,
        verticalAlign:'middle',
        textAlign: 'center',
        top: y * tileSie + 10,
        left: x * tileSie + 10,
        transition:  (theme) => theme.transitions.create(['top', 'left'], 
        {
          duration:  300,
          delay: 0,
          easing: 'cubic-bezier(.1,-0.35,.21,1.62)'
        }),
      }}
      onClick = {() => props.onClick(p)}
    >
      {i}
    </Box>
  )
};

const customTheme = createTheme({
});

const initialTiles = [...Array(16)].map((_, i) => i);

export default function Game() {
  const [tilePositions, setTilePositions] = React.useState(initialTiles);
  const [autoMode, setAutoMode] = React.useState(false);
  const [autoUpDown, setAutoUpDone] = React.useState(false);
  const [speed, setSpeed] = React.useState(30);

  const sliderChange = (event, newValue) => {
    setSpeed(newValue);
  };

  React.useEffect(() => {
    const moveAuto = () =>{
      let x = tilePositions[0] % 4;
      let y = Math.trunc(tilePositions[0] / 4);
      let xx = [0,1,2,3];
      let yy = [0,1,2,3];
      xx.splice(x, 1);
      yy.splice(y, 1);
  
      const moveToX = xx[Math.floor(Math.random()*3)]
      const moveToY = yy[Math.floor(Math.random()*3)]
  
      const pos = autoUpDown ? x + 4 * moveToY : moveToX + 4 * y;
      move(pos, tilePositions);
      setAutoUpDone(v => !v)
    }

    const timer = setTimeout(() => {
      if (autoMode){
        moveAuto();
      }
    }, speed);

    return () => {
      clearTimeout(timer);
    };
  }, [autoMode, autoUpDown, tilePositions,speed]);


  const initGame = () =>{
    setTilePositions(initialTiles);
  }


  // const [a, ...b] = [1, 2, 3];
  // console.log(a); // 1
  // console.log(b); // [2, 3]

  // a([1, 2, 3])
  // const[...a] = [1,2,3]

  // a([...a])

  const shuffleTile = ([...array]) =>{
    const shuffle = ([...array]) => {
      for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    setTilePositions(shuffle([...array]));
  }

  // p1   p2 clicked
  const move = (p2, positions) =>
  {
    let p1 = positions[0];
    const isMoveLeftRight = Math.trunc(p1/4) === Math.trunc(p2/4);
    const isMoveUpDown = p1 % 4 ===  p2 % 4;

    if (!isMoveLeftRight && !isMoveUpDown)
    {
      return;
    }

    const deltaIndex = isMoveLeftRight ? 1: 4;
    const d = Math.sign(p1-p2);
    const pos = [...positions];
    const minPos = Math.min(p1, p2);
    const maxPos = Math.max(p1, p2);

    for (let p = minPos; p < maxPos + 1; p += deltaIndex ){
      let index = positions.findIndex(v => v === p)
      if (p === p1)
        {pos[0] = p2}
      else
        {pos[index] = p + d * deltaIndex}
    }
    setTilePositions(pos)
  }


 return (
    <MuiThemeProvider theme={customTheme}>
      <Box sx={{position: 'relative', ml: 'autoMode', mr: 'autoMode', width:300, height:300}}>
        <Button onClick={initGame}>Init</Button>
        <Button onClick={() => shuffleTile(tilePositions)}>Shuffle</Button>
        <Button onClick={() => setAutoMode(!autoMode)}>{autoMode ? 'manual' : 'autoMode'}</Button>
        <Slider 
        aria-label="Volume" 
        value={speed} 
        onChange={sliderChange}
        min={50}
        step={10}
        max={500}
        />
        <Box sx={{position: 'relative', ml: 'autoMode', mr: 'autoMode', bgcolor: '#ff3311', width:250, height:250}}>
          {tilePositions.map((p, num) => { 
            return (<Tile key = {num} i = {num} p = {p} onClick = {(p) => move(p, tilePositions)}></Tile>);
          })}
        </Box>
      </Box>
    </MuiThemeProvider> 
  );
}
