import React from 'react';
//import logo from './logo.svg';
import './App.css';
//import Button from '@material-ui/core/Button';
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

//imports para el slider2
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
//import VolumeUp from '@material-ui/icons/VolumeUp';

//imports para los grid
import Paper from '@material-ui/core/Paper';

function App() {

  // VARIABLES GLOBALES
  const API_URL = "http://raspberry.local:5000";
  const requestOptions_GET = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };

  //parametros para el slider

  const useStyles = makeStyles({
    root: {
      width: 250,
    },
    input: {
      width: 42,
    },
    paper: {
      backgroundColor: "#cfe8fc",
      alignContent: "flex-end"
    }
  });

  const classes = useStyles();
  const [value, setValue] = React.useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    let max = 180
    if (value < 0) {
      setValue(0);
    } else if (value > max) {
      setValue(max);
    }
  };



  //parametros para el calendario
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //parametros para el switch

  const [state, setState] = React.useState({
    checked: false,
    checkedTest: false,
    huerto: false,
    aspersores: false,
  });

  // FUNCIONES

  const handleSwitchChange = async (event) => {
    let id_sector = event.target.name;

    gpio_status(id_sector)
      .then(estado => {
        //console.log(typeof(estado.gpio_status))
        on_off(id_sector, !!!estado.gpio_status)
          .then(() => setState({ ...state, [event.target.name]: !!!estado.gpio_status }))
      });
  }

  function bool2string(b) {
    return b ? "1" : "0";
  }

  async function gpio_status(id) {
    const respuesta = await fetch(`${API_URL}/gpio_status?id=${encodeURIComponent(id)}`, requestOptions_GET);
    const estado = await respuesta.json();
    return estado;
  }

  async function on_off(id, status) {
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
        <Grid container spacing={1} justify="center" alignItems="center">
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Grid container spacing={1} justify="center" alignItems="center">
                <Grid item xs={7}>
                  Huerto
                </Grid>
                <Grid item xs={4}>
                  <Switch
                    className="switch"
                    checked={state.huerto}
                    onChange={handleSwitchChange}
                    color="primary"
                    name="huerto"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Grid container spacing={1} justify="center" alignItems="center">
                <Grid item xs={7}>
                  Aspersores
                </Grid>
                <Grid item xs={4}>
                  <Switch
                    className="switch"
                    checked={state.aspersores}
                    onChange={handleSwitchChange}
                    color="primary"
                    name="aspersores"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </Grid>
              </Grid>
            </Paper>

          </Grid>
        </Grid>


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

        {/** SLIDER */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              value={typeof value === 'number' ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item>
            <Input
              className={classes.input}
              value={value}
              margin="dense"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 5,
                min: 1,
                max: 180,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
        </Grid>

        {/**  
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
        */}



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



