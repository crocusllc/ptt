"use client"
import Box from '@mui/material/Box';
import {FormControl, FormLabel, IconButton, TextField, Typography} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import React, {useRef, useState} from "react";
import {useAuth} from "@/app/utils/contexts/AuthProvider";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Dialog from "@mui/material/Dialog";
import DialogActions from '@mui/material/DialogActions';
import {signIn} from "next-auth/react";

export default function ChangePassPage() {
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false);
  const [fetchResponse, setFetchResponse] = useState()

  const { userSession } = useAuth();

  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const [confirmError, setConfirmError] = useState(false)
  const [confirmErrorMessage, setConfirmErrorMessage] = useState('')

  const newPass = useRef(null);
  const confirmPass = useRef(null);


  const validateInputs = () => {
    const password = newPass.current.value;
    const confirmedPass = confirmPass.current.value;

    let isValid = true;

    if (!password || password.length < 4) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 4 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (password !== confirmedPass) {
      setConfirmError(true);
      setConfirmErrorMessage('The passwords do NOT match!')
      isValid = false;
    } else {
      setConfirmError(false);
      setConfirmErrorMessage('');
    }
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError || confirmError) {
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/change_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userSession.user.accessToken}`
      },
      body: JSON.stringify({password: newPass.current.value})
    });

    const response = await res.json();

    setFetchResponse(response);
    setOpen(true);
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
                inputRef={newPass}
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
                inputRef={confirmPass}
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
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "460px",
              minHeight: "200px"
            },
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Upload response:
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            {
              fetchResponse?.message
            }
          </DialogContentText>
        </DialogContent>
        {
          !error && (
            <DialogActions sx={{justifyContent: "center"}}>
              <Button onClick={async () =>{
                const response = await signIn("credentials", {
                  redirect: false,
                  username: userSession.user.username,
                  password: newPass.current.value,
                });

                if(response?.error) {
                  setFetchResponse('Error refreshing session')
                } else  {
                  // redirect and router.push do not work in prod mode.
                  window.location.href = "/";
                }
              } }> Restart session </Button>
            </DialogActions>
          )
        }
      </Dialog>
    </Box>

  );
}
