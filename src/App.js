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

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id_zona, status: 1 })
  };

    fetch('http://rapsberry.local:5000/on_off',requestOptions)
        .then(response => response.json())
        .then(json => console.log(json));


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
