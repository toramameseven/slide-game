import React from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Tile = ({position, num, onClick}) => {
  const tileSize = 8 * 4 + 20 + 1 + 4;
  if (num === 0 ) { return null; }
  return (
    <Box
      sx={{
        userSelect:'none',
        border: '1px solid',
        p: 2,
        position: 'absolute',
        width: 20,
        height: 20,
        textAlign: 'center',
        top: Math.trunc(position/4) * tileSize + 10,
        left: position % 4 * tileSize + 10,
        transition:  (theme) => theme.transitions.create(['top', 'left'], 
        {
          duration:  300,
          easing: 'cubic-bezier(.1,-0.35,.21,1.62)'
        }),
      }}
      onClick = {() => onClick(position)}
    >
      {num}
    </Box>)
};

export default function Game() {
  const [tilePositions, setTilePositions] = React.useState( [...Array(16)].map((_, i) => i));
  const [autoMode, setAutoMode] = React.useState(false);
  const [autoUpDown, setAutoUpDown] = React.useState(false);
  const [updateInterval, setUpdateInterval] = React.useState(250);

  const sliderChange = (event, newValue) => {
    setUpdateInterval(newValue);
  };

  React.useEffect(() => {
    const moveAuto = () =>{
      let x = tilePositions[0] % 4;
      let y = Math.trunc(tilePositions[0] / 4);
      let [xx, yy] = [[0,1,2,3], [0,1,2,3]];
      xx.splice(x, 1);
      yy.splice(y, 1);
      const [moveToX, moveToY] = [xx[Math.floor(Math.random()*3)], yy[Math.floor(Math.random()*3)]] 
      move((autoUpDown ? x + 4 * moveToY : moveToX + 4 * y), tilePositions);
      setAutoUpDown(v => !v)
    }
    const timer = setTimeout(() => {
      if (autoMode){
        moveAuto();
      }
    }, updateInterval);
    return () => {
      clearTimeout(timer);
    };
  }, [autoMode, autoUpDown, tilePositions,updateInterval]);

  const shuffleTile = ([...positions]) =>{
    for (let i = 0; i < positions.length; i++) {
      const j = Math.floor(Math.random() * (positions.length -i)) + i;
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    setTilePositions(positions);
  }

  const move = (posClicked, [...positions]) =>
  {
    const posEmpty = positions[0];
    const isMoveLeftRight = Math.trunc(posEmpty/4) === Math.trunc(posClicked/4);
    if (!isMoveLeftRight && !(posEmpty % 4 ===  posClicked % 4)) // && isMoveUpDown
    {
      return;
    }
    const deltaIndex = isMoveLeftRight ? 1: 4;
    const deltaPosition = Math.sign(posEmpty - posClicked) * deltaIndex;
    const pos = [...positions];
    const [minPos, maxPos]= [Math.min(posEmpty, posClicked), Math.max(posEmpty, posClicked)];
    for (let p = minPos; p < maxPos + 1; p += deltaIndex ){
      let index = positions.findIndex(v => v === p);
      p === posEmpty ? pos[0] = posClicked : pos[index] = p + deltaPosition;
    }
    setTilePositions(pos)
  }

  return (
    <ThemeProvider theme={createTheme({})}>
      <Box sx={{position: 'relative', ml: 'autoMode', mr: 'autoMode', width:220, height:300}}>
        <Typography>Slide Puzzle</Typography>
        <Button onClick={() => shuffleTile(tilePositions)}>Shuffle</Button>
        <Button onClick={() => setAutoMode(!autoMode)}>{autoMode ? 'manual' : 'automatic'}</Button>
        <Typography id="update-slider" gutterBottom>Automatic Update Interval</Typography>
        <Slider value={updateInterval} onChange={sliderChange} min={0} step={10} max={500} aria-labelledby="update-slider"/>
        <Box sx={{position: 'relative', ml: 'autoMode', mr: 'autoMode', width:250, height:250}}>
          {tilePositions.map((p, n) => { 
            return (<Tile key = {n} num = {n} position = {p} onClick = {(p) => move(p, tilePositions)}></Tile>)
          })}
        </Box>
      </Box>
    </ThemeProvider> 
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);

