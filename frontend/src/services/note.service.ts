import axios from 'axios';
import AuthService from './auth.service'; 

const API_URL = '/api/notes/'; 

interface ApiNote {
  id: number;
  encryptedContent: string;
}

const getAuthHeader = () => {
    const user = AuthService.getCurrentUser();
    console.log("getAuthHeader: User from localStorage:", user); // LOG 1: Voir l'objet user complet
    if (user && user.token) {
        console.log("getAuthHeader: Token found:", user.token.substring(0, 10) + "..."); // LOG 2: Confirmer que le token est lu
        return { Authorization: 'Bearer ' + user.token } as Record<string, string>;
    }
    console.log("getAuthHeader: No user or token found!"); // LOG 3: Indique un problème
    return {};
};

const createNote = (encryptedContent: string) => {
    console.log("createNote: Sending request with headers:", getAuthHeader()); // LOG 4: Voir les headers avant l'envoi
    return axios.post(API_URL, { encryptedContent }, { headers: getAuthHeader() });
};

const getNotes = () => {
    console.log("getNotes: Sending request with headers:", getAuthHeader()); // LOG 5: Voir les headers avant l'envoi
    return axios.get<ApiNote[]>(API_URL, { headers: getAuthHeader() });
};

const deleteNote = (noteId: number) => {
    console.log(`deleteNote (${noteId}): Sending request with headers:`, getAuthHeader()); // LOG 6
    return axios.delete(API_URL + noteId, { headers: getAuthHeader() });
};

export default { createNote, getNotes, deleteNote };
