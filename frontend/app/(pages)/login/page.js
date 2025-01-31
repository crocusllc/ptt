"use client"

import Box from '@mui/material/Box';
import {FormControl, FormLabel, TextField, Typography} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import {useRef, useState} from "react";
import Link from "next/link";
import { redirect } from 'next/navigation'

export default function LoginPage() {

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('')

  const usernameInput = useRef(null);
  const passInput = useRef(null);

  const validateInputs = () => {
    // const email = document.getElementById('email');
    // const username = document.getElementById('username');
    // const password = document.getElementById('password');

    let isValid = true;

    // if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    //   setEmailError(true);
    //   setEmailErrorMessage('Please enter a valid email address.');
    //   isValid = false;
    // } else {
    //   setEmailError(false);
    //   setEmailErrorMessage('');
    // }

    if(passInput.current.value >= 4) {
      setUsernameError(true);
      setUsernameErrorMessage('Username Error, please check');
      isValid = false;
      console.log("regex error")
    } else {
      setUsernameError(false);
      setUsernameErrorMessage('')
    }

    if (passInput.current.value >= 4) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 4 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameError || passwordError) {
      return;
    }
    const response = await fetch('http://localhost:3030/login ', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "username": usernameInput.current.value,
        "password": passInput.current.value
      }),
    });

    if (response.ok) {
      const res = await response.json();
      const { token, username, role } = res;
      document.cookie = `authToken=${token}; path=/; Secure; SameSite=Strict`;
      document.cookie = `username=${username}; path=/; Secure; SameSite=Strict`;
      document.cookie = `userRole=${role}; path=/; Secure; SameSite=Strict`;
      redirect(`/`)
    } else {
      console.error('Login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: "center", justifyContent: "center"}}>
      <Card sx={{ maxWidth: 480, width: "80%" }}>
        <CardContent>
          <Typography gutterBottom component="h2" sx={{fontSize: "22px", marginBottom: "18px"}}>
            Log In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">User name</FormLabel>
              {/*<TextField*/}
              {/*  required*/}
              {/*  fullWidth*/}
              {/*  id="email"*/}
              {/*  placeholder="your@email.com"*/}
              {/*  name="email"*/}
              {/*  autoComplete="email"*/}
              {/*  variant="outlined"*/}
              {/*  error={emailError}*/}
              {/*  helperText={emailErrorMessage}*/}
              {/*  color={emailError ? 'error' : 'primary'}*/}
              {/*/>*/}
              <TextField
                required
                fullWidth
                id="username"
                placeholder=""
                name="username"
                autoComplete="username"
                variant="outlined"
                error={usernameError}
                helperText={usernameErrorMessage}
                color={usernameError ? 'error' : 'primary'}
                inputRef={usernameInput}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
                inputRef={passInput}
              />
            </FormControl>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <Link href="/forgot-password">Forgot password?</Link>
              <Button
                sx={{maxWidth: "200px"}}
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
              >
                Sign in
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

    </Box>

  );
}
