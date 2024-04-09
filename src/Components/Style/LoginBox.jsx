import { styled } from "@mui/material/styles";
import { Box } from  "@mui/material";

export const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  width: "400px",
  padding: "0.5rem 1rem",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  [theme.breakpoints.down("sm")]: {
    width: "300px",
  },
}));
