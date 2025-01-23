"use client"

import Box from '@mui/material/Box';
import {FormControl, FormLabel, TextField, Typography} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import {useState} from "react";

export default function ChangePass() {

  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const [confirmError, setConfirmError] = useState(false)
  const [confirmErrorMessage, setConfirmErrorMessage] = useState('')

  const validateInputs = () => {
    const password = document.getElementById('new_password');
    const confirmedPass = document.getElementById('confirm_password');

    let isValid = true;

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (password.value !== confirmedPass.value) {
      setConfirmError(true);
      setConfirmErrorMessage('The passwords do NOT match!')
      isValid = false;
    } else {
      setConfirmError(false);
      setConfirmErrorMessage('');
    }
    return isValid;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordError || confirmError) {
      return;
    }
    const data = new FormData(e.currentTarget);
    console.log(data);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: "center", justifyContent: "center"}}>
      <Card sx={{ maxWidth: 480, width: "80%" }}>
        <CardContent>
          <Typography gutterBottom component="h2" sx={{fontSize: "22px", marginBottom: "18px"}}>
            Change Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="new_password">New Password</FormLabel>
              <TextField
                required
                fullWidth
                name="new_password"
                placeholder="••••••"
                type="password"
                id="new_password"
                autoComplete="password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
              <TextField
                required
                fullWidth
                name="confirm password"
                placeholder="••••••"
                type="password"
                id="confirm_password"
                autoComplete="password"
                variant="outlined"
                error={confirmError}
                helperText={confirmErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <Box sx={{display: "flex", justifyContent: "flex-end"}}>
              <Button
                sx={{maxWidth: "200px"}}
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
              >
                Save Password
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

    </Box>

  );
}
