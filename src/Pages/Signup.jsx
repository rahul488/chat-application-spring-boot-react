import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { signUpSchema } from "../util/schema";
import { signupInitialvalue } from "../util/initialValues";
import AppInput from "../Form/Input";
import { Link } from "react-router-dom";
import { CREATE_USER } from "../util/helper";
import useFetch from "../hooks/useFetch";
import { toast } from 'react-toastify';

function Signup() {
  const formProps = useForm({
    mode: "all",
    resolver: signUpSchema,
    defaultValues: signupInitialvalue,
  });
  const fetchAndSubmitData = useFetch();

  async function onSubmit(values) {
    try {
      const res = await fetchAndSubmitData(CREATE_USER, {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      toast(data.message);
    } catch (e) {
      console.log("error", e);
    }
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
          <Box
            p={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              width: "400px",
              marginTop: "100px",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            }}
          >
            <Typography variant="h5">Create Account</Typography>
            <AppInput name="name" label="Name" type="text" />
            <AppInput name="email" label="Email" type="email" />
            <AppInput name="password" label="Password" type="password" />
            <AppInput
              name="confirmPassword"
              label="Confirm password"
              type="password"
            />
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
                Signup
              </Button>
              <Link
                to="/"
                style={{ textDecoration: "none", color: "ThreeDDarkShadow" }}
              >
                Already have account
              </Link>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}

export default Signup;
