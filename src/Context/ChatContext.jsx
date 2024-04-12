import { createContext, useCallback, useEffect, useState } from "react";
import { getRequest, baseURL, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContent = createContext();

export const ChatContentProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    console.log('notifications', notifications);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]);

    // add OnlineUsers getOnlineUsers
    useEffect(() => {
        if (socket === null) return;
        socket.emit('addNewUsers', user?._id);
        socket.on('getOnlineUsers', (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off('getOnlineUsers');
        };
    }, [socket]);

    // send message
    useEffect(() => {
        if (socket === null) return;

        const recipientId = currentChat?.members.find((id) => id !== user?._id);

        socket.emit('sendMessage', { ...newMessage, recipientId })
    }, [newMessage]);


    //receive message and notifications
    useEffect(() => {
        if (socket === null) return;

        socket.on('getMessage', (res) => {
            if (currentChat?._id !== res.chatId) return

            setMessages((prev) => [...prev, res]);
        })
        socket.on('getNotifications', (res) => {
            const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
            if (isChatOpen) {
                setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
            } else {
                setNotifications((prev) => [res, ...prev]);
            }
        });

        return () => {
            socket.off('getMessage');
            socket.off('getNotifications');
        };

    }, [socket, currentChat]);

    useEffect(() => {

        const getUser = async () => {
            const response = await getRequest(`${baseURL}/users`);

            if (response.error) {
                return console.log('Error fetching users: ' + response)
            }

            const pChats = response.filter((u) => {
                let isChatCreated = false;

                if (user?._id === u._id) return false;

                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    })
                }
                console.log('User:', u);
                console.log('Is Chat Created:', isChatCreated);
                return !isChatCreated;
            });

            setPotentialChats(pChats);
            setAllUsers(response);
        };
        getUser();
    }, [userChats])


    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseURL}/chats/${user?._id}`);

                setIsUserChatsLoading(false);

                if (response.error) {
                    return setUserChatsError(response);
                }

                setUserChats(response);

            }
        };
        getUserChats();

    }, [user]);

    useEffect(() => {
        const getMessages = async () => {

            setIsMessagesLoading(true);
            setMessagesError(null);

            const response = await getRequest(
                `${baseURL}/messages/${currentChat?._id}`
            );

            setIsMessagesLoading(false);

            if (response.error) {
                return setMessagesError(response);
            }

            setMessages(response);
        };
        getMessages();

    }, [currentChat]);

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log('You must provide a text message');

        const response = await postRequest(`${baseURL}/messages`, JSON.stringify(
            {
                chatId: currentChatId,
                senderId: sender._id,
                text: textMessage
            }
        ));

        if (response.error) {
            return setSendTextMessageError(response);
        }

        setNewMessage(response);
        setMessages((prev) => [...prev, response]);
        setTextMessage('');

    }, []);


    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    }, [])

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseURL}/chats`,
            JSON.stringify({
                firstId,
                secondId
            })
        );

        if (response.error) {
            return console.log('Error creating chat', response);
        }

        setUserChats((prev) => [...prev, response]);
    }, [])


    return <ChatContent.Provider
        value={
            {
                userChats,
                isUserChatsLoading,
                userChatsError,
                potentialChats,
                createChat,
                updateCurrentChat,
                isMessagesLoading,
                messagesError,
                currentChat,
                messages,
                sendTextMessage,
                onlineUsers,
                notifications,
                allUsers,
            }
        }>
        {children}
    </ChatContent.Provider>
}