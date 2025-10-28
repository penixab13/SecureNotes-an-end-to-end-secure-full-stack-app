package com.securenotes.controller;

import com.securenotes.model.Note;
import com.securenotes.model.User;
import com.securenotes.repository.NoteRepository;
// import com.securenotes.repository.UserRepository; // Supprimé car non nécessaire ici
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // Réimporté
// import org.springframework.security.core.context.SecurityContextHolder; // Supprimé
// import org.springframework.security.core.userdetails.UserDetails; // Supprimé
import org.springframework.web.bind.annotation.*;

// import java.util.Collections; // Supprimé
import java.util.List;
import java.util.Map;
// import java.util.Optional; // Supprimé
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes") // Garder le chemin absolu
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;
    
    // Supprimé UserRepository car @AuthenticationPrincipal fournit l'objet User complet

    @PostMapping
    public ResponseEntity<?> createNote(@AuthenticationPrincipal User currentUser, @RequestBody Map<String, String> encryptedNotePayload) { // Restauré @AuthenticationPrincipal
        if (currentUser == null) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }
        
        Note note = new Note();
        note.setUser(currentUser); // Utiliser directement currentUser
        String content = encryptedNotePayload.get("encryptedContent");
        
        if (content == null) { return ResponseEntity.badRequest().body(Map.of("error", "Missing 'encryptedContent'")); }

        note.setEncryptedContent(content);
        noteRepository.save(note);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", note.getId(), "encryptedContent", note.getEncryptedContent()));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllNotes(@AuthenticationPrincipal User currentUser) { // Restauré @AuthenticationPrincipal
        if (currentUser == null) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }

        List<Note> notes = noteRepository.findByUser(currentUser); // Utiliser directement currentUser
        
        List<Map<String, Object>> result = notes.stream()
            .map(note -> Map.of("id", (Object)note.getId(), "encryptedContent", (Object)note.getEncryptedContent()))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(result);
    }
    
    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> deleteNote(@AuthenticationPrincipal User currentUser, @PathVariable Long noteId) { // Restauré @AuthenticationPrincipal
         if (currentUser == null) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }

        return noteRepository.findById(noteId)
            .map(note -> {
                // Vérifier l'appartenance avec l'ID de currentUser injecté
                if (!note.getUser().getId().equals(currentUser.getId())) { 
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Note does not belong to user"));
                }
                noteRepository.delete(note);
                return ResponseEntity.ok().body(Map.of("message", "Note deleted successfully"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
