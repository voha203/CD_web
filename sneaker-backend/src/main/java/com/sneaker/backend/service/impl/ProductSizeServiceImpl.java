package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.productsize.ProductSizeRequest;
import com.sneaker.backend.dto.productsize.ProductSizeResponse;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.ProductSize;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.repository.ProductSizeRepository;
import com.sneaker.backend.service.ProductSizeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductSizeServiceImpl implements ProductSizeService {

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<ProductSizeResponse> getByProduct(Long productId) {
        List<ProductSize> list = productSizeRepository.findByProductId(productId);

        return list.stream().map(ps -> {
            ProductSizeResponse dto = new ProductSizeResponse();
            dto.setId(ps.getId());
            dto.setSize(ps.getSize());
            dto.setQuantity(ps.getQuantity());

            // Kiểm tra null an toàn trước khi lấy ID
            if (ps.getProduct() != null) {
                dto.setProductId(ps.getProduct().getId());
            }

            return dto;
        }).toList();
    }
    @Override
    public ProductSize create(ProductSize productSize) {

        // 🔥 CHECK NULL PRODUCT
        if (productSize.getProduct() == null || productSize.getProduct().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ProductId is required");
        }

        Long productId = productSize.getProduct().getId();
        Integer size = productSize.getSize();

        //  CHECK SIZE
        if (size == null || size < 30 || size > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid size (30-50)");
        }

        //  CHECK QUANTITY
        if (productSize.getQuantity() == null || productSize.getQuantity() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be >= 0");
        }

        //  CHECK PRODUCT TỒN TẠI
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        //  CHECK TRÙNG
        boolean exists = productSizeRepository
                .existsByProductIdAndSize(productId, size);

        if (exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Size already exists for this product");
        }

        productSize.setProduct(product);

        return productSizeRepository.save(productSize);
    }

    @Override
    public ProductSizeResponse create(ProductSizeRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        ProductSize productSize = new ProductSize();
        productSize.setProduct(product);
        productSize.setSize(request.getSize());
        productSize.setQuantity(request.getQuantity());

        ProductSize saved = create(productSize);

        ProductSizeResponse response = new ProductSizeResponse();
        response.setId(saved.getId());
        response.setSize(saved.getSize());
        response.setQuantity(saved.getQuantity());
        response.setProductId(product.getId());

        return response;
    }
}
