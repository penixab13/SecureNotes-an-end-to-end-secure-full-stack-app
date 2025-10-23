import axios from 'axios';
import AuthService from './auth.service';

// Define structure for notes coming from API
interface ApiNote {
  id: number;
  encryptedContent: string;
}

const API_URL = '/api/notes/';

const getAuthHeader = () => {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
        // AxiosHeaders type might be needed depending on Axios version, but Record is usually fine
        return { Authorization: 'Bearer ' + user.token } as Record<string, string>;
    }
    return {};
};

const createNote = (encryptedContent: string) => {
    return axios.post(API_URL, { encryptedContent }, { headers: getAuthHeader() });
};

const getNotes = () => {
    // Specify that the response data should be an array of ApiNote objects
    return axios.get<ApiNote[]>(API_URL, { headers: getAuthHeader() });
};

const deleteNote = (noteId: number) => {
    return axios.delete(API_URL + noteId, { headers: getAuthHeader() });
};

export default { createNote, getNotes, deleteNote };
