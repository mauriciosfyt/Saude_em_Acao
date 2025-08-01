package br.com.saudeemacao.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public void enviarToken(String email, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(from);
            helper.setTo(email);
            helper.setSubject("Seu Código de Acesso - Saúde em Ação");

            String corpoHtml = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <title>Código de Acesso - Saúde em Ação</title>
                  <style>
                    body {
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      background-color: #0a0a0a;
                      color: #f0f0f0;
                      margin: 0;
                      padding: 20px;
                    }

                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                      background: linear-gradient(135deg, #0d1b2a, #1b263b);
                      border-radius: 12px;
                      padding: 40px;
                      box-shadow: 0 0 20px rgba(0, 123, 255, 0.25);
                    }

                    .logo {
                      text-align: center;
                      margin-bottom: 20px;
                    }

                    .logo img {
                      max-width: 100px;
                      height: auto;
                    }

                    .welcome {
                      text-align: center;
                      margin-bottom: 40px;
                    }

                    .welcome-title {
                      font-size: 18px;
                      color: #e5e7eb;
                      font-weight: 500;
                      margin-bottom: 8px;
                    }

                    .welcome-title strong {
                      color: #3b82f6;
                    }

                    .welcome-subtitle {
                      font-size: 16px;
                      color: #e5e7eb;
                      margin-bottom: 5px;
                    }

                    .welcome-phrase {
                      font-size: 15px;
                      color: #9ca3af;
                      font-style: italic;
                    }

                    h1 {
                      text-align: center;
                      font-size: 30px;
                      color: #3b82f6;
                      margin-bottom: 30px;
                      letter-spacing: 1px;
                      text-transform: uppercase;
                    }

                    .code-container {
                      display: flex;
                      justify-content: center;
                      gap: 20px;
                      margin: 30px 0;
                    }

                    .digit-box {
                      background-color: #5a5a6d;
                      color: #ffffff;
                      font-size: 28px;
                      font-weight: bold;
                      width: 60px;
                      height: 60px;
                      border-radius: 10px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      box-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
                    }

                    .button {
                      display: block;
                      width: 240px;
                      margin: 0 auto;
                      background-color: #3b82f6;
                      color: #fff;
                      text-align: center;
                      padding: 16px;
                      border-radius: 10px;
                      text-decoration: none;
                      font-weight: bold;
                      font-size: 16px;
                      transition: all 0.3s;
                      box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
                    }

                    .button:hover {
                      background-color: #2563eb;
                      box-shadow: 0 0 18px rgba(59, 130, 246, 0.7);
                    }

                    .footer {
                      text-align: center;
                      margin-top: 40px;
                      font-size: 13px;
                      color: #7a7a7a;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="logo">
                      <img src="src/main/resources/img/logo.png" alt="Logo Saúde em Ação" />
                    </div>

                    <div class="welcome">
                      <p class="welcome-title">Seja muito bem-vindo(a) à <strong>Saúde em Ação</strong>, o lugar onde sua transformação começa</p>
                      <p class="welcome-phrase">Prepare-se para viver sua melhor versão.</p>
                    </div>

                    <h1>Seu Código de Acesso</h1>

                    <div class="code-container">
                      ${generateDigitBoxes(token)}
                    </div>

                    <a href="https://seusite.com/login" class="button">Acessar Plataforma</a>

                    <div class="footer">
                      <p>Este código expirará em 15 minutos. Se você não solicitou este código, apenas ignore este e-mail.</p>
                    </div>
                  </div>
                </body>
                </html>
                """.replace("${generateDigitBoxes(token)}", generateDigitBoxes(token));

            helper.setText(corpoHtml, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Falha ao enviar e-mail com token: " + e.getMessage(), e);
        }
    }

    private String generateDigitBoxes(String token) {
        StringBuilder boxes = new StringBuilder();
        for (char digit : token.toCharArray()) {
            boxes.append("<div class=\"digit-box\">").append(digit).append("</div>");
        }
        return boxes.toString();
    }

    public String previewEmailHtml(String token) {
        return """
            <!DOCTYPE html>
            <html lang="pt-BR">
            <!-- ... (todo o HTML acima) ... -->
            """.replace("${generateDigitBoxes(token)}", generateDigitBoxes(token));
    }
}