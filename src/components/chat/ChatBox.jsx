import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContent } from '../../Context/AuthContext';
import { ChatContent } from '../../Context/ChatContext';
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import { Container, Typography, Box, IconButton, Paper, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import moment from 'moment';
import InputEmoji from 'react-input-emoji';

const ChatBox = () => {
    const { user } = useContext(AuthContent);
    const { currentChat, messages, isMessagesLoading, sendTextMessage } = useContext(ChatContent);
    const { recipientUser } = useFetchRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState('');
    const scroll = useRef();

    console.log('text', textMessage);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    if (!recipientUser) {
        return (
            <Typography>
                No conversation selected yet...
            </Typography>
        );
    }

    if (isMessagesLoading) {
        return (
            <Typography>
                Loading chat...
            </Typography>
        );
    }
    return (
        <Container style={{ height: 700, position: 'relative' }} >
            <Paper elevation={3} style={{ marginBottom: '10px', padding: '10px', textAlign: 'center' }}>
                <Typography variant="h6">{recipientUser?.name}</Typography>
            </Paper>
            <Box
                style={{
                    maxHeight: 600,
                    overflowY: 'auto',
                    padding: '10px',
                }}
                ref={scroll}
            >
                {messages &&
                    messages.map((message, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            {message?.senderId === user._id ? (
                                <Grid container justifyContent="flex-end">
                                    <Paper elevation={3} style={{ padding: '10px', backgroundColor: '#8eff8e' }}>
                                        <Typography variant="body1">{message.text}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {moment(message.createdAt).calendar()}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ) : (
                                <Grid container justifyContent="flex-start">
                                    <Paper elevation={3} style={{ padding: '10px', backgroundColor: '#b3e0ff' }}>
                                        <Typography variant="body1">{message.text}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {moment(message.createdAt).calendar()}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </div>
                    ))}
            </Box>
            <Box
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#fff',
                    borderTop: '1px solid #ccc',
                }}
            >
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                    cleanOnEnter
                    placeholder="Type a message"
                />
                <IconButton color="primary"
                    onClick={() => sendTextMessage(textMessage, user, currentChat._id, setTextMessage)}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Container>
    );
};

export default ChatBox;
