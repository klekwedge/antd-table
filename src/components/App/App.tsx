import { useState } from 'react';
import type { DatePickerProps } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, DatePicker, InputNumber, Input, Space } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ILine } from '../../types';
import './App.scss';

dayjs.extend(customParseFormat);
const dateFormat = 'DD.MM.YYYY';

function App() {
  const [columns, setColumns] = useState<ILine[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditLine, setCurrentEditLine] = useState<ILine | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [value, setValue] = useState<number | null>(0);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (date && name && value !== null) {
      if (currentEditLine) {
        setColumns([
          ...columns.map((item) =>
            item.key === currentEditLine.key
              ? {
                  ...currentEditLine,
                  name,
                  date,
                  value,
                }
              : item,
          ),
        ]);
      } else {
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

      setDate(new Date());
      setName('');
      setValue(0);
      setIsModalOpen(false);
    }
  };

  const deleteLine = (key: string) => {
    setColumns([...columns.filter((item) => item.key !== key)]);
  };

  const editLine = (line: ILine) => {
    setCurrentEditLine(line);
    setValue(line.value);
    setName(line.name);
    setDate(line.date);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentEditLine(null);
    setDate(new Date());
    setName('');
    setValue(0);
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
            value={name}
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
            value={value}
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
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((item) => (
            <tr key={item.key}>
              <td>{item.name}</td>
              <td>{item.date.toLocaleDateString()}</td>
              <td>{item.value}</td>
              <td>
                <Space style={{ display: 'flex' }}>
                  <Button type="primary" onClick={() => deleteLine(item.key)} icon={<DeleteOutlined />} />
                  <Button type="primary" onClick={() => editLine(item)} icon={<EditOutlined />} />
                </Space>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
