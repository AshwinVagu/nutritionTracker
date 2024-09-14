import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './config/firebaseConfig';
import { Login, Register, NotFound, Dashboard, Profile, Goals, BmiCalculator } from './components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axiosServer from "./services/api";
import { addUser, setCurrentRoute } from "./store";
import PrivateRoutes from "./utils/PrivateRoutes";
import './App.scss';


const App = () => {
  const dispatch = useDispatch();

  // Function to fetch user details from the database based on email
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

  // Effect to listen for changes in user authentication state
  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // This is an interceptor which makes sure that all requests from this application have the firestore authorization token in their request headers.
        // This token will be available only upon successful user authentication.
        axiosServer.interceptors.request.use(
          config => {
            config.headers['Authorization'] = currentUser.accessToken;
            return config;
          },
          error => {
            return Promise.reject(error);
          }
        );

        // Fetch user details from the database
        getUserFromDb(currentUser.email)

      }
    })
  }, []);

  // Application component structure using React Router
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Dashboard />} path="/dashboard" exact />
          <Route element={<Goals />} path="/goals" exact />
          <Route element={<Profile />} path="/profile" exact />
          <Route element={<BmiCalculator />} path="/bmi" exact />
        </Route>
        <Route element={<Login />} path="/" />
        <Route element={<Register />} path="/register" />

        {/* Not Found route for all other paths */}
        <Route element={<NotFound />} path="*" />
      </Routes>
    </Router>
  );
}

// Export the App component as the default export
export default App;
