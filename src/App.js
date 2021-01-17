import React, { useEffect } from 'react';
//import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

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
      textTransform: "capitalize",
    },
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


  // Para seleccionar los sectores en la programacion
  const [selectedSectors, setSelectedSectors] = React.useState({
    aspersores_selection: false,
    bancal_1_selection: false,
    bancal_2_selection: false,
    bancal_3_W_selection: false,
    bancal_3_E_selection: false,
    huerto_selection: false,
  })
  const { aspersores_selection, bancal_1_selection, bancal_2_selection, bancal_3_W_selection, bancal_3_E_selection, huerto_selection } = selectedSectors;
  const error = [aspersores_selection, bancal_1_selection, bancal_2_selection, bancal_3_W_selection, bancal_3_E_selection, huerto_selection].filter((v) => v).length === 0;
  // Parametros para la fecha/hora
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  // Para el slider
  const [duracion, setDuracion] = React.useState(30);
  // Para el Checkbox
  const [ott, setOtt] = React.useState(false);


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

  async function set_task(id) {
    const requestOptions_POST = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          command_init: `python3 -u /home/dietpi/IoTScheduler/DeviceController.py --id ${id} --set 1 --mqtt && echo "Inicio ${id}: $(date +"%D %H:%M:%S")" >> /home/dietpi/riego_$(date +"%Y").log`,
          command_final: `python3 -u /home/dietpi/IoTScheduler/DeviceController.py --id ${id} --set 0 --mqtt && echo "Final ${id}: $(date +"%D %H:%M:%S")" >> /home/dietpi/riego_$(date +"%Y").log`,
          inicio: `${selectedDate.toString().split(" ")[4]} ${selectedDate.getDate()}/${selectedDate.getMonth()+1}`,// hh:mm [dd/MM]
          duracion: duracion,
          comentario: makeid(10),
          ott: !ott,
        })
    };
    const respuesta = await fetch(`${API_URL}/set_task`, requestOptions_POST);

    console.log(selectedDate, duracion, ott, selectedSectors)

    return respuesta;
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

  const handleSelectionChange = (event) => {
    setSelectedSectors({ ...selectedSectors, [event.target.name]: event.target.checked });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSliderChange = (event, newValue) => {
    setDuracion(newValue);
  };

  const handleBlur = () => {
    let max = 200
    if (duracion < 0) {
      setDuracion(0);
    } else if (duracion > max) {
      setDuracion(max);
    }
  };

  const handleInputChange = (event) => {
    setDuracion(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleOttChange = (event) => {
    setOtt(event.target.checked);
  };

  async function handleSetTask() {
    for (let i=0; i< Object.keys(selectedSectors).length; i++){
      if (selectedSectors[Object.keys(selectedSectors)[i]]){
        await set_task(Object.keys(selectedSectors)[i].replace("_selection",""));
      }
    }
  };

  function bool2string(b) {
    return b ? "1" : "0";
  }

  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

        <Typography id="discrete-slider" className="duracion" gutterBottom>
          <br></br>
          Duración
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            <Slider
              value={typeof duracion === 'number' ? duracion : 0}
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
              value={duracion}
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

        <FormControlLabel
          control={
            <Checkbox
              checked={ott}
              onChange={handleOttChange}
              name="ott"
              color="primary"
            />
          }
          label="Repetir periódicamente"
        />
        <br></br><br></br>
        <FormControl required error={error} component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Sectores</FormLabel>
          <FormGroup>
            <Grid container spacing={0} justify="center" alignItems="center">
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={aspersores_selection} onChange={handleSelectionChange} name="aspersores_selection" />}
                  label="Aspersores"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={bancal_1_selection} onChange={handleSelectionChange} name="bancal_1_selection" />}
                  label="Bancal 1"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={bancal_2_selection} onChange={handleSelectionChange} name="bancal_2_selection" />}
                  label="Bancal 2"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={bancal_3_W_selection} onChange={handleSelectionChange} name="bancal_3_W_selection" />}
                  label="Bancal 3 O"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={bancal_3_E_selection} onChange={handleSelectionChange} name="bancal_3_E_selection" />}
                  label="Bancal 3 E"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={huerto_selection} onChange={handleSelectionChange} name="huerto_selection" />}
                  label="Huerto"
                />
              </Grid>
            </Grid>
          </FormGroup>
          <FormHelperText>Selecciona al menos uno</FormHelperText>
        </FormControl>
        <br></br><br></br>
        <Button variant="contained" color="primary" onClick={handleSetTask}>
          Programar
        </Button>
      </Container>


    </div>
  );
}

export default App;



