package br.com.saudeemacao.api.security;

import br.com.saudeemacao.api.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class WebSocketJwtInterceptor implements ChannelInterceptor {

    @Autowired
    private LoginService loginService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            List<String> tokenList = accessor.getNativeHeader("Authorization");
            String token = null;

            if (tokenList != null && !tokenList.isEmpty()) {
                String fullToken = tokenList.get(0);
                if (fullToken.startsWith("Bearer ")) {
                    token = fullToken.substring(7);
                }
            }

            if (token != null) {
                try {
                    String username = loginService.validaToken(token);
                    UserDetails userDetails = loginService.loadUserByUsername(username);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    accessor.setUser(authentication);
                } catch (Exception e) {
                    return null; // Recusa a conexão se o token for inválido
                }
            }
        }
        return message;
    }
}