import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, message } from "antd";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Logo } from '../components';
import axiosServer from '../services/api';

// Functional component for user registration
const Register = () => {
  // Declare and initialize state variables using hooks
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useSelector(state => state.user)

  // useEffect to reset form fields when the component mounts
  useEffect(() => {
    form.setFieldsValue({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      height: "",
      weight: "",
      phone: "",
    })
  }, []);

  // Function to register a new user with email and password
  const registerWithMail = () => {
    const { email, password } = form.getFieldsValue();
    createUserWithEmailAndPassword(auth, email, password).then(async result => {
      // Display success message on successful account creation
      messageApi.open({
        type: 'success',
        content: 'Account creation successful!',
      });

      // Get the user ID from the authentication result
      const userId = result.user.uid;

      // If the user ID is available, navigate to the home page after a brief delay
      if (userId) {
        setTimeout(() => {
          navigate("/");
        }, 1000)
      }

      // Add the user to the database
      await addUserToDb(userId)
    }).catch(e => {
      // Handle registration failure, display an error message for duplicate emails
      if (e.code === "auth/email-already-in-use") {
        messageApi.open({
          type: 'error',
          content: 'This email is already in use! Please try again',
        });
      }
      console.log(e.message)
    })
  }

  // Function to add user details to the database
  const addUserToDb = async () => {
    try {

      // Get user details from the form
      const { email, first_name, last_name, height, weight, phone } = form.getFieldsValue();

      // Create an object with user details for posting to the server
      const postObj = {
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'phone': phone,
        'is_admin': false,
        'height': height,
        'weight': weight
      }

       // Post user details to the server
      axiosServer.post('/users/add-user', postObj).then((data) => {
        //TODO: add user to redux
        debugger
      }).catch((error) => {
        console.log("Error!", error)
      });
    } catch (e) {
      console.log(e)
    }
  };

  // Function called when the registration form is submitted
  const onRegister = () => {
    registerWithMail();
  }

  // Register form JSX
  const RegisterForm = () => {
    const [goToLogin, setGoToLogin] = useState(false);
    return goToLogin ? (
      <Navigate to="/" replace={true} />
    ) : <Form
      className="login-form"
      name="control-hooks"
      validateTrigger="onSubmit"
      form={form}
      onFinish={onRegister}
    >

      {/* Form fields for user registration */}
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email!',
          },
        ]}
      >
        <Input placeholder="Email" autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input type="password" placeholder="Password" autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: 'Please input your first name!',
          },
        ]}
      >
        <Input placeholder="First Name" />
      </Form.Item>
      <Form.Item
        name="last_name"
        rules={[
          {
            required: true,
            message: 'Please input your last name!',
          },
        ]}
      >
        <Input placeholder="Last Name" />
      </Form.Item>
      <Form.Item
        name="height"
        rules={[
          {
            required: true,
            message: 'Please input your height!',
          },
        ]}
      >
        <Input placeholder="Height in cm" />
      </Form.Item>
      <Form.Item
        name="weight"
        rules={[
          {
            required: true,
            message: 'Please input your weight!',
          },
        ]}
      >
        <Input placeholder="Weight in KG" />
      </Form.Item>
      <Form.Item
        name="phone"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input placeholder="Phone" />
      </Form.Item>
      <Button className="login-button" htmlType="submit">
        Register
      </Button>
      <Button
        onClick={() => setGoToLogin(true)}
        className="login-button"
        icon={<AiOutlineArrowLeft size={20} style={{ marginRight: 10 }} />}
      >
        Go back to Log In
      </Button>
    </Form>
  }

  // Main component JSX
  return user ? <Navigate to="/dashboard" /> : <>
  {/* Display Ant Design message notifications */}
    {contextHolder}
    {/* Main login container */}
    <div className="login-container">
      <div className="login-card">
        {/* Logo component */}
        <Logo />
        {/* Render the registration form */}
        <RegisterForm />
      </div>
    </div>
  </>
}

export { Register }
