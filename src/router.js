import React, { useContext } from 'react'
import { Routes, Route } from "react-router-dom";
import Container from '@mui/material/Container';
import NavBar from './components/NavBar/Navbar';
import { AuthContent } from './Context/AuthContext';
import { ChatContentProvider } from './Context/ChatContext';
const Chat = React.lazy(() => import('./pages/Chat'));
const Register = React.lazy(() => import('./pages/Register'));
const Login = React.lazy(() => import('./pages/Login'));

const ProjectRoutes = () => {

    const { user } = useContext(AuthContent);

    return (
        <React.Suspense fallback={<>Loading...</>}>
            <ChatContentProvider user={user}>
                <NavBar />
                <Container className='text-secondary'>
                    <Routes>
                        <Route path='/' element={user ? <Chat /> : <Login />} />
                        <Route path='/register' element={user ? <Chat /> : <Register />} />
                        <Route path='/login' element={user ? <Chat /> : <Login />} />
                    </Routes>
                </Container>
            </ChatContentProvider>
        </React.Suspense>
    )
}

export default ProjectRoutes
