/** @format */

import {
  Alert,
  AlertTitle,
  Button,
  DialogContent,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
function extractEmailParts(email) {
  const atIndex = email.indexOf("@"); // Find the index of the @ symbol
  const username = email.substring(0, atIndex); // Extract the characters before the @ symbol
  const domain = email.substring(atIndex + 1); // Extract the characters after the @ symbol

  const modifiedUsername =
    username.slice(0, 2) + "*".repeat(username.length - 4) + username.slice(-2);
  const modifiedEmail = `${modifiedUsername}@${domain}`;

  return modifiedEmail;
}
export const Code = ({  email }) => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const ref = useRef();
  const [codeError, setCodeError] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    codeError && setCodeError(false);
    setLoading(true);
    let fd = new FormData();
    fd.append("code", ref.current.value);
    fd.append("codeEmail", email);
    await axios
      .post("login.php", fd)
      .then((result) => {
        if (result.data.res) {
          localStorage.setItem('admin_id', result.data.id);
          localStorage.setItem('admin_name', result.data.name);
          localStorage.setItem('authToken', result.data.token)
          navigate('/');
        } else {
          setCodeError(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setCodeError(true);
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <DialogContent className="box" dividers>
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Check your email {extractEmailParts(email)} for a verification code.
      </Alert>
      <form onSubmit={handleSubmit}>
        <TextField
          error={codeError && true}
          type="number"
          autoFocus
          inputRef={ref}
          margin="normal"
          fullWidth
          label="6 digit code"
          required
          helperText={codeError && "Invalid Verification Code"}
        />
        <Button
          disabled={isLoading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 2 }}
        >
          {!isLoading ? "Submit" : "Submitting..."}
        </Button>
      </form>
    </DialogContent>
  );
};
