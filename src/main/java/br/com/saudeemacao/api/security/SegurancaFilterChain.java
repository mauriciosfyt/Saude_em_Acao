package br.com.saudeemacao.api.security;

import br.com.saudeemacao.api.model.EPerfil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfiguration;
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
                        // Permita requests OPTIONS para todas as rotas (pre-flight requests)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Endpoints públicos (não exigem autenticação)
                        .requestMatchers(HttpMethod.POST, "/api/auth/solicitar-token").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login-token").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuario").permitAll() // Cadastro de novo usuário
                        .requestMatchers(HttpMethod.POST, "/setup/admin").permitAll() // Endpoint para setup inicial

                        // Endpoints para redefinição de senha
                        .requestMatchers(HttpMethod.POST, "/api/auth/esqueci-senha/solicitar").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/esqueci-senha/confirmar").permitAll()

                        // Endpoints públicos para produtos (apenas leitura)
                        .requestMatchers(HttpMethod.GET, "/api/produtos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/produtos/semtamanho").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/produtos/comtamanho").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/produtos/{id}").permitAll()

                        // Acesso ao perfil do usuário logado (qualquer usuário autenticado)
                        .requestMatchers("/api/usuario/meu-perfil").authenticated()

                        // Endpoints de produtos que exigem autenticação e perfil ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/produtos/**").hasRole(EPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/api/produtos/**").hasRole(EPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/produtos/**").hasRole(EPerfil.ADMIN.name())

                        // Exemplo de rotas que exigem autenticação e/ou role específica
                        .requestMatchers(HttpMethod.GET, "/api/usuario").hasRole(EPerfil.ADMIN.name()) // Listar todos os usuários, apenas para ADMIN
                        .requestMatchers("/api/alunos/**").hasAnyRole(EPerfil.ADMIN.name(), EPerfil.PROFESSOR.name())
                        .requestMatchers("/api/professores/**").hasRole(EPerfil.ADMIN.name())

                        .anyRequest().authenticated() // Qualquer outra requisição DEVE ser autenticada
                )
                // Adiciona seu filtro JWT antes do filtro padrão de autenticação de usuário/senha
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
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}