import { sessionService } from 'redux-react-session';
import RevibeAPI from '../../api/revibe.js';

const revibe = new RevibeAPI()


export const login = (credentials, history) => {
    return async () => {
        var response = await revibe.login(credentials)
        console.log(response);
        sessionService.saveSession({ response })
        sessionService.saveUser(response.data.user)
        return (response.data.user);
    };
};

export const getProfile = () => 
{
    return async () => 
    {
        var response = await revibe.getProfile()
        sessionService.saveUser(response)
        return (response);
    };
};

export const editProfile = (data) => 
{
    return async () => 
    {
        var response = await revibe.editProfile(data)
        console.log(response);
        sessionService.saveUser(response)
        return (response);
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
    };
};

export const registerArtist = (credentials, history) => 
{
    return async () => 
    {
        credentials.platform = "Revibe"
        var response = await revibe.registerArtist(credentials)
        console.log(response);
        sessionService.saveSession({ response })
        sessionService.saveUser(response.user)
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

export const uploadSong = (data) => {
    return async () => {
        var response = await revibe.uploadSong(data)
        console.log(response);
        return response
        
    };
};