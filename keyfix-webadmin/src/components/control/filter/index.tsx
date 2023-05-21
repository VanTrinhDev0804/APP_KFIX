import { Radio, Select, DatePicker, Space } from 'antd';
import React, { useState } from 'react';
import './style.scss'
import { useAppDispatch } from '../../../redux/hooks';
import { filter } from '../../../redux/slice/filterSlice';
import { store } from '../../../redux/store';

const { Option } = Select;


const Filter: React.FC = () => {
    const [value, setValue] = useState(1);
    const dispatch = useAppDispatch()
    const formatDate = (dateString: string) => {
        const date = dateString.split('-');
        const rsFormattedDate = `${date[0]}/${date[1]}/${date[2]}`;
        return rsFormattedDate// Output: 2/5/2022
    }

    function handleDateChange(date: any, dateString: string) {
        dispatch(filter({
            date: formatDate(dateString),
            month: '',
            year: '',
        }))
    }

    const handleMonthChange = (value: string) => {
        dispatch(filter({
            date: '',
            month: value,
            year: '',
        }))
    }
    
    const handleYearChange = (value: string) => {
        dispatch(filter({
            ...store.getState().filter.dataFilter,
            year: value
        }))
    }

    const handleYearFChange = (date: any, dateString: any) => {
        dispatch(
            filter({
                date: '',
                month: '',
                year: dateString,
            })
        ) 
      }

    const handleChangeRadio = (e: any) => {
        setValue(e.target.value);
        dispatch(
            filter({
                date: '',
                month: '',
                year: '',
            })
        )    
    };

  return (
    <Space direction="vertical">
        <Radio.Group onChange={handleChangeRadio} value={value}>
            <Radio value={1} className='color-radio'>Theo ngày</Radio>
            <Radio value={2} className='color-radio'>Theo tháng</Radio>
            <Radio value={3} className='color-radio'>Theo năm</Radio>
            <Radio value={4} className='color-radio'>Theo quý</Radio>
        </Radio.Group>
        <Space direction="vertical" size={12}>
            {value === 1 && <DatePicker placeholder="Chọn ngày" onChange={handleDateChange} format="DD-M-YYYY" /> }
            {value === 2 && <Space direction="horizontal">
               <Select placeholder="Lọc theo tháng" onChange={handleMonthChange}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        // <Option key={month} value={month.toString().padStart(2, '0')}>
                        <Option key={month} value={month.toString()}>
                            {month}
                        </Option>
                    ))}
                </Select>
               <Select  placeholder="Lọc theo năm" onChange={handleYearChange}>
                    {Array.from({ length:  new Date().getFullYear()-2000 + 1}, (_, i) => i + 2000).map((year) => (
                        <Option key={year} value={year.toString()}>
                            {year}
                        </Option>
                    ))}
                </Select>
                
            </Space >}
            {value === 3 && <DatePicker picker="year" onChange={handleYearFChange}/>}
        </Space>
    </Space>
  );
};

export default Filter;