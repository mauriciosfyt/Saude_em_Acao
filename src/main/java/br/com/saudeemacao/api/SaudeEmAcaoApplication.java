// src/main/java/br/com/saudeemacao/api/SaudeEmAcaoApplication.java
package br.com.saudeemacao.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // <-- IMPORTAR

@SpringBootApplication
@EnableScheduling // <-- ADICIONAR ESTA ANOTAÇÃO
public class SaudeEmAcaoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SaudeEmAcaoApplication.class, args);
	}

}