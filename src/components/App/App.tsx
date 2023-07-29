import { useState } from 'react';
import type { DatePickerProps } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, DatePicker, InputNumber, Input, Space, Table, Tag } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import type { ColumnsType, TableProps } from 'antd/es/table';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ILine } from '../../types';
import './App.scss';

dayjs.extend(customParseFormat);
const dateFormat = 'DD.MM.YYYY';

function App() {
  const [lines, setLines] = useState<ILine[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditLine, setCurrentEditLine] = useState<ILine | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [value, setValue] = useState<number | null>(0);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const deleteLine = (key: string) => {
    setLines([...lines.filter((line) => line.key !== key)]);
  };

  const editLine = (line: ILine) => {
    setCurrentEditLine(line);
    setValue(line.value);
    setName(line.name);
    setDate(line.date);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<ILine> = [
    {
      title: 'Имя',
      dataIndex: 'name',
      sortDirections: ['descend'],
      sorter: (a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1),
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      sortDirections: ['descend'],
      sorter: (a, b) => a.date.getTime() - b.date.getTime(),
      render: (item) => <>{item.toLocaleDateString()}</>,
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      sortDirections: ['descend'],
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Действия',
      dataIndex: 'action',
      render: (_: any, record: ILine) => (
        <Space>
          <Button type="primary" onClick={() => deleteLine(record.key)} icon={<DeleteOutlined />} />
          <Button type="primary" onClick={() => editLine(record)} icon={<EditOutlined />} />
        </Space>
      ),
    },
  ];

  const handleOk = () => {
    if (date && name && value !== null) {
      if (currentEditLine) {
        setLines([
          ...lines.map((line) =>
            line.key === currentEditLine.key
              ? {
                  ...currentEditLine,
                  name,
                  date,
                  value,
                }
              : line,
          ),
        ]);
      } else {
        setLines([
          ...lines,
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
      <Table columns={columns} dataSource={lines} pagination={false} />
    </div>
  );
}

export default App;
