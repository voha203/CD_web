package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.common.PageResponse;
import com.sneaker.backend.dto.product.ProductResponse;
import com.sneaker.backend.dto.product.ProductRequest;
import com.sneaker.backend.entity.Category;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.mapper.ProductMapper;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.repository.CategoryRepository;
import com.sneaker.backend.repository.OrderItemRepository;
import com.sneaker.backend.service.DiscountService;
import com.sneaker.backend.service.ProductService;

import com.sneaker.backend.specification.ProductSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

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
    public PageResponse<ProductResponse> getAll(int page, int size, String sortBy, String sortDir, List<String> brands, Double minPrice, Double maxPrice, Long categoryId, List<Integer> sizes, String keyword) {
        // Tạo đối tượng Sort từ tham số truyền vào
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, normalizeSortBy(sortBy));
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 60), sort);

        // Gom các điều kiện lọc động lại (Nếu param truyền vào là null, JPA tự động bỏ qua điều kiện đó)
        Specification<Product> spec = Specification.where(ProductSpecification.isActive())
                .and(ProductSpecification.hasBrands(brands))
                .and(ProductSpecification.priceGreaterThanOrEqual(minPrice))
                .and(ProductSpecification.priceLessThanOrEqual(maxPrice))
                .and(ProductSpecification.hasCategory(categoryId))
                .and(ProductSpecification.hasSizes(sizes))
                .and(ProductSpecification.hasKeyword(keyword));

        // Tìm kiếm theo cả Bộ lọc (Specification) và Sắp xếp (Sort)
        Page<Product> products = productRepository.findAll(spec, pageable);
        List<ProductResponse> content = products.getContent().stream()
                .map(this::enrichProductDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages(),
                products.isFirst(),
                products.isLast()
        );
    }

    private String normalizeSortBy(String sortBy) {
        Set<String> allowedFields = Set.of("id", "name", "price", "brand", "createdAt");
        return allowedFields.contains(sortBy) ? sortBy : "id";
    }

    // =========================
    // GET SUGGESTIONS (Phục vụ Header gợi ý nhanh)
    // =========================
    @Override
    public List<ProductResponse> getSuggestions(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ArrayList<>();
        }

        // Tạo điều kiện lọc chỉ theo từ khóa
        Specification<Product> spec = Specification.where(ProductSpecification.isActive())
                .and(ProductSpecification.hasKeyword(keyword));

        // Giới hạn chỉ lấy tối đa 5 sản phẩm khớp nhất (PageRequest.of(trang_số_0, kích_thước_5))
        List<Product> products = productRepository.findAll(spec, PageRequest.of(0, 5)).getContent();

        return products.stream()
                .map(this::enrichProductDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // GET RECOMMENDATIONS (Gợi ý dựa trên đơn hàng đã mua)
    // =========================
    @Override
    public List<ProductResponse> getRecommendations(Long orderId) {
        // Lấy danh sách ID sản phẩm khách đã mua trong đơn hàng này
        List<Long> purchasedProductIds = orderItemRepository.findProductIdsByOrderId(orderId);

        // Nếu đơn hàng trống (chống lỗi), lấy đại 7 sản phẩm bất kỳ
        if (purchasedProductIds == null || purchasedProductIds.isEmpty()) {
            return productRepository.findAll(Specification.where(ProductSpecification.isActive()), PageRequest.of(0, 7)).getContent()
                    .stream().map(this::enrichProductDTO).collect(Collectors.toList());
        }

        // Lấy thông tin các sản phẩm đã mua để trích xuất Brand (Thương hiệu)
        List<Product> purchasedProducts = productRepository.findAllById(purchasedProductIds);
        List<String> purchasedBrands = purchasedProducts.stream()
                .map(Product::getBrand)
                .distinct()
                .collect(Collectors.toList());

        // Query tìm tối đa 7 sản phẩm cùng Brand, nhưng loại trừ những đôi vừa mua
        List<Product> recommendedProducts = new ArrayList<>(
                productRepository.findByBrandInAndIdNotIn(
                        purchasedBrands,
                        purchasedProductIds,
                        PageRequest.of(0, 7)
                ).getContent()
        );

        // Nếu tìm được ít hơn 4 đôi, lấy thêm các đôi khác đắp vào cho đẹp Slider
        if (recommendedProducts.size() < 4) {
            int missingCount = 7 - recommendedProducts.size();

            // Tạo danh sách loại trừ mới: Bao gồm cả hàng ĐÃ MUA + hàng ĐÃ GỢI Ý ở trên
            List<Long> excludeIds = new ArrayList<>(purchasedProductIds);
            for (Product p : recommendedProducts) {
                excludeIds.add(p.getId()); // Thêm ID sản phẩm đã được gợi ý vào list loại trừ
            }

            // Tìm thêm các đôi chưa mua (không quan tâm brand nữa)
            List<Product> fallbackProducts = productRepository.findByIdNotIn(
                    excludeIds,
                    PageRequest.of(0, missingCount)
            ).getContent();

            recommendedProducts.addAll(fallbackProducts);
        }

        return recommendedProducts.stream()
                .map(this::enrichProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getSaleProducts() {
        return productRepository.findAll().stream()
                .filter(product -> !Boolean.FALSE.equals(product.getActive()))
                .filter(product -> product.getPrice() != null)
                .filter(product -> discountService.getFinalPrice(product) < product.getPrice())
                .map(this::enrichProductDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // GET BY ID
    // =========================
    @Override
    public ProductResponse getById(Long id) {
        Product p = findProductById(id);
        if (Boolean.FALSE.equals(p.getActive())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm id: " + id);
        }

        return enrichProductDTO(p);
    }

    // =========================
    // CREATE
    // =========================
    @Override
    public ProductResponse create(ProductRequest request) {

        //  VALIDATE
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }

        if (request.getPrice() == null || request.getPrice() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price must be >= 0");
        }

        if (request.getCategoryId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CategoryId is required");
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
    public ProductResponse update(Long id, ProductRequest request) {

        Product p = findProductById(id);

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }

        if (request.getPrice() == null || request.getPrice() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price must be >= 0");
        }

        if (request.getCategoryId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CategoryId is required");
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm id: " + id));
    }

    private Category findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục id: " + id));
    }

    private ProductResponse enrichProductDTO(Product p) {
        ProductResponse dto = productMapper.toDTO(p);

        // 🔥 FINAL PRICE (có check null)
        if (p.getPrice() != null) {
            Double finalPrice = discountService.getFinalPrice(p);
            dto.setFinalPrice(finalPrice);
            dto.setOnSale(finalPrice < p.getPrice());
            dto.setDiscountPercent(discountService.getDiscountPercent(p));

            discountService.getBestActiveDiscount(p).ifPresent(discount -> {
                dto.setDiscountType(discount.getType());
                dto.setDiscountValue(discount.getValue());
            });
        } else {
            dto.setFinalPrice(0D);
            dto.setOnSale(false);
            dto.setDiscountPercent(0);
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
