package br.com.saudeemacao.api.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    private String criarBaseTemplate(String titulo, String preHeader, String conteudoPrincipal) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>%s</title>
                <style>
                    body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
                    .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
                    .header { background-color: #111827; padding: 20px; text-align: center; }
                    .header img { max-width: 120px; }
                    .content { padding: 30px; color: #333333; line-height: 1.6; }
                    .content h1 { font-size: 24px; color: #111827; margin-top: 0; }
                    .content p { font-size: 16px; margin: 1em 0; }
                    .code-box { background-color: #f0f0f0; border: 1px dashed #cccccc; border-radius: 6px; padding: 15px 20px; text-align: center; margin: 25px 0; }
                    .code { font-size: 32px; font-weight: bold; color: #000000; letter-spacing: 8px; }
                    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e0e0e0; }
                    .hidden-preheader { display: none; max-height: 0; overflow: hidden; }
                </style>
            </head>
            <body>
                <div class="hidden-preheader">%s</div>
                <div class="email-container">
                    <div class="header">
                        <img src="https://res.cloudinary.com/dyd0bit5s/image/upload/v1754490738/logo_fw2pnp.png" alt="Logo Saúde em Ação">
                    </div>
                    <div class="content">
                        %s
                    </div>
                    <div class="footer">
                        © %d Saúde em Ação. Todos os direitos reservados.
                    </div>
                </div>
            </body>
            </html>
            """, titulo, preHeader, conteudoPrincipal, java.time.Year.now().getValue());
    }

    public void enviarToken(String email, String token) {
        String titulo = "Seu Código de Acesso";
        String preHeader = "Use este código para acessar sua conta Saúde em Ação.";
        String conteudo = String.format("""
            <h1>Seu Código de Acesso</h1>
            <p>Olá,</p>
            <p>Use o código abaixo para fazer login na sua conta. Este código é válido por 15 minutos.</p>
            <div class="code-box">
                <span class="code">%s</span>
            </div>
            <p>Se você não solicitou este código, por favor, ignore este e-mail.</p>
            <p>Atenciosamente,<br>Equipe Saúde em Ação</p>
            """, token);

        String corpoHtml = criarBaseTemplate(titulo, preHeader, conteudo);
        enviarEmail(email, titulo, corpoHtml);
    }

    public void enviarTokenRedefinicaoSenha(String email, String token) {
        String titulo = "Redefinição de Senha";
        String preHeader = "Recebemos uma solicitação para redefinir sua senha.";
        String conteudo = String.format("""
            <h1>Redefinição de Senha</h1>
            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta. Utilize o código abaixo para prosseguir.</p>
            <div class="code-box">
                <span class="code">%s</span>
            </div>
            <p>Este código expirará em 15 minutos. Se você não fez esta solicitação, pode ignorar este e-mail com segurança.</p>
            <p>Atenciosamente,<br>Equipe Saúde em Ação</p>
            """, token);

        String corpoHtml = criarBaseTemplate(titulo, preHeader, conteudo);
        enviarEmail(email, titulo, corpoHtml);
    }

    public void notificarAdminNovaReserva(String adminEmail, String nomeAluno, String nomeProduto, int quantidade) {
        String titulo = "Nova Solicitação de Reserva";
        String preHeader = String.format("O aluno %s solicitou um novo produto.", nomeAluno);
        String conteudo = String.format("""
            <h1>Nova Solicitação de Reserva</h1>
            <p>Uma nova solicitação de reserva foi feita e requer sua atenção.</p>
            <ul>
                <li><strong>Aluno:</strong> %s</li>
                <li><strong>Produto:</strong> %s</li>
                <li><strong>Quantidade:</strong> %d</li>
            </ul>
            <p>Por favor, acesse o painel administrativo para aprovar ou rejeitar a solicitação.</p>
            """, nomeAluno, nomeProduto, quantidade);

        String corpoHtml = criarBaseTemplate(titulo, preHeader, conteudo);
        enviarEmail(adminEmail, titulo, corpoHtml);
    }

    public void notificarAlunoStatusReserva(String alunoEmail, String nomeProduto, String status, String motivoHtml) {
        String titulo = "Atualização da sua Reserva";
        String preHeader = String.format("Sua reserva do produto %s foi atualizada.", nomeProduto);
        String conteudo = String.format("""
            <h1>Sua reserva foi %s</h1>
            <p>Olá,</p>
            <p>Temos uma atualização sobre a sua solicitação de reserva para o produto <strong>%s</strong>.</p>
            <p><strong>Status: %s</strong></p>
            %s
            <p>Atenciosamente,<br>Equipe Saúde em Ação</p>
            """, status, nomeProduto, status, motivoHtml);

        String corpoHtml = criarBaseTemplate(titulo, preHeader, conteudo);
        enviarEmail(alunoEmail, titulo, corpoHtml);
    }

    private void enviarEmail(String para, String assunto, String corpoHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from, "Saúde em Ação");
            helper.setTo(para);
            helper.setSubject(assunto);
            helper.setText(corpoHtml, true);
            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Falha ao enviar e-mail para {}: {}", para, e.getMessage());
        }
    }

    public void notificarAlunoNovoTreinoAtribuido(String alunoEmail, String nomeAluno, String nomeTreino, String nomeResponsavel) {
        String titulo = "Novo Treino Atribuído para Você!";
        String preHeader = String.format("Um novo plano de treinos, '%s', foi adicionado ao seu perfil.", nomeTreino);
        String conteudo = String.format("""
        <h1>Novo Treino Disponível!</h1>
        <p>Olá, %s,</p>
        <p>Temos uma ótima notícia! Seu instrutor(a) <strong>%s</strong> acaba de atribuir um novo treino para você:</p>
        <div class="code-box" style="text-align: left; padding: 20px;">
            <p style="font-size: 18px; margin: 0; color: #333;"><strong>Nome do Treino:</strong> %s</p>
        </div>
        <p>Acesse o aplicativo ou o portal para conferir os detalhes dos exercícios e começar com tudo!</p>
        <p>Bons treinos,<br>Equipe Saúde em Ação</p>
        """, nomeAluno, nomeResponsavel, nomeTreino);

        String corpoHtml = criarBaseTemplate(titulo, preHeader, conteudo);
        enviarEmail(alunoEmail, titulo, corpoHtml);
    }

    public void enviarEmailConclusaoSemanal(String para, String nomeAluno, String nomeTreino, boolean isAluno) {
        String titulo = "Parabéns! Semana de Treinos Concluída";
        String preHeader = "Todos os exercícios da semana foram finalizados com sucesso.";

        String corpoPersonalizado;

        if (isAluno) {
            corpoPersonalizado = String.format("""
            <p>Parabéns, <strong>%s</strong>!</p>
            <p>Você completou todos os dias previstos do seu treino <strong>%s</strong> nesta semana.</p>
            <p>Mantenha a constância e continue evoluindo!</p>
            """, nomeAluno, nomeTreino);
        } else {
            corpoPersonalizado = String.format("""
            <p>Olá,</p>
            <p>O aluno <strong>%s</strong> acabou de concluir a semana completa do treino <strong>%s</strong>.</p>
            <p>Acompanhe o desempenho dele pelo painel administrativo.</p>
            """, nomeAluno, nomeTreino);
        }

        String conteudo = String.format("""
        <h1>Semana Concluída! 🚀</h1>
        %s
        <p>Atenciosamente,<br>Equipe Saúde em Ação</p>
        """, corpoPersonalizado);

        String corpoHtml = criarBaseTemplate(titulo, preHeader, conteudo);
        enviarEmail(para, titulo, corpoHtml);
    }

}