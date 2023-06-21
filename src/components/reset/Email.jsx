/** @format */

import { Button, DialogContent, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';

const Email = ({ next, email }) => {
  const [isLoading, setLoading] = useState(false);
  const emailRef = useRef();
  const [emailError, setEmailError] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    emailError && setEmailError(false);
    let fd = new FormData();
    fd.append('email', emailRef.current.value);
    await axios
      .post('reset.php', fd)
      .then(res => {
        // console.log(res.data);
        if (res.data.res === 'true') {
          email(emailRef.current.value);
          next(pre => pre + 1);
        } else {
          setEmailError(true);
          setLoading(false);
        }
      })
      .catch(err => {
        setEmailError(true);
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <DialogContent dividers>
      <Typography sx={{ mb: 2 }}>Please enter your registered email address</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          error={emailError && true}
          type='email'
          inputRef={emailRef}
          required
          fullWidth
          label='Email'
          autoComplete='email'
          autoFocus
          helperText={emailError && 'Email Does not Exist'}
        />
        <Button
          disabled={isLoading}
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 3, mb: 2 }}>
          {!isLoading ? 'Reset Password' : 'Submitting...'}
        </Button>
      </form>
    </DialogContent>
  );
};

export default Email;
