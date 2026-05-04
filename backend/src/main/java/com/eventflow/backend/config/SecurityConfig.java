package com.eventflow.backend.config;

import com.eventflow.backend.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // Public
                        .requestMatchers("/api/auth/**").permitAll()

                        // Like endpoints — any logged-in user (must come BEFORE the broad event rules)
                        .requestMatchers(HttpMethod.GET,    "/api/events/liked").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET,    "/api/events/*/like").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST,   "/api/events/*/like").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/events/*/like").hasAnyRole("USER", "ADMIN")

                        // Event CRUD — public read, admin write
                        .requestMatchers(HttpMethod.GET,    "/api/events/**").permitAll()
                        .requestMatchers(HttpMethod.POST,   "/api/events/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/events/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasRole("ADMIN")

                        // Venues — admin only
                        .requestMatchers("/api/venues/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}