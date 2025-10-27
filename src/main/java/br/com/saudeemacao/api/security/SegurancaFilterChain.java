package br.com.saudeemacao.api.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
@EnableMethodSecurity // Essencial para @PreAuthorize funcionar nos controllers
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
                        // =================================================================
                        // === 1. ROTAS PÚBLICAS (NÃO EXIGEM AUTENTICAÇÃO) ================
                        // =================================================================
                        .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/aluno").permitAll() // Cadastro de aluno é público
                        .requestMatchers(HttpMethod.GET, "/api/produtos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/treinos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/treinos/{id}").permitAll()

                        // =================================================================
                        // === 2. ROTAS DE ADMIN (EXIGEM PERFIL 'ADMIN') ===================
                        // =================================================================
                        .requestMatchers(HttpMethod.GET, "/api/aluno").hasRole("ADMIN") // <-- SUA SOLICITAÇÃO
                        .requestMatchers(HttpMethod.PUT, "/api/aluno/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/aluno/{id}").hasRole("ADMIN")
                        .requestMatchers("/api/professor/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/produtos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/produtos/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/produtos/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reservas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reservas/stats").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/reservas/{id}/aprovar").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/reservas/{id}/rejeitar").hasRole("ADMIN")
                        .requestMatchers("/api/dashboard/**").hasRole("ADMIN")

                        // =================================================================
                        // === 3. ROTAS DE PROFESSOR OU ADMIN ==============================
                        // =================================================================
                        .requestMatchers(HttpMethod.POST, "/api/treinos").hasAnyRole("PROFESSOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/treinos/{id}").hasAnyRole("PROFESSOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/treinos/{id}").hasAnyRole("PROFESSOR", "ADMIN")

                        // =================================================================
                        // === 4. ROTAS DE ALUNO (EXIGEM PERFIL 'ALUNO') ====================
                        // =================================================================
                        .requestMatchers(HttpMethod.POST, "/api/reservas").hasRole("ALUNO")
                        .requestMatchers(HttpMethod.GET, "/api/minhas").hasRole("ALUNO")
                        .requestMatchers(HttpMethod.POST, "/api/treinos/{id}/realizar").hasRole("ALUNO")
                        .requestMatchers(HttpMethod.GET, "/api/treinos/desempenho-semanal").hasRole("ALUNO")

                        // =================================================================
                        // === 5. QUALQUER OUTRA ROTA EXIGE AUTENTICAÇÃO ===================
                        // =================================================================
                        .anyRequest().authenticated()
                )
                .addFilterBefore(segurancaFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:4200",
                "http://localhost:5173",
                "http://localhost:8080",
                "http://127.0.0.1:5500",
                "https://saude-em-acao-react.vercel.br"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}