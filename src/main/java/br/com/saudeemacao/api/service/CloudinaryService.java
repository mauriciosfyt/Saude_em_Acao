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

    private static final long MAX_FILE_SIZE = 100 * 1024 * 1024;

    private static final String[] ALLOWED_CONTENT_TYPES = {
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo" // Adicionados formatos de vídeo
    };

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("O arquivo não pode ser nulo ou vazio");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("O arquivo excede o tamanho máximo permitido de 100MB");
        }

        String contentType = file.getContentType();
        if (!isContentTypeAllowed(contentType)) {
            throw new IllegalArgumentException("Tipo de arquivo não suportado. Aceitamos apenas Imagens e Vídeos.");
        }

        try {
            // "resource_type", "auto" é crucial!
            // Ele permite que o Cloudinary detecte se é imagem ou vídeo automaticamente.
            Map params = ObjectUtils.asMap(
                    "resource_type", "auto"
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            return uploadResult.get("secure_url").toString();
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