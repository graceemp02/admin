/** @format */

import { Dialog, DialogTitle, createTheme, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Code } from "./Code";


let theme = createTheme({
  typography: { button: { textTransform: "none" } },
});
export default function MyDialog({email}) {
  return (
    <ThemeProvider theme={theme}>
      <Dialog open={true}>
        <DialogTitle>Verification Code</DialogTitle>
          <Code email={email} />
      </Dialog>
    </ThemeProvider>
  );
}
