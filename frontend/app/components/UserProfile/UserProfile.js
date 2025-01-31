import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import {Divider, ListItemIcon, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {redirect} from "next/navigation";
export default function UserProfile() {

  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUserName] = useState();
  const [userRole, setUserRole] = useState();

  useEffect(() => {
    const getCookies =  document.cookie.split('; ').reduce((cookies, cookie) => {
      const [key, value] = cookie.split('=');
      cookies[key] = decodeURIComponent(value); // Decode in case values are encoded
      return cookies;
    }, {});

    setUserName(getCookies.username);
    setUserRole(getCookies.userRole)

  }, []);


  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    document.cookie.split("; ").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });
    redirect(`/login`)
  };

  return(
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <AccountCircleIcon fontSize="large"/>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{cursor: "initial"}}>
          {username}
        </MenuItem>
        <MenuItem sx={{cursor: "initial", fontSize: "12px"}}>
          {userRole}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}