import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';

function App() {
  return (
    <div className="App">
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
