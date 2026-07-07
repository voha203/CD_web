package com.sneaker.backend.service;

import com.sneaker.backend.dto.upload.ImageUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UploadService {
    ImageUploadResponse uploadProductImage(MultipartFile file);
}
