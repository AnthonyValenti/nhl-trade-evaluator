import './App.css';
import Table from './components/Table';

function App() {
  return (
    <div className="App">
      <h1>NHL Trade Evaulator</h1>
      <div className='tablesContainer'>
        <Table></Table>
        <div className='spacing'></div>
        <Table></Table>
      </div>

    </div>
  );
}

export default App;
