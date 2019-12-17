import { sessionService } from 'redux-react-session';
import RevibeAPI from '../../api/revibe.js';

const revibe = new RevibeAPI()


export const login = (credentials, history) => {
    return async () => {
        var response = await revibe.login(credentials)
        console.log(response.headers);
        sessionService.saveSession({ response })
        sessionService.saveUser(response.user)
        await history.push('/dashboard');
    };
};

export const register = (credentials, history) => 
{
    return async () => 
    {
        var response = await revibe.register(credentials)
        console.log(response.headers);
        sessionService.saveSession({ response })
        sessionService.saveUser(response.user)
        await history.push('/dashboard');
    };
};

export const registerArtist = (credentials, history) => 
{
    return async () => {
        var response = await revibe.registerArtist(credentials)
        console.log(response);
        sessionService.saveSession({ response })
        sessionService.saveUser(response.user)
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