import React, { useContext, useState } from "react";
import {
    Button,
    Menu,
    MenuItem,
    Typography,
    Badge
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ChatContent } from "../../Context/ChatContext";
import { AuthContent } from "../../Context/AuthContext";
import { unreadNotificationsFunc } from './../../utils/unreadNotifications';
import moment from "moment";

const Notification = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { user } = useContext(AuthContent);
    const { notifications, userChats, allUsers } = useContext(ChatContent);

    const unreadNotifications = unreadNotificationsFunc(notifications);
    const modifiedNotifications = notifications.map((n) => {
        const sender = allUsers.find((user => user._id === n.senderId));

        return {
            ...n,
            senderName: sender?.name
        };
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleClick} color="inherit" style={{ marginRight: '200px' }}>
                <Badge badgeContent={unreadNotifications?.length} color="error">
                    <NotificationsIcon sx={{ color: 'skyblue' }} />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}

            >
                <MenuItem>
                    <Typography variant="body1" style={{ float: "left", marginRight: '15px' }}>
                        Notifications
                    </Typography>
                    <Typography variant="body1">
                        Mark all as read
                    </Typography>
                </MenuItem>

                {modifiedNotifications?.length === 0 ? (
                    <MenuItem>
                        <Typography variant="body1" color="error">
                            No Notifications yet...
                        </Typography>
                    </MenuItem>
                ) : null}
                {modifiedNotifications && modifiedNotifications.map((n, index) => (
                    <MenuItem key={index} className={n.isRead ? 'notifications' : 'notifications not-read'}>
                        <Typography variant="body1">{`${n.senderName} sent you a new message`}</Typography>
                        <Typography variant="body2">{moment(n.date).calendar()}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </div >
    );
};

export default Notification;
