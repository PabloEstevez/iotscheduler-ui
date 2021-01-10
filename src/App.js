import React from 'react';
//import logo from './logo.svg';
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

  // VARIABLES GLOBALES
  const API_URL = "http://raspberry.local:5000";
  const requestOptions_GET = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };


  //parametros para el slider
  const classes = makeStyles({
    slider: {
      width: 50,
    },
  });

  function valuetext(value) {
    return `${value} minutos`;
  }


  //parametros para el calendario
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //parametros para el switch

  const [state, setState] = React.useState({
    checked: false,
    checkedTest: false,
  });

  // FUNCIONES

  const handleSwitchChange = async (event) => {
    //setState({ ...state, [event.target.name]: event.target.checked });
    let id_sector = 'huerto';
    //let nuevoEstado;

    //Petición GET a gpio_status para obtener el estado del riego
    const estado = await fetch(`${API_URL}/gpio_status?id=${encodeURIComponent(id_sector)}`, requestOptions_GET)
      .then(response => response.json().gpio_status);
      /*.then(json => {
        nuevoEstado = !json.gpio_status;
        console.log("Nuevo estado: " + nuevoEstado);
      });*/
    
    //Petición POST a on_off para cambiar el estado del riego
    const requestOptions_POST = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "id": id_sector, "status": bool2string(!estado) })
    };

    await fetch(`${API_URL}/on_off`, requestOptions_POST)
      .then(response => response.json())
      .then(json => console.log(json)).then(setState({ ...state, checked: await !estado })).then(console.log("Estado: " + estado));
  };

  const testHandleSwitchChange = async (event) => {
    let id_sector = "huerto";
    //let estado = true;

    gpio_status(id_sector)
    .then(estado => {
      //console.log(typeof(estado.gpio_status))
      on_off(id_sector, !!!estado.gpio_status)
      .then(() => setState({ ...state, [event.target.name]: !!!estado.gpio_status }))
    });

    //console.log(estado)    
  }

  function bool2string(b){
    return b ? "1" : "0"; 
  }

  async function gpio_status(id){
    const respuesta = await fetch(`${API_URL}/gpio_status?id=${encodeURIComponent(id)}`, requestOptions_GET);
    const estado = await respuesta.json();
    return estado;
  }

  async function on_off(id, status){
    const requestOptions_POST = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "id": id, "status": bool2string(status) })
    };

    const respuesta = await fetch(`${API_URL}/on_off`, requestOptions_POST);
    return respuesta;
  }

  return (
    <div className="App">
      <Container fixed>
        <Switch
          checked={state.checked}
          onChange={handleSwitchChange}
          color="primary"
          name="checked"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />

        <Button variant="contained" color="primary" onClick={() => {
          let id_sector = 'huerto';
          let nuevoEstado = 1;
          const requestOptions_POST = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "id": id_sector, "status": nuevoEstado.toString() })
          };

          fetch(`${API_URL}/on_off`, requestOptions_POST)
            .then(response => response.json())
            .then(json => console.log(json));
        }}>
          Enciende
      </Button>

      <Button variant="contained" color="secondary" onClick={() => {
          let id_sector = 'huerto';
          let nuevoEstado = 0;
          const requestOptions_POST = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "id": id_sector, "status": nuevoEstado.toString() })
          };

          fetch(`${API_URL}/on_off`, requestOptions_POST)
            .then(response => response.json())
            .then(json => console.log(json));
        }}>
          Apaga
      </Button>

      <Switch
          checked={state.checkedTest}
          onChange={testHandleSwitchChange}
          color="primary"
          name="checkedTest"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />

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
          Duración
        </Typography>
        <Slider
          margin="normal"
          className={classes.slider}
          defaultValue={30}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          marks
          min={5}
          max={180}
        />
        <Checkbox
          color="primary"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <Typography id="discrete-slider" gutterBottom>
          Repetir de manera periódica
        </Typography>
      </Container>


    </div>
  );
}

export default App;



