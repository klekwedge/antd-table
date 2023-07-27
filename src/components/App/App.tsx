import { useState } from 'react';
import './App.scss';
import { IColumn } from '../../types';

function App() {
  const [columns, setColumns] = useState<IColumn[]>([]);

  const addColumn = () => {};

  return (
    <div className="container">
      <button className='add-button' type="button" onClick={addColumn}>
        Добавить
      </button>
      <table>
        <tr>
          <th>Имя</th>
          <th>Дата</th>
          <th>Числовое значение</th>
        </tr>
        {
          columns.map(item => <tr>
            <td>{item.name}</td>
            <td>{item.date.toLocaleDateString()}</td>
            <td>{item.value}</td>
          </tr>)
        }
      </table>
    </div>
  );
}

export default App;
