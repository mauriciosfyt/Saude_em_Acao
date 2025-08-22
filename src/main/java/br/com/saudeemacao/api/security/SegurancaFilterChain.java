package br.com.saudeemacao.api.security;

import br.com.saudeemacao.api.model.EPerfil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SegurancaFilterChain {

    @Autowired
    private SegurancaFilter segurancaFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/**", "/api/login", "/api/usuario", "/setup/admin").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/produtos/**").permitAll()
                        .requestMatchers("/ws-chat/**").permitAll()

                        // --- REGRAS OAuth2 para Google ---
                        .requestMatchers(HttpMethod.GET, "/login/oauth2/code/google").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/google").permitAll()

                        // --- REGRAS NOVAS PARA TREINOS ---
                        .requestMatchers(HttpMethod.POST, "/api/treino").hasAnyRole(EPerfil.ADMIN.name(), EPerfil.PROFESSOR.name())
                        .requestMatchers(HttpMethod.PUT, "/api/treino/**").hasAnyRole(EPerfil.ADMIN.name(), EPerfil.PROFESSOR.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/treino/**").hasRole(EPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/api/treino/meu-treino/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/treino/finalizar").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/treino/historico/**").authenticated()

                        // --- Outras regras existentes ---
                        .requestMatchers("/api/usuario/meu-perfil").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/produtos/**").hasRole(EPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/api/produtos/**").hasRole(EPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/produtos/**").hasRole(EPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.POST, "/api/reservas").hasAnyRole(EPerfil.ALUNO.name(), EPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/api/reservas/minhas").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/reservas/{id}/cancelar").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/reservas").hasRole(EPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/api/reservas/stats").hasRole(EPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.PATCH, "/api/reservas/{id}/aprovar").hasRole(EPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.PATCH, "/api/reservas/{id}/rejeitar").hasRole(EPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/api/usuario").hasRole(EPerfil.ADMIN.name())
                        .requestMatchers("/api/alunos/**").hasAnyRole(EPerfil.ADMIN.name(), EPerfil.PROFESSOR.name())
                        .requestMatchers("/api/professores/**").hasRole(EPerfil.ADMIN.name())

                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/login/sucesso", true)
                        .failureUrl("/login?error=oauth_failed")
                )
                .addFilterBefore(segurancaFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:4200",
                "http://localhost:8080",
                "http://127.0.0.1:5500",
                "https://dploy.netlify.app"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}