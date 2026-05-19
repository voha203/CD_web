package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.product.ProductDTO;
import com.sneaker.backend.dto.product.ProductRequest;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.Category;
import com.sneaker.backend.mapper.ProductMapper;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.repository.CategoryRepository;
import com.sneaker.backend.service.DiscountService;
import com.sneaker.backend.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DiscountService discountService;

    @Autowired
    private ProductMapper productMapper;

    // =========================
    // GET ALL
    // =========================
    @Override
    public List<ProductDTO> getAll(String sortBy, String sortDir) {
        // Tạo đối tượng Sort từ tham số truyền vào
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy);

        // Lấy dữ liệu đã sắp xếp
        List<Product> products = productRepository.findAll(sort);

        return products.stream()
                .map(this::enrichProductDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // GET BY ID
    // =========================
    @Override
    public ProductDTO getById(Long id) {
        Product p = findProductById(id);

        return enrichProductDTO(p);
    }

    // =========================
    // CREATE
    // =========================
    @Override
    public ProductDTO create(ProductRequest request) {

        //  VALIDATE
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }

        if (request.getPrice() == null || request.getPrice() < 0) {
            throw new RuntimeException("Price must be >= 0");
        }

        if (request.getCategoryId() == null) {
            throw new RuntimeException("CategoryId is required");
        }

        Category category = findCategoryById(request.getCategoryId());

        Product p = new Product();
        updateEntityFromRequest(p, request, category);

        return enrichProductDTO(productRepository.save(p));
    }

    // =========================
    // UPDATE
    // =========================
    @Override
    public ProductDTO update(Long id, ProductRequest request) {

        Product p = findProductById(id);

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }

        if (request.getPrice() == null || request.getPrice() < 0) {
            throw new RuntimeException("Price must be >= 0");
        }

        if (request.getCategoryId() == null) {
            throw new RuntimeException("CategoryId is required");
        }

        Category category = findCategoryById(request.getCategoryId());

        updateEntityFromRequest(p, request, category);

        return enrichProductDTO(productRepository.save(p));
    }

    // =========================
    // DELETE
    // =========================
    @Override
    public void delete(Long id) {
        productRepository.delete(findProductById(id));
    }

    // =========================
    // CÁC PHƯƠNG THỨC HỖ TRỢ NHỎ
    // =========================
    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm id: " + id));
    }

    private Category findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục id: " + id));
    }

    private ProductDTO enrichProductDTO(Product p) {
        ProductDTO dto = productMapper.toDTO(p);

        // 🔥 FINAL PRICE (có check null)
        if (p.getPrice() != null) {
            dto.setFinalPrice(discountService.getFinalPrice(p));
        }

        return dto;
    }

    private void updateEntityFromRequest(Product p, ProductRequest req, Category cat) {
        p.setName(req.getName());
        p.setBrand(req.getBrand());
        p.setPrice(req.getPrice());
        p.setDescription(req.getDescription());
        p.setCategory(cat);
    }
}