package br.com.saudeemacao.api.security;

import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.security.oauth2.CustomAuthenticationSuccessHandler;
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
                        // Endpoints públicos
                        .requestMatchers(HttpMethod.POST, "/api/auth/**", "/api/login", "/setup/admin").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/produtos/**").permitAll()
                        .requestMatchers("/ws-chat/**").permitAll()
                        .requestMatchers("/login/oauth2/**").permitAll()

                        // --- REGRAS DE ACESSO ATUALIZADAS ---
                        // Apenas ADMIN pode gerenciar alunos (GET, POST, PUT, DELETE, etc.)
                        .requestMatchers("/api/alunos/**").hasRole(EPerfil.ADMIN.name())

                        // Apenas ADMIN pode gerenciar professores (GET, POST, PUT, DELETE, etc.)
                        .requestMatchers("/api/professores/**").hasRole(EPerfil.ADMIN.name())

                        // Endpoints para o próprio usuário (autenticado)
                        .requestMatchers(HttpMethod.DELETE, "/api/usuario/me").authenticated()
                        .requestMatchers("/api/usuario/meu-perfil").authenticated()

                        // Regras existentes para produtos e reservas
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
                        .requestMatchers("/api/dashboard/**").hasRole(EPerfil.ADMIN.name())

                        // **** ALTERAÇÕES REVERTIDAS PARA A VERSÃO SEGURA ****
                        // As rotas de criação de usuário agora exigem o perfil ADMIN.
                        .requestMatchers(HttpMethod.POST, "/api/aluno").hasRole("ADMIN")      // <-- REVERTIDO
                        .requestMatchers(HttpMethod.POST, "/api/professor").hasRole("ADMIN")  // <-- REVERTIDO
                        .requestMatchers(HttpMethod.POST, "/api/admin").hasRole("ADMIN")      // <-- REVERTIDO

                        // Demais regras de acesso (leitura e atualização) continuam protegidas
                        .requestMatchers(HttpMethod.GET, "/api/aluno").hasAnyRole("ADMIN", "PROFESSOR")
                        .requestMatchers(HttpMethod.GET, "/api/professor").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/admin").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/aluno/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/professor/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/admin/**").hasRole("ADMIN")

                        // Qualquer outra requisição deve ser autenticada
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> {
                    oauth2.successHandler(customAuthenticationSuccessHandler());
                })
                .addFilterBefore(segurancaFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler() {
        return new CustomAuthenticationSuccessHandler();
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