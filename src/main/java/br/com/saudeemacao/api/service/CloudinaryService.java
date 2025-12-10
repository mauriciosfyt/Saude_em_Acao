package br.com.saudeemacao.api.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private static final long MAX_FILE_SIZE = 30 * 1024 * 1024;
    private static final String[] ALLOWED_CONTENT_TYPES = {
            "image/jpeg", "image/png", "image/gif", "image/webp"
    };

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("O arquivo não pode ser nulo ou vazio");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("A imagem de perfil deve ter no máximo 30 MB.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("O arquivo excede o tamanho máximo permitido de 30MB");
        }

        if (!isContentTypeAllowed(file.getContentType())) {
            throw new IllegalArgumentException("Tipo de arquivo não suportado. Use JPEG, PNG, GIF ou WEBP");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new IOException("Falha ao fazer upload do arquivo: " + e.getMessage(), e);
        }
    }

    private boolean isContentTypeAllowed(String contentType) {
        if (contentType == null) {
            return false;
        }
        for (String allowedType : ALLOWED_CONTENT_TYPES) {
            if (allowedType.equalsIgnoreCase(contentType)) {
                return true;
            }
        }
        return false;
    }

    public void deleteFile(String publicId) throws IOException {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new IOException("Falha ao deletar arquivo: " + e.getMessage(), e);
        }
    }
}
