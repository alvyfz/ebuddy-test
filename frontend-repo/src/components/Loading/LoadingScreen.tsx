import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "background.paper",
      }}
    >
      <CircularProgress size={50} thickness={4} sx={{ mb: 2 }} />
      <Typography variant="h6" component="div" sx={{ mt: 2, color: "text.secondary" }}>
        Loading...
      </Typography>
    </Box>
  );
}
