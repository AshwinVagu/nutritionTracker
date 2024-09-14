import React, { useState } from 'react';
import { Upload, Button, Form, message } from 'antd';
import { UploadOutlined } from "@ant-design/icons";
import { Sidebar, Header } from "../components";
import axiosServer from '../services/api';
import "../styles/ETLUpload.scss";

const ETLUpload = (props) => {
    const [form] = Form.useForm();
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (info) => {
        setSelectedFiles(info.fileList.map((file) => file.originFileObj));
        form.validateFields(["etlFile"]);
    };

    const onUpload = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('etlFile', file);
            });

            const response = await axiosServer.post('/food-items/etl-data-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                message.success('File uploaded successfully');
                form.resetFields();
            }
        } catch (error) {
            console.error("Error!", error);
            message.error('Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="etl-container">
                <Sidebar />
                <div className="etl-body">
                    <h3>Please upload nutrition data, only ".csv" supported</h3>
                    <div className="etl-form">
                        <Form
                            form={form}
                            name="control-hooks"
                            onFinish={onUpload}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="ETL File"
                                name="etlFile"
                                rules={[
                                    { required: true, message: 'Please upload a file' },
                                ]}
                            >
                                <div style={{ width: 200 }}>
                                    <Upload.Dragger
                                        name="etlFileUpload"
                                        maxCount={1}
                                        accept=".csv"
                                        beforeUpload={(file) => {
                                            return false;
                                        }}
                                        onChange={handleFileChange}
                                    >
                                        <UploadOutlined style={{ fontSize: 20 }} />
                                    </Upload.Dragger>
                                </div>
                            </Form.Item>
                            <Form.Item>
                                <Button className="uploadButton" type="primary" htmlType="submit" loading={loading}>
                                    Upload
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                </div>
            </div>
        </>
    )
}

export { ETLUpload };
