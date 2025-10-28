package com.securenotes.config;

import com.securenotes.security.jwt.AuthEntryPointJwt;
import com.securenotes.security.jwt.AuthTokenFilter;
import com.securenotes.security.jwt.JwtUtils;
import com.securenotes.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    
    @Autowired UserDetailsServiceImpl userDetailsService;
    @Autowired private AuthEntryPointJwt unauthorizedHandler;
    @Autowired private JwtUtils jwtUtils; 

    // Instanciation manuelle du filtre pour éviter les références circulaires
    private AuthTokenFilter createAuthTokenFilter() {
        AuthTokenFilter filter = new AuthTokenFilter();
        // Injection manuelle des dépendances
        filter.jwtUtils = this.jwtUtils; 
        filter.userDetailsService = this.userDetailsService;
        return filter;
    }

    // Bean PasswordEncoder (BCrypt est le standard)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    // Bean DaoAuthenticationProvider (CRUCIAL)
    // S'assure que le bon UserDetailsService ET le bon PasswordEncoder sont utilisés
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // Service pour trouver l'utilisateur
        authProvider.setPasswordEncoder(passwordEncoder()); // Encodeur pour comparer les mots de passe
        return authProvider;
    }

    // Bean AuthenticationManager (nécessaire pour AuthController)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Bean SecurityFilterChain (configuration principale)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(new AntPathRequestMatcher("/api/auth/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/notes/**")).authenticated()
                .anyRequest().authenticated() // Rendre plus strict : tout le reste nécessite une authentification
            );
            
        // S'assurer que notre fournisseur d'authentification personnalisé est utilisé
        http.authenticationProvider(authenticationProvider()); 
        // Ajouter notre filtre JWT
        http.addFilterBefore(createAuthTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
