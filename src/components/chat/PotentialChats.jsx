import React, { useContext } from 'react';
import { Box, Button } from "@mui/material";
import { ChatContent } from '../../Context/ChatContext';
import { AuthContent } from '../../Context/AuthContext';
import './PotentialChats.css';

const PotentialChats = () => {
    const { user } = useContext(AuthContent);
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContent);

    console.log("User", user);
    console.log("potentialChats", potentialChats);
    console.log("onlineUsers", onlineUsers);


    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 5 }}>
            {potentialChats &&
                potentialChats.map((u, index) => {
                    const checkOnlineUser = onlineUsers?.some((user) => user?._id === u?._id);
                    console.log('user online ?', checkOnlineUser);
                    return (
                        <Box sx={{ marginRight: 2 }} key={u._id}>
                            <Button
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: 1,
                                    border: "1px solid #ddd",
                                    justifyContent: "space-between",
                                    textTransform: "none",
                                    marginBottom: 1,
                                }}
                                onClick={() => createChat(user._id, u._id)}
                            >
                                <span fontSize="small">{u.name}</span>
                                <Box
                                    className={
                                        onlineUsers?.some((user) => user?.userId === u?._id) ?
                                            'user-online'
                                            : ''
                                    }
                                />
                            </Button>
                        </Box>
                    )
                })}
        </Box>
    );
};

export default PotentialChats;

