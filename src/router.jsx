import { Navigate, createBrowserRouter, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Index from "./Pages/Index";
import ChatProvider from "./Context/ChatProvider";
import Signup from "./Pages/Signup";

const routes = [
  {
    index: true,
    element: <Login />,
  },
  {
    path: "home",
    element: (
      <Privateroute>
        <ChatProvider>
          <Home />
        </ChatProvider>
      </Privateroute>
    ),
    children: [],
  },
  {
    path: "signup",
    element: <Signup />,
    children: [],
  },
];
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    children: routes,
    errorElement: <h1>Not found....</h1>,
  },
]);

function Privateroute({ children }) {
  const user = JSON.parse(localStorage.getItem("loggedInuser")) || false;
  if (!user) {
    return <Navigate to={"/"} />;
  }
  return children;
}
