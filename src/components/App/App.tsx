/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unstable-nested-components */
import { useState, useRef } from 'react';
import type { DatePickerProps } from 'antd';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Modal, DatePicker, InputNumber, Input, Space, Table, InputRef } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import Highlighter from 'react-highlight-words';
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
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  type DataIndex = keyof ILine;

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<ILine> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Поиск
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Сброс
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Закрыть
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (val, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((val as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<ILine> = [
    {
      title: 'Имя',
      dataIndex: 'name',
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('name'),
      sorter: (a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1),
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.date.getTime() - b.date.getTime(),
      ...getColumnSearchProps('date'),
      render: (item) => <>{item.toLocaleDateString()}</>,
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('value'),
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
      setCurrentEditLine(null);
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
