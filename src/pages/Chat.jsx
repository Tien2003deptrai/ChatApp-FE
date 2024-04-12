import React, { useContext } from 'react';
import { ChatContent } from '../Context/ChatContext';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import UserChat from '../components/chat/UserChat';
import { AuthContent } from '../Context/AuthContext';
import Stack from '@mui/material/Stack';
import PotentialChats from '../components/chat/PotentialChats';
import ChatBox from '../components/chat/ChatBox';

const Chat = () => {
    const { user } = useContext(AuthContent);

    const {
        userChats,
        isUserChatsLoading,
        userChatsError,
        updateCurrentChat
    } = useContext(ChatContent);

    // console.log('UserChat', userChats);

    return (
        <Container >
            <PotentialChats />
            {userChats && userChats.length > 0 ? (
                <Stack direction="row" spacing={4} alignItems="start">
                    <Stack className="flex-grow-0" spacing={3} style={{ marginTop: '20px' }}>
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div key={index} onClick={() => updateCurrentChat(chat)}>
                                    <UserChat chat={chat} user={user} />
                                </div>
                            )
                        })}
                    </Stack>

                    <Paper elevation={3} style={{ padding: '20px', flexGrow: 1, marginTop: '20px', marginBottom: '20px' }}>
                        <ChatBox />
                    </Paper>

                </Stack>
            ) : (
                userChatsError
            )}
        </Container>
    );
};

export default Chat;
