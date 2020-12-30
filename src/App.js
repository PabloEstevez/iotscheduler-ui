import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';

//imports para el calendario
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
//imports para el slider
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

function App() {
  
  //parametros para el slider
  const useStyles = makeStyles({
    root: {
      width: 300,
    },
  });
  
  function valuetext(value) {
    return `${value}°C`;
  }
  

  //parametros para el calendario
  const [selectedDate, setSelectedDate] = React.useState(new Date('2021-01-01T21:01:01'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //parametros para el switch

  const [state, setState] = React.useState({
    checked: true,
  });

  const handleChange = (event) => {
    //setState({ ...state, [event.target.name]: event.target.checked });
    let id_zona = 'huerto';
    let nuevoEstado;

    //Petición GET a gpio_status para obtener el estado del riego
    const requestOptions_GET = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id_zona })
    };

    fetch('http://rapsberry.local:5000/gpio_status')
        .then(response => response.json())
        .then(json => {
          console.log(json);
          nuevoEstado= !json;
        });
    
    
    //Petición POST a on_off para cambiar el estado del riego
    const requestOptions_POST = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id_zona, status: nuevoEstado })
    };    

    fetch('http://rapsberry.local:5000/on_off',requestOptions_POST)
        .then(response => response.json())
        .then(json => console.log(json)).then(setState({ ...state, checked: nuevoEstado }));
    
    

  };

  return (
    <div className="App">
      <Switch
        checked={state.checked}
        onChange={handleChange}
        color="primary"
        name="checked"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />

      <Button variant="contained" color="primary" onClick={() => {
        fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => console.log(json)).then(console.log("illo funciona"));
      }}>
          Hello World
      </Button>

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Fecha del riego"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Hora de inicio del riego"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>

      <Typography id="discrete-slider" gutterBottom>
        Duración del riego
      </Typography>
      <Slider
        defaultValue={30}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={110}
      />

      <Container fixed>
        <Checkbox
          defaultChecked
          color="primary"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <Typography id="discrete-slider" gutterBottom>
          Repetir de manera periódica este riego
        </Typography>
      </Container>


    </div>
  );
}

export default App;



