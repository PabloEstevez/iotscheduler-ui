import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';

function App() {
  
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div className="App">
      <Switch
        checked={state.checkedB}
        onChange={handleChange}
        color="primary"
        name="checkedB"
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
