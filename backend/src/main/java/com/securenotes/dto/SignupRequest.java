package com.securenotes.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public class SignupRequest {
    @NotBlank @Size(min = 3, max = 50) private String username;
    @NotBlank @Size(min = 8, max = 255) private String password;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
