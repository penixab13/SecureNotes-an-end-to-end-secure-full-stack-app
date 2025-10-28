package com.securenotes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan; // Import @EntityScan
import org.springframework.data.jpa.repository.config.EnableJpaRepositories; // Import @EnableJpaRepositories

@SpringBootApplication
@EntityScan("com.securenotes.model") // Tell Spring where to find @Entity classes
@EnableJpaRepositories("com.securenotes.repository") // Tell Spring where to find JpaRepository interfaces
public class SecureNotesBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecureNotesBackendApplication.class, args);
    }

}
