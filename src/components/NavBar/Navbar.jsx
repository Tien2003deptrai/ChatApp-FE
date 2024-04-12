import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { AuthContent } from '../../Context/AuthContext';
import Notification from '../chat/Notification';

const NavBar = () => {
    const { user, logoutUser } = React.useContext(AuthContent);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                    {
                        user &&
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Login as {user?.name}
                        </Typography>
                    }
                    {user && (
                        <>
                            <Notification />
                            <Button onClick={() => logoutUser()} component={Link} to='/login' color="inherit">
                                Logout
                            </Button>
                        </>
                    )}
                    {!user && (
                        <>
                            <Button component={Link} to='/register' color="inherit">
                                Register
                            </Button>
                            <Button component={Link} to='/login' color="inherit">
                                Login
                            </Button>
                        </>
                    )}

                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavBar;
