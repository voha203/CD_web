package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.admin.AdminCategoryRequest;
import com.sneaker.backend.dto.admin.AdminCategoryResponse;
import com.sneaker.backend.dto.admin.AdminProductImageRequest;
import com.sneaker.backend.dto.admin.AdminProductRequest;
import com.sneaker.backend.dto.admin.AdminProductResponse;
import com.sneaker.backend.dto.admin.AdminProductVariantRequest;
import com.sneaker.backend.dto.admin.AdminVariantSizeRequest;
import com.sneaker.backend.dto.productVariant.ProductVariantResponse;
import com.sneaker.backend.entity.Category;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.ProductImage;
import com.sneaker.backend.entity.ProductVariant;
import com.sneaker.backend.entity.ProductVariantSize;
import com.sneaker.backend.entity.Size;
import com.sneaker.backend.mapper.ProductMapper;
import com.sneaker.backend.repository.CategoryRepository;
import com.sneaker.backend.repository.OrderItemRepository;
import com.sneaker.backend.repository.ProductImageRepository;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.repository.ProductVariantRepository;
import com.sneaker.backend.repository.ProductVariantSizeRepository;
import com.sneaker.backend.repository.SizeRepository;
import com.sneaker.backend.service.AdminProductService;
import com.sneaker.backend.service.DiscountService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AdminProductServiceImpl implements AdminProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private ProductVariantSizeRepository variantSizeRepository;

    @Autowired
    private ProductImageRepository imageRepository;

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private DiscountService discountService;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public List<AdminProductResponse> getProducts(String keyword, String filter) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim().toLowerCase(Locale.ROOT);
        String normalizedFilter = filter == null ? "ALL" : filter.trim().toUpperCase(Locale.ROOT);

        return productRepository.findAll().stream()
                .filter(product -> matchesKeyword(product, normalizedKeyword))
                .filter(product -> matchesFilter(product, normalizedFilter))
                .sorted(Comparator.comparing(Product::getId, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(this::toProductResponse)
                .toList();
    }

    @Override
    public AdminProductResponse getProductById(Long id) {
        return toProductResponse(findProduct(id));
    }

    @Override
    @Transactional
    public AdminProductResponse createProduct(AdminProductRequest request) {
        Product product = new Product();
        applyProductRequest(product, request);
        Product saved = productRepository.save(product);
        syncVariants(saved, request.getVariants());
        return toProductResponse(findProduct(saved.getId()));
    }

    @Override
    @Transactional
    public AdminProductResponse updateProduct(Long id, AdminProductRequest request) {
        Product product = findProduct(id);
        applyProductRequest(product, request);
        Product saved = productRepository.save(product);
        syncVariants(saved, request.getVariants());
        return toProductResponse(findProduct(saved.getId()));
    }

    @Override
    @Transactional
    public AdminProductResponse updateProductStatus(Long id, Boolean active) {
        Product product = findProduct(id);
        product.setActive(Boolean.TRUE.equals(active));
        return toProductResponse(productRepository.save(product));
    }

    @Override
    public List<AdminCategoryResponse> getCategories(String keyword) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim().toLowerCase(Locale.ROOT);

        return categoryRepository.findAll().stream()
                .filter(category -> normalizedKeyword.isEmpty()
                        || contains(category.getName(), normalizedKeyword)
                        || contains(category.getCode(), normalizedKeyword))
                .sorted(Comparator.comparing(Category::getId, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(this::toCategoryResponse)
                .toList();
    }

    @Override
    @Transactional
    public AdminCategoryResponse createCategory(AdminCategoryRequest request) {
        Category category = new Category();
        applyCategoryRequest(category, request);
        return toCategoryResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public AdminCategoryResponse updateCategory(Long id, AdminCategoryRequest request) {
        Category category = findCategory(id);
        applyCategoryRequest(category, request);
        return toCategoryResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public AdminCategoryResponse updateCategoryStatus(Long id, Boolean active) {
        Category category = findCategory(id);
        category.setActive(Boolean.TRUE.equals(active));
        return toCategoryResponse(categoryRepository.save(category));
    }

    private void applyProductRequest(Product product, AdminProductRequest request) {
        product.setName(request.getName().trim());
        product.setBrand(request.getBrand().trim());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setActive(!Boolean.FALSE.equals(request.getActive()));
        product.setCategory(findCategory(request.getCategoryId()));
    }

    private void syncVariants(Product product, List<AdminProductVariantRequest> requests) {
        List<AdminProductVariantRequest> safeRequests = requests == null ? List.of() : requests;
        Map<Long, AdminProductVariantRequest> requestById = safeRequests.stream()
                .filter(request -> request.getId() != null)
                .collect(Collectors.toMap(AdminProductVariantRequest::getId, request -> request, (a, b) -> b));

        List<ProductVariant> existingVariants = variantRepository.findByProductId(product.getId());

        for (ProductVariant variant : existingVariants) {
            AdminProductVariantRequest request = requestById.get(variant.getId());
            if (request == null) {
                variant.setActive(false);
                variantRepository.save(variant);
                continue;
            }
            applyVariantRequest(product, variant, request);
        }

        safeRequests.stream()
                .filter(request -> request.getId() == null)
                .forEach(request -> {
                    ProductVariant variant = new ProductVariant();
                    variant.setProduct(product);
                    applyVariantRequest(product, variant, request);
                });
    }

    private void applyVariantRequest(Product product, ProductVariant variant, AdminProductVariantRequest request) {
        variant.setProduct(product);
        variant.setColor(request.getColor().trim());
        variant.setSku(request.getSku() == null || request.getSku().trim().isEmpty() ? null : request.getSku().trim());
        variant.setActive(!Boolean.FALSE.equals(request.getActive()));

        ProductVariant savedVariant = variantRepository.save(variant);
        syncVariantSizes(savedVariant, request.getSizes());
        syncImages(savedVariant, request.getImages());
    }

    private void syncVariantSizes(ProductVariant variant, List<AdminVariantSizeRequest> requests) {
        List<AdminVariantSizeRequest> safeRequests = requests == null ? List.of() : requests;
        Map<Long, ProductVariantSize> existingBySizeId = variantSizeRepository.findByVariantId(variant.getId()).stream()
                .collect(Collectors.toMap(item -> item.getSize().getId(), item -> item, (a, b) -> a));

        for (AdminVariantSizeRequest request : safeRequests) {
            Size size = sizeRepository.findById(request.getSizeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy size"));
            ProductVariantSize variantSize = existingBySizeId.getOrDefault(size.getId(), new ProductVariantSize());
            variantSize.setVariant(variant);
            variantSize.setSize(size);
            variantSize.setQuantity(request.getQuantity() == null ? 0 : request.getQuantity());
            variantSizeRepository.save(variantSize);
        }
    }

    private void syncImages(ProductVariant variant, List<AdminProductImageRequest> requests) {
        imageRepository.findByVariantId(variant.getId()).forEach(imageRepository::delete);

        List<AdminProductImageRequest> safeRequests = requests == null ? List.of() : requests;
        boolean hasMain = safeRequests.stream().anyMatch(request -> Boolean.TRUE.equals(request.getMain()));

        for (int i = 0; i < safeRequests.size(); i++) {
            AdminProductImageRequest request = safeRequests.get(i);
            ProductImage image = new ProductImage();
            image.setVariant(variant);
            image.setImageUrl(request.getImageUrl().trim());
            image.setMain(Boolean.TRUE.equals(request.getMain()) || (!hasMain && i == 0));
            imageRepository.save(image);
        }
    }

    private AdminProductResponse toProductResponse(Product product) {
        int totalStock = product.getVariants() == null ? 0 : product.getVariants().stream()
                .filter(variant -> !Boolean.FALSE.equals(variant.getActive()))
                .flatMap(variant -> variant.getSizes() == null ? java.util.stream.Stream.empty() : variant.getSizes().stream())
                .map(ProductVariantSize::getQuantity)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();

        double finalPrice = discountService.getFinalPrice(product);
        List<ProductVariantResponse> variants = product.getVariants() == null ? new ArrayList<>() : product.getVariants().stream()
                .map(productMapper::toVariantDTO)
                .toList();

        return AdminProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .price(product.getPrice())
                .finalPrice(finalPrice)
                .onSale(product.getPrice() != null && finalPrice < product.getPrice())
                .discountPercent(discountService.getDiscountPercent(product))
                .description(product.getDescription())
                .categoryId(product.getCategory() == null ? null : product.getCategory().getId())
                .categoryName(product.getCategory() == null ? null : product.getCategory().getName())
                .active(!Boolean.FALSE.equals(product.getActive()))
                .totalStock(totalStock)
                .outOfStock(totalStock <= 0)
                .createdAt(product.getCreatedAt())
                .variants(variants)
                .build();
    }

    private AdminCategoryResponse toCategoryResponse(Category category) {
        return AdminCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .code(category.getCode())
                .active(!Boolean.FALSE.equals(category.getActive()))
                .productCount(productRepository.countByCategoryId(category.getId()))
                .build();
    }

    private void applyCategoryRequest(Category category, AdminCategoryRequest request) {
        category.setName(request.getName().trim());
        category.setCode(request.getCode().trim().toUpperCase(Locale.ROOT));
        category.setActive(!Boolean.FALSE.equals(request.getActive()));
    }

    private boolean matchesKeyword(Product product, String keyword) {
        if (keyword.isEmpty()) return true;
        return contains(product.getName(), keyword)
                || contains(product.getBrand(), keyword)
                || (product.getCategory() != null && contains(product.getCategory().getName(), keyword));
    }

    private boolean matchesFilter(Product product, String filter) {
        return switch (filter) {
            case "ACTIVE" -> !Boolean.FALSE.equals(product.getActive());
            case "INACTIVE" -> Boolean.FALSE.equals(product.getActive());
            case "DISCOUNT" -> product.getPrice() != null && discountService.getFinalPrice(product) < product.getPrice();
            case "OUT_OF_STOCK" -> toProductResponse(product).getTotalStock() <= 0;
            default -> true;
        };
    }

    private boolean contains(String value, String keyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(keyword);
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm"));
    }

    private Category findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục"));
    }
}
