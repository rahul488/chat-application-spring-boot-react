import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { signUpSchema } from '../util/schema';
import { signupInitialvalue } from '../util/initialValues';
import AppInput from '../Form/Input';
import { Link, Navigate } from 'react-router-dom';
import { CREATE_USER } from '../util/helper';
import useFetch from '../hooks/useFetch';
import { toast } from 'react-toastify';
import useLocalStorage from '../hooks/useLocalStorage';
import { StyledBox } from '../Components/Style/LoginBox';

function Signup() {
  const formProps = useForm({
    mode: 'all',
    resolver: signUpSchema,
    defaultValues: signupInitialvalue,
  });
  const fetchAndSubmitData = useFetch();
  const { getDataFromLocalStorage } = useLocalStorage();
  const user = getDataFromLocalStorage('loggedInuser');

  async function onSubmit(values) {
    try {
      const res = await fetchAndSubmitData(CREATE_USER, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      const data = await res.json();
      toast(data.message);
    } catch (e) {
      console.log('error', e);
    }
  }

  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '500px',
      }}
    >
      <FormProvider {...formProps}>
        <form onSubmit={formProps.handleSubmit(onSubmit)}>
          <StyledBox>
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
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Button type="submit" color="success" variant="contained">
                Signup
              </Button>
              <Link
                to="/"
                style={{ textDecoration: 'none', color: 'ThreeDDarkShadow' }}
              >
                Already have account
              </Link>
            </Box>
          </StyledBox>
        </form>
      </FormProvider>
    </Box>
  );
}

export default Signup;
