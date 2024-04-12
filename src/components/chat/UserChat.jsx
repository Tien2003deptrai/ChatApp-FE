import React, { useContext } from "react";
import { Box, Typography, Avatar, Badge, Input } from "@mui/material";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { ChatContent } from "../../Context/ChatContext";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import './PotentialChats.css';

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers } = useContext(ChatContent);

    const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                gap: 3,
                className: "user-card",
            }}
        >
            <Box sx={{ display: "flex" }}>
                <Avatar sx={{ backgroundColor: "primary.light", width: 48, height: 48 }}>
                    {recipientUser?.name[0]}
                </Avatar>
                <Box sx={{ marginLeft: 2 }}>
                    <Typography variant="h6" className="name">
                        {recipientUser?.name}
                    </Typography>
                    <Input
                        disableUnderline
                        placeholder="Type your message"
                        className="text-input"
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <Typography variant="caption" color="textSecondary">
                    {new Date().toLocaleDateString()}
                </Typography>
                <Badge color="error">
                    <Box
                        className={
                            isOnline ? 'user-online' : ''
                        }
                    />
                    <Badge badgeContent={2} color="error">
                        <NotificationsNoneIcon sx={{ color: 'skyblue' }} />
                    </Badge>
                </Badge>

            </Box>
        </Box>
    );
};

export default UserChat;
