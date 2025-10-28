import { useState, useEffect } from 'react';
import NoteService from '../services/note.service';
import AuthService from '../services/auth.service';
// import CryptoJS from 'crypto-js'; // Importation supprimée

interface NoteState {
    id: number;
    encryptedContent: string;
    decryptedContent: string;
}

const Notes = () => {
    const [notes, setNotes] = useState<NoteState[]>([]);
    const [newNoteContent, setNewNoteContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentUser = AuthService.getCurrentUser();
    const ENCRYPTION_KEY_SESSION = currentUser?.encryptionKey;
    console.log("Notes.tsx: Initial currentUser:", currentUser); // LOG A: Voir l'état initial
    console.log("Notes.tsx: Initial ENCRYPTION_KEY_SESSION:", ENCRYPTION_KEY_SESSION ? 'Exists' : 'MISSING'); // LOG B

    const fetchNotes = () => {
        console.log("Notes.tsx: fetchNotes called."); // LOG C
        if (!currentUser || !ENCRYPTION_KEY_SESSION) {
             console.error("Notes.tsx: Auth key missing in fetchNotes guard. Logging out."); // LOG D
             setError("Authentication key is missing. Please log in again.");
             setLoading(false);
             AuthService.logout();
             window.location.reload();
             return;
        }

        setLoading(true);
        setError(null);

        NoteService.getNotes().then( // L'appel utilise getAuthHeader() à l'intérieur
            (response) => {
                console.log("Notes.tsx: fetchNotes successful response:", response.data); // LOG E
                // ... (reste du code de déchiffrement) ...
                const decryptedNotes = response.data.map(note => {
                   try { /* ... déchiffrement ... */ 
                        const bytes = window.CryptoJS.AES.decrypt(note.encryptedContent, ENCRYPTION_KEY_SESSION);
                        const originalText = bytes.toString(window.CryptoJS.enc.Utf8);
                        if (!originalText && note.encryptedContent) { return { ...note, decryptedContent: '[Decryption Failed]' }; }
                        return { ...note, decryptedContent: originalText || '[Empty Note]' };
                   } catch (e) { return { ...note, decryptedContent: '[Decryption Failed]' }; }
                });
                setNotes(decryptedNotes);
                setLoading(false);
            },
            (error) => {
                console.error("Notes.tsx: Failed to fetch notes:", error); // LOG F: Voir l'erreur exacte
                 if (error.response && error.response.status === 401) {
                   setError("Session expired or unauthorized. Logging out...");
                   AuthService.logout();
                   window.location.reload();
                } else if (error.response) {
                    setError(`Error ${error.response.status}: Failed to load notes.`);
                } else {
                     setError("Network error or server unavailable.");
                }
                setLoading(false);
            }
        );
    };

    useEffect(() => {
        console.log("Notes.tsx: useEffect triggered."); // LOG G
        if (ENCRYPTION_KEY_SESSION) {
             fetchNotes();
        } else {
             console.log("Notes.tsx: useEffect found no key, logging out."); // LOG H
             AuthService.logout();
             window.location.reload();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Exécuter une seule fois au montage

    // ... (handleCreateNote, handleDeleteNote, JSX) ...
    const handleCreateNote = (e: React.FormEvent) => { /* ... */ };
    const handleDeleteNote = (noteId: number) => { /* ... */ };
    if (error) { /* ... */ }
    if (loading) { /* ... */ }
    return ( /* ... JSX ... */ );
};
export default Notes;
