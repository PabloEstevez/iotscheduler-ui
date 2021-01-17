import React, { useEffect } from 'react';
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

  const useStyles = makeStyles({
    root: {
      width: 250,
    },
    input: {
      width: 42,
    },
    paper: {
      backgroundColor: "#cfe8fc",
      alignContent: "flex-end",
      marginBottom: 10,
    }
  });

  const classes = useStyles();
  // Parametros para el Switch
  const [sectorState, setSectorState] = React.useState({
    aspersores: false,
    bancal_1: false,
    bancal_2: false,
    bancal_3_W: false,
    bancal_3_E: false,
    huerto: false,
  })

  // INIT
  useEffect(() => {
    let newState = {};
    console.log("sectorState: ", sectorState)
    Object.keys(sectorState).forEach(key => {
      gpio_status(key).then(status => {
        newState[key] = status;
      })
    });
    console.log("newState: ", newState);
    setSectorState(newState);
    console.log("newSectorState: ", sectorState)
  }, []);

  // Parametros para la fecha/hora
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  // Para el slider
  const [value, setValue] = React.useState(30);


  // API HELPERS
  async function gpio_status(id) {
    const respuesta = await fetch(`${API_URL}/gpio_status?id=${encodeURIComponent(id)}`, requestOptions_GET);
    const estado = await respuesta.json();
    return !!estado.gpio_status;
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

  async function get_devices() {
    const respuesta = await fetch(`${API_URL}/get_devices`, requestOptions_GET);
    const devices = await respuesta.json();
    return devices.devices;
  }

  // FUNCIONES

  const handleSwitchChange = async (event) => {
    let id_sector = event.target.name;
    gpio_status(id_sector)
      .then(estado => {
        on_off(id_sector, !estado)
          .then(() => setSectorState({ ...sectorState, [event.target.name]: !estado }))
      });
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBlur = () => {
    let max = 200
    if (value < 0) {
      setValue(0);
    } else if (value > max) {
      setValue(max);
    }
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };


  function bool2string(b) {
    return b ? "1" : "0";
  }

  /*function Sector(id_sector) {
    useEffect(() => {
      gpio_status(id_sector).then(estado => {
        if (estado !== sectorState[id_sector])
          setSectorState({ ...sectorState, [id_sector]: estado })
      })
    }, []);
    return (
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <Grid container spacing={1} justify="center" alignItems="center">
            <Grid item xs={7}>
              {id_sector}
            </Grid>
            <Grid item xs={4}>
              <Switch
                className="switch"
                checked={sectorState[id_sector]}
                onChange={handleSwitchChange}
                color="primary"
                name={id_sector}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }*/


  return (
    <div className="App">
      <Container fixed>
        <Grid container spacing={1} justify="center" alignItems="center">
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Grid container spacing={1} justify="center" alignItems="center">
                <Grid item xs={7}>
                  Aspersores
                </Grid>
                <Grid item xs={4}>
                  <Switch
                    className="switch"
                    checked={sectorState.aspersores}
                    onChange={handleSwitchChange}
                    color="primary"
                    name="aspersores"
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
                  1 Bancal
                </Grid>
                <Grid item xs={4}>
                  <Switch
                    className="switch"
                    checked={sectorState.bancal_1}
                    onChange={handleSwitchChange}
                    color="primary"
                    name="bancal_1"
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
                  2 Bancal
                </Grid>
                <Grid item xs={4}>
                  <Switch
                    className="switch"
                    checked={sectorState.bancal_2}
                    onChange={handleSwitchChange}
                    color="primary"
                    name="bancal_2"
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
                  3 Bancal O
                </Grid>
                <Grid item xs={4}>
                  <Switch
                    className="switch"
                    checked={sectorState.bancal_3_W}
                    onChange={handleSwitchChange}
                    color="primary"
                    name="bancal_3_W"
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
                  3 Bancal E
                </Grid>
                <Grid item xs={4}>
                  <Switch
                    className="switch"
                    checked={sectorState.bancal_3_E}
                    onChange={handleSwitchChange}
                    color="primary"
                    name="bancal_3_E"
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
                  Huerto
                </Grid>
                <Grid item xs={4}>
                  <Switch
                    className="switch"
                    checked={sectorState.huerto}
                    onChange={handleSwitchChange}
                    color="primary"
                    name="huerto"
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
              label="Hora de inicio"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>

        <Typography id="discrete-slider" gutterBottom>
          <br></br>
          Duración
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            <Slider
              value={typeof value === 'number' ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
              step={5}
              min={5}
              max={200}
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
                max: 200,
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
          Repetir periódicamente
        </Typography>
      </Container>


    </div>
  );
}

export default App;



