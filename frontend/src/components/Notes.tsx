import { useState, useEffect } from 'react'; // React import removed
import NoteService from '../services/note.service';
import AuthService from '../services/auth.service'; // Added missing import
import CryptoJS from 'crypto-js';

// Define the structure of a note within the component's state
interface NoteState {
    id: number;
    encryptedContent: string;
    decryptedContent: string; // Add decrypted content field
}

const ENCRYPTION_KEY = 'my-super-secret-key-12345';

const Notes = () => {
    // Provide the type for the notes state array
    const [notes, setNotes] = useState<NoteState[]>([]);
    const [newNoteContent, setNewNoteContent] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchNotes = () => {
        setLoading(true); // Ensure loading is true at the start
        NoteService.getNotes().then(
            (response) => {
                const decryptedNotes = response.data.map(note => {
                    try {
                        const bytes = CryptoJS.AES.decrypt(note.encryptedContent, ENCRYPTION_KEY);
                        const originalText = bytes.toString(CryptoJS.enc.Utf8);
                        // Make sure decryption actually produced text
                        if (!originalText && note.encryptedContent) {
                             console.warn("Decryption resulted in empty string for note:", note.id);
                             return { ...note, decryptedContent: '[Decryption Failed - Check Key/Data]' };
                        }
                        return { ...note, decryptedContent: originalText || '[Empty Note]' };
                    } catch (e) {
                        console.error("Decryption failed for note:", note.id, e);
                        return { ...note, decryptedContent: '[Decryption Failed]' };
                    }
                });
                setNotes(decryptedNotes);
                setLoading(false);
            },
            (error) => {
                console.error("Failed to fetch notes", error);
                 if (error.response && error.response.status === 401) {
                   console.log("Unauthorized, logging out.");
                   AuthService.logout(); // Use imported AuthService
                   window.location.reload(); // Force reload to redirect to login
                }
                setLoading(false);
            }
        );
    };

    useEffect(() => {
        fetchNotes();
    }, []); // Empty dependency array means this runs once on mount

    // Added type React.FormEvent
    const handleCreateNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNoteContent.trim()) return;
        const encryptedContent = CryptoJS.AES.encrypt(newNoteContent, ENCRYPTION_KEY).toString();
        NoteService.createNote(encryptedContent).then(() => {
            setNewNoteContent('');
            fetchNotes();
        }).catch(err => console.error("Failed to create note:", err));
    };

    // Added type number
    const handleDeleteNote = (noteId: number) => {
        NoteService.deleteNote(noteId).then(() => {
            fetchNotes();
        }).catch(err => console.error("Failed to delete note:", err));
    };

    if (loading) return <div className="text-center text-gray-600">Loading notes...</div>;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Create a New Note</h2>
                <form onSubmit={handleCreateNote}>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Your secret note..."
                        required
                    />
                    <button type="submit" className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                        Save Encrypted Note
                    </button>
                </form>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">My Secure Notes</h2>
                {notes.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {/* Explicitly type note here for clarity */}
                        {notes.map((note: NoteState) => (
                            <li key={note.id} className="py-4 flex justify-between items-center space-x-4">
                                <p className="text-gray-700 flex-grow break-words">{note.decryptedContent}</p>
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 italic">You have no notes yet.</p>
                )}
            </div>
        </div>
    );
};
export default Notes;
