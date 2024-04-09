import React from "react";
import { Box } from "@mui/material";
import Header from "../Components/Drawer/Header";
import { Outlet } from "react-router-dom";

function Index() {
  return (
    <Box>
      <Header />
      <Box sx={{ position: "relative" }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Index;
