package com.securenotes.dto;
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    public JwtResponse(String accessToken, Long id, String username) { this.token = accessToken; this.id = id; this.username = username; }
    public String getToken() { return token; }
    public String getUsername() { return username; }
    public Long getId() { return id; }
    public String getType() { return type; }
}
