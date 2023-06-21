/** @format */

import { Dialog, DialogTitle, createTheme, ThemeProvider } from '@mui/material';
import Email from './Email';
import { useState } from 'react';
import { Code } from './Code';
import NewPass from './NewPass';

let theme = createTheme({
  typography: { button: { textTransform: 'none' } },
});
export default function MyDialog() {
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState();

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={true}>
        <DialogTitle>Reset Password</DialogTitle>
        {page === 1 ? (
          <Email next={setPage} email={setEmail} />
        ) : page === 2 ? (
          <Code email={email} next={setPage} />
        ) : (
          <NewPass email={email} next={setPage} />
        )}
      </Dialog>
    </ThemeProvider>
  );
}
