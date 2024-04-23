import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import {
  Badge,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import { useDrwaerContext } from '../../Context/DrawerProvider';

export default function Header() {
  const router = useNavigate();
  const user = JSON.parse(localStorage.getItem('loggedInuser'));
  const { handleFriendDispaly, notificationCount } = useDrwaerContext();
  function handleLogout() {
    localStorage.clear();
    router('/');
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={4}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FriendZone
          </Typography>

          {!user ? (
            <>
              <Button color="inherit" onClick={() => router('/')}>
                Login
              </Button>
            </>
          ) : (
            <>
              <Tooltip title="People">
                <Badge badgeContent={notificationCount} color="error">
                  <IconButton onClick={handleFriendDispaly}>
                    <PeopleIcon />
                  </IconButton>
                </Badge>
              </Tooltip>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
