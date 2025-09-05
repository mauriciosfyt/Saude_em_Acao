// src/main/java/br.com.saudeemacao.api/security/SegurancaFilterChain.java

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
                        // ATUALIZAÇÃO: Removido "/api/usuario" desta linha para que não seja mais público.
                        .requestMatchers(HttpMethod.POST, "/api/auth/**", "/api/login", "/setup/admin").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/produtos/**").permitAll()
                        .requestMatchers("/ws-chat/**").permitAll()

                        // --- REGRAS OAuth2 para Google (ATUALIZADO) ---
                        .requestMatchers("/login/oauth2/**").permitAll() // Permite o fluxo de callback do Google

                        // --- ATUALIZAÇÃO: Nova regra de segurança para criação de usuários ---
                        // Apenas usuários com perfil ADMIN podem criar novos usuários (alunos, professores).
                        .requestMatchers(HttpMethod.POST, "/api/usuario").hasRole(EPerfil.ADMIN.name())

                        // --- Outras regras existentes e novas ---
                        .requestMatchers(HttpMethod.DELETE, "/api/usuario/me").authenticated()
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
                        .requestMatchers("/api/dashboard/**").hasRole(EPerfil.ADMIN.name())
                        .anyRequest().authenticated()
                )
                // --- Configuração do OAuth2 Login (ATUALIZADO) ---
                .oauth2Login(oauth2 -> {
                    // Define um handler customizado para ser executado após o sucesso da autenticação
                    oauth2.successHandler(customAuthenticationSuccessHandler());
                })
                .addFilterBefore(segurancaFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // --- NOVO BEAN: Fornece a instância do nosso handler customizado ---
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