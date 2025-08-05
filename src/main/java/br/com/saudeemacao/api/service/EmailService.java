package br.com.saudeemacao.api.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    /**
     * E-mail para login por token (acesso geral).
     */
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
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #f0f0f0; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0d1b2a, #1b263b); border-radius: 12px; padding: 40px 20px; box-shadow: 0 0 20px rgba(0, 123, 255, 0.25); }
                    .logo { text-align: center; margin-bottom: 20px; }
                    .logo img { max-width: 120px; height: auto; }
                    .welcome { text-align: center; margin-bottom: 30px; }
                    .welcome-title { font-size: 18px; color: #e5e7eb; font-weight: 500; margin-bottom: 8px; }
                    .welcome-title strong { color: #3b82f6; }
                    .welcome-phrase { font-size: 15px; color: #9ca3af; font-style: italic; }
                    h1 { text-align: center; font-size: 26px; color: #3b82f6; margin-bottom: 24px; letter-spacing: 1px; text-transform: uppercase; }
                    .code-container { text-align: center; margin: 30px 0; }
                    .codigo { display: inline-block; font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 12px; background-color: rgba(0, 0, 0, 0.2); padding: 15px 25px; border-radius: 8px; }
                    .footer { text-align: center; margin-top: 40px; font-size: 13px; color: #7a7a7a; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="logo">
                      <img src="https://res.cloudinary.com/dkbmbgtf0/image/upload/v1754183893/logo_gq4bis.png" alt="Logo Saúde em Ação" />
                    </div>
                    <div class="welcome">
                      <p class="welcome-title">Seja muito bem-vindo(a) à <strong>Saúde em Ação</strong>, o lugar onde sua transformação começa</p>
                      <p class="welcome-phrase">Prepare-se para viver sua melhor versão.</p>
                    </div>
                    <h1>Seu Código de Acesso</h1>
                    <div class="code-container"><span class="codigo">${token}</span></div>
                    <div class="footer">
                      <p>Este código expirará em 15 minutos. Se você não solicitou este código, apenas ignore este e-mail.</p>
                    </div>
                  </div>
                </body>
                </html>
                """.replace("${token}", token);

            helper.setText(corpoHtml, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Falha ao enviar e-mail com token de acesso: " + e.getMessage(), e);
        }
    }

    /**
     * NOVO MÉTODO: E-mail específico para redefinição de senha.
     */
    public void enviarTokenRedefinicaoSenha(String email, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(from);
            helper.setTo(email);
            helper.setSubject("Redefinição de Senha - Saúde em Ação");

            String corpoHtml = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <title>Redefinição de Senha - Saúde em Ação</title>
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #f0f0f0; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0d1b2a, #1b263b); border-radius: 12px; padding: 40px 20px; box-shadow: 0 0 20px rgba(255, 100, 100, 0.25); }
                    .logo { text-align: center; margin-bottom: 20px; }
                    .logo img { max-width: 120px; }
                    h1 { text-align: center; font-size: 26px; color: #f87171; text-transform: uppercase; letter-spacing: 1px; }
                    p { text-align: center; color: #e5e7eb; font-size: 16px; line-height: 1.5; }
                    .code-container { text-align: center; margin: 30px 0; }
                    .codigo { display: inline-block; font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 12px; background-color: rgba(0, 0, 0, 0.2); padding: 15px 25px; border-radius: 8px; }
                    .footer { text-align: center; margin-top: 40px; font-size: 13px; color: #7a7a7a; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="logo">
                        <img src="https://res.cloudinary.com/dkbmbgtf0/image/upload/v1754183893/logo_gq4bis.png" alt="Logo Saúde em Ação" />
                    </div>
                    <h1>Redefinição de Senha</h1>
                    <p>Recebemos uma solicitação para redefinir sua senha. Utilize o código abaixo para criar uma nova senha.</p>
                    <div class="code-container"><span class="codigo">${token}</span></div>
                    <div class="footer">
                      <p>Este código expirará em 15 minutos.</p>
                      <p>Se você não solicitou a redefinição de senha, por favor, ignore este e-mail com segurança.</p>
                    </div>
                  </div>
                </body>
                </html>
                """.replace("${token}", token);

            helper.setText(corpoHtml, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Falha ao enviar e-mail de redefinição de senha: " + e.getMessage(), e);
        }
    }
}