package br.com.saudeemacao.api;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@OpenAPIDefinition(
		info = @Info(title = "API Rest - Academia",
				version = "1.0",
				description = "API de estudos do Senai",
				contact = @Contact(
						name = "Arthur",
						email = "feliperottnerrodrigues@gmail.com",
						url = "https://Academia.com.br/api")))
public class SaudeEmAcaoApplication {
	public static void main(String[] args) {
		SpringApplication.run(SaudeEmAcaoApplication.class, args);
	}
}
