import { sessionService } from 'redux-react-session';
import RevibeAPI from '../../api/revibe.js';

const revibe = new RevibeAPI()


export const login = (credentials, history) => {
    return async () => {
        var auth = await revibe.login(credentials)
        const response = await auth.json()
        console.log(response);
        await sessionService.saveSession({ response })
        await sessionService.saveUser(response.user)
        await history.push('/dashboard');
    };
};

export const register = (credentials, history) => 
{
    return async () => {
        var auth = await revibe.register(credentials)
        const response = await auth.json()
        console.log(response);
        await sessionService.saveSession({ response })
        await sessionService.saveUser(response.user)
        await history.push('/dashboard');
    };
};

export const logout = (history) => {
    return async () => {
        // revibe.logout()
        sessionService.deleteSession();
        sessionService.deleteUser();
        history.push('account/login');
    };
};