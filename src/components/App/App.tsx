import { useState } from 'react';
import { Button, Modal, Input, Space } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import './App.scss';
import { IColumn } from '../../types';

function App() {
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        name: '11221',
        date: new Date(),
        value: 5,
        key: uuidv4(),
      },
    ]);
  };

  return (
    <div className="container">
      <Modal
        title="Добавить запись"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Назад
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Подтвердить
          </Button>
        ]}
      >
        <Space direction="vertical" style={{ display: 'flex' }}>
          <Input className="input" placeholder="Введите имя" />
          <Input className="input" placeholder="Введите дату" />
          <Input className="input" placeholder="Введите значение" />
        </Space>
      </Modal>
      <Button className="add-button" type="primary" onClick={showModal}>
        Добавить
      </Button>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Дата</th>
            <th>Числовое значение</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((item) => (
            <tr key={item.key}>
              <td>{item.name}</td>
              <td>{item.date.toLocaleDateString()}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
