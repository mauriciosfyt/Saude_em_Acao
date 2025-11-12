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

                        // REGRA 1: ROTAS PÚBLICAS (Nenhuma autenticação necessária)
                        .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/aluno").permitAll() // Permitir auto-cadastro de alunos
                        .requestMatchers(HttpMethod.GET, "/api/produtos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/treinos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/treinos/{id}").permitAll()

                        // REGRA 2: ROTAS DE ALUNO (Requerem perfil ALUNO)
                        .requestMatchers(HttpMethod.POST, "/api/reservas").hasRole("ALUNO")
                        .requestMatchers(HttpMethod.GET, "/api/reservas/minhas").hasRole("ALUNO")
                        .requestMatchers(HttpMethod.POST, "/api/treinos/{id}/realizar").hasRole("ALUNO")
                        .requestMatchers(HttpMethod.GET, "/api/treinos/desempenho-semanal").hasRole("ALUNO")
                        .requestMatchers(HttpMethod.GET, "/api/treinos/minhas-metricas").hasRole("ALUNO")

                        // REGRA 3: ROTAS DE PROFESSOR E ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/treinos").hasAnyRole("ADMIN", "PROFESSOR")
                        .requestMatchers(HttpMethod.PUT, "/api/treinos/{id}").hasAnyRole("ADMIN", "PROFESSOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/treinos/{id}").hasAnyRole("ADMIN", "PROFESSOR")
                        .requestMatchers(HttpMethod.GET, "/api/aluno").hasAnyRole("ADMIN", "PROFESSOR")
                        .requestMatchers(HttpMethod.GET, "/api/aluno/{id}").hasAnyRole("ADMIN", "PROFESSOR")

                        // REGRA 4: ROTAS EXCLUSIVAS DE ADMIN (Requerem perfil ADMIN)
                        .requestMatchers("/api/dashboard/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/produtos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/produtos/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/produtos/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reservas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reservas/stats").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/reservas/{id}/aprovar").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/reservas/{id}/rejeitar").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/reservas/{id}/concluir").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/aluno/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/professor").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/professor/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/professor/{id}").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/aluno/{id}/renovar-plano").hasRole("ADMIN")

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
                "https://saude-em-acao-react.vercel.app"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}