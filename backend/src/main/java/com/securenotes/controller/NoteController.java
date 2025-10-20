package com.securenotes.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    // A simple health check endpoint for now
    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> getStatus() {
        return ResponseEntity.ok(Collections.singletonMap("status", "Backend is running"));
    }
    
    // We will implement the following endpoints later:
    
    // @PostMapping
    // public ResponseEntity<?> createNote(@RequestBody String encryptedNote) {
    //     // Logic to save the note for the authenticated user
    //     return ResponseEntity.ok().build();
    // }

    // @GetMapping
    // public ResponseEntity<List<?>> getAllNotes() {
    //     // Logic to retrieve all notes for the authenticated user
    //     return ResponseEntity.ok(Collections.emptyList());
    // }
    
    // @DeleteMapping("/{noteId}")
    // public ResponseEntity<?> deleteNote(@PathVariable Long noteId) {
    //     // Logic to delete a note for the authenticated user
    //     return ResponseEntity.ok().build();
    // }
}
