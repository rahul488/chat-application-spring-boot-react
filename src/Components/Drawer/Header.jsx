import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const router = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInuser"));

  function handleLogout() {
    localStorage.clear();
    router("/");
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={4}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FriendZone
          </Typography>
          {!user ? (
            <Button color="inherit" onClick={() => router("/")}>
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
