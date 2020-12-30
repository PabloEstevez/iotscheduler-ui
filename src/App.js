import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';


function App() {
  
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
    </div>
  );
}

export default App;
