import { useState } from 'react';
import type { DatePickerProps } from 'antd';
import { Button, Modal, DatePicker, InputNumber, Input, Space } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { IColumn } from '../../types';
import './App.scss';

dayjs.extend(customParseFormat);
// 19.12.2019
const dateFormat = 'DD.MM.YYYY';

function App() {
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>();
  const [value, setValue] = useState<number | null>(0);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (date && name && value !== null) {
      setIsModalOpen(false);
      setColumns([
        ...columns,
        {
          name,
          date,
          value,
          key: uuidv4(),
        },
      ]);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange: DatePickerProps['onChange'] = (dateValue, dateString) => {
    setDate(new Date(dateString));
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
          <Button key="submit" type="primary" onClick={handleOk} disabled={!name || value === null}>
            Подтвердить
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ display: 'flex' }}>
          <Input
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%' }}
            placeholder="Введите имя"
            status={name ? '' : 'error'}
          />
          <DatePicker
            defaultValue={dayjs(new Date().toLocaleDateString(), dateFormat)}
            style={{ width: '100%' }}
            onChange={onChange}
            placeholder="Введите дату"
          />
          <InputNumber
            onChange={(e) => setValue(e)}
            style={{ width: '100%' }}
            defaultValue={0}
            placeholder="Введите значение"
            status={value === null ? 'error' : ''}
          />
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
