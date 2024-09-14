import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, message } from "antd";
import { auth } from "../config/firebaseConfig";
import { Navigate, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Logo } from '../components';
import '../styles/Login.scss';
import axiosServer from '../services/api';
import { addUser, addToken, setCurrentRoute } from "../store";


// React functional component for user login
const Login = () => {
  const dispatch = useDispatch();

  // React Router hook for navigation
  const navigate = useNavigate();

  // Ant Design message hook for displaying notifications
  const [messageApi, contextHolder] = message.useMessage();

  // Ant Design form hook for managing form state
  const [form] = Form.useForm();
  const user = useSelector(state => state.user)

  // useEffect to reset form fields when the component mounts
  useEffect(() => {
    form.setFieldsValue({
      email: "",
      password: ""
    })
  }, []);

  // Function to fetch user data from the database based on email
  const getUserFromDb = async (email) => {
    try {
      axiosServer.get(`/users/get-user-from-email/${email}`).then((res) => {
        if (res) {
          const { data } = res;
          const user = data[0]
          dispatch(addUser(user));
        }
      }).catch((error) => {
        console.log("Error!", error)
      });
    } catch (e) {
      console.log(e)
    }
  };


  // Function to handle user login with email and password
  const login = async () => {
    const { email, password } = form.getFieldsValue();
    try {
      signInWithEmailAndPassword(auth, email, password).then(async result => {
        if (result) {
          // This is an interceptor which makes sure that all requests from this application have the firestore authorization token in their request headers.
          // This token will be available only upon successful user authentication.
          axiosServer.interceptors.request.use(
            config => {
              config.headers['Authorization'] = result.user.accessToken;
              return config;
            },
            error => {
              return Promise.reject(error);
            }
          );
          await getUserFromDb(email)
          // Display success message on successful login
          messageApi.open({
            type: 'success',
            content: 'Login successful!',
          });

          // Navigate to the dashboard after a brief delay
          setTimeout(() => {
            navigate("/dashboard");
            dispatch(setCurrentRoute("/dashboard"))
          }, 1000)
        }
      }).catch(e => {
        // Handle login failure
        messageApi.open({
          type: 'error',
          content: 'Login failed! Please try again.',
        });
      })
    } catch (error) {
      // Log and re-throw errors
      console.error(error);
      throw error;
    }
  }

  // Function called when the login form is submitted
  const handleLogin = () => {
    login();
    // Reset form fields after submission
    form.resetFields();
  }

  // Login form JSX
  const LoginForm = () => {
    const [goToRegister, setGotToRegister] = useState(false);
    return goToRegister ? (
      // Navigate to the registration page if goToRegister is true
      <Navigate to="/register" replace={true} />
    ) :
      <Form
        className="login-form"
        name="control-hooks"
        validateTrigger="onSubmit"
        form={form}
        onFinish={handleLogin}
      >
        {/* Form fields for user login */}
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
        <Button className="login-button" htmlType="submit">Log In</Button>
        {/* Link to navigate to the registration page */}
        <div className="registerHere">Don't have an account? <a onClick={() => setGotToRegister(true)}>Create here</a></div>
      </Form>
  }

  // Main component JSX
  return (user ? <Navigate to="/dashboard" /> :
    <>
      {/* Display Ant Design message notifications */}
      {contextHolder}
      {/* Main login container */}
      <div className="login-container">
        <div className="login-card">
          {/* Logo component */}
          <Logo />
          {/* Render the login form */}
          <LoginForm />
        </div>
      </div>
    </>
  );
};

// Export the Login component
export { Login };
