package com.securenotes.model;
import jakarta.persistence.*;
@Entity
@Table(name = "notes")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Lob @Column(nullable = false, columnDefinition = "TEXT")
    private String encryptedContent;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEncryptedContent() { return encryptedContent; }
    public void setEncryptedContent(String encryptedContent) { this.encryptedContent = encryptedContent; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
