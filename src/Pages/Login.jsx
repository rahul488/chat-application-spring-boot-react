import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { loginSchema } from "../util/schema";
import { loginInitialValue } from "../util/initialValues";
import AppInput from "../Form/Input";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { LOGIN_USER } from "../util/helper";
import { toast } from "react-toastify";
import useLocalStorage from "../hooks/useLocalStorage";
import { StyledBox } from "../Components/Style/LoginBox";


function Login() {
  const fetchAndSubmitData = useFetch();
  const navigate = useNavigate();
  const { setDataInLocalStorage, getDataFromLocalStorage } = useLocalStorage();

  const user = getDataFromLocalStorage("loggedInuser");

  const formProps = useForm({
    mode: "all",
    resolver: loginSchema,
    defaultValues: loginInitialValue,
  });

  async function onSubmit(values) {
    try {
      const res = await fetchAndSubmitData(LOGIN_USER, {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      const { accessToken, id } = data.data;
      setDataInLocalStorage("loggedInuser", {
        accessToken,
        id,
      });
      toast(data.message);
      navigate("/home");
    } catch (e) {
      toast("Invalid U/P");
      console.log("error", e);
    }
  }
  if (user) {
    return <Navigate to="/home" />;
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "500px",
      }}
    >
      <FormProvider {...formProps}>
        <form onSubmit={formProps.handleSubmit(onSubmit)}>
          <StyledBox>
            <Typography variant="h5">Login</Typography>
            <AppInput name="email" label="Email" type="email" />
            <AppInput name="password" label="Password" type="password" />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Button type="submit" color="success" variant="contained">
                Login
              </Button>
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "black" }}
              >
                Create Account
              </Link>
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "black" }}
              >
                Forgot Passsword
              </Link>
            </Box>
          </StyledBox>
        </form>
      </FormProvider>
    </Box>
  );
}

export default Login;
