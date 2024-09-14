import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Form, InputNumber, DatePicker, Modal, message } from 'antd';
import { FoodItemSearch } from "../components";
import "../styles/AddConsumption.scss";
import moment from 'moment';
import axiosServer from '../services/api';
import { setUserTrackingRecords } from '../store';

const AddConsumption = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editConObj, setEditConObj] = useState(null);
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [selectedOption, setSelectedOption] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = (record) => {
        axiosServer.delete(`/tracking-records/delete-tracking-record/${record.id}`)
            .then(() => {
                getTrackingRecords();
            })
            .catch((error) => {
                console.log("Error!", error);
            });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'food_item_name',
            key: 'food_item_name',
            render: (text) => <div>{text}</div>,
        },
        {
            title: 'Date',
            dataIndex: 'consumption_time',
            key: 'consumption_time',
            render: (text) => <div>{moment(text).format("MM/DD/YYYY")}</div>,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity_in_grams',
            key: 'quantity_in_grams',
            render: (text) => <div>{text}</div>,
        },
        {
            title: 'Calories Consumed',
            dataIndex: 'consumed_calories',
            key: 'consumed_calories',
            render: (text) => <div>{text}</div>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: 5 }}>
                    <Button type="primary" onClick={() => {
                        setIsModalOpen(true);
                        setEditConObj(record);
                    }}>
                        Edit
                    </Button>
                    <Button type="primary" onClick={() => handleDelete(record)} danger>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const getTrackingRecords = async () => {
        try {
            const response = await axiosServer.get(`/tracking-records/get-tracking-records/${user.id}`, {
                headers: {
                    Accept: 'application/json',
                }
            });
            if (response) {
                const { data } = response;
                dispatch(setUserTrackingRecords(data));
                setData(data);
            }
        } catch (error) {
            console.log('Error!', error);
        }
    };

    useEffect(() => {
        if (user) {
            getTrackingRecords();
        }
    }, [user]);

    useEffect(() => {
        if (selectedOption) form.setFieldsValue({ "name": selectedOption });
    }, [selectedOption]);

    const handleAddData = async () => {
        try {
            const values = await form.validateFields();

            const { date, qty, name } = values;

            if (!name) {
                throw new Error('Please select a food item');
            }

            if (!date || !qty) {
                throw new Error('Please select a date and enter the quantity');
            }

            if (qty && parseInt(qty) < 1) {
                throw new Error('Quantity must be atleast 1');
            }

            const calories_calculated = (selectedOption.calories * qty) / 100;
            const submitObj = {
                consumed_calories: calories_calculated.toFixed(2),
                consumption_time: new Date(date),
                food_item_id: name.id,
                food_item_name: name.name,
                quantity_in_grams: qty,
                user_id: user.id,
            };

            await axiosServer.post('/tracking-records/add-tracking-record', submitObj);
            getTrackingRecords();
            form.resetFields();
            setSelectedOption('');
        } catch (error) {
            console.log('Validation Error:', error.message);
        }
    };

    const EditConsumtionModal = (props) => {
        const { isModalOpen, setIsModalOpen, editConObj, selectedOption } = props;

        const [editValue, setEditValue] = useState({ calories: editConObj?.consumed_calories, quantity: editConObj?.quantity_in_grams });

        const handleOk = () => {
            handleUpdate();
        };

        const handleCancel = () => {
            setIsModalOpen(false);
        };

        const handleUpdate = () => {
            const actual_calories = (parseInt(editConObj.consumed_calories) * 100) / parseInt(editConObj.quantity_in_grams)
            const calories_calculated = (actual_calories * parseInt(editValue.quantity)) / 100;
            const updatedConsumption = {
                consumed_calories: calories_calculated?.toFixed(2),
                consumption_time: editConObj.consumption_time,
                food_item_id: editConObj.food_item_id,
                food_item_name: editConObj.food_item_name,
                quantity_in_grams: parseInt(editValue.quantity),
                user_id: user.id,
                id: editConObj.id
            };

            axiosServer.put(`/tracking-records/update-tracking-record`, updatedConsumption)
                .then(() => {
                    getTrackingRecords();
                    messageApi.open({
                        type: 'success',
                        content: 'Consumption updated successfully',
                    });
                    setIsModalOpen(false);
                })
                .catch((error) => {
                    console.log("Error!", error);
                });
        };

        return <Modal title="Edit Consumption" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Update">
            <p className='modal-label'>Quantity:</p>
            <InputNumber value={editValue?.quantity} type="number" min={1} placeholder="Edit Quantity" onChange={(value) => setEditValue(prev => ({ ...prev, quantity: value }))} />
        </Modal>;
    };

    const handleFormChange = () => {
        form.validateFields();
    };

    const validateQuantity = (_, value) => {
        if (value < 1) {
            return Promise.reject('Quantity must be atleast 1');
        }
        return Promise.resolve();
    };

    return (
        <div className='add-consumtion-container'>
            {contextHolder}
            <h3>Add Food Consumption</h3>
            <div className='add-consumption-form'>
                <Form form={form} layout="inline" name="control-hooks" onFinish={handleAddData} autoComplete="off">
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please select a food item' }]}
                    >
                        <FoodItemSearch style={{ width: 200 }} placeholder={"search food..."} setSelectedOption={setSelectedOption} selectedOption={selectedOption} />
                    </Form.Item>
                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{ required: true, message: 'Please select the date' }]}
                    >
                        <DatePicker format={"MM/DD/YYYY"} />
                    </Form.Item>
                    <Form.Item
                        label="Quantity (in grams)"
                        name="qty"
                        // rules={[{ required: true, message: 'Please enter the quantity!' }]}
                        rules={[{ validator: validateQuantity }, { required: true, message: "Quantity is required" }]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType='submit'>
                            Add Data
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Table columns={columns} dataSource={data} pagination={false} />
            <EditConsumtionModal selectedOption={selectedOption} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editConObj={editConObj} setEditConObj={setEditConObj} />
        </div>
    );
};

export { AddConsumption };
