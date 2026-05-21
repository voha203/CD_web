package com.sneaker.backend.specification;

import com.sneaker.backend.entity.Product;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ProductSpecification {

    // Lọc theo danh sách thương hiệu (WHERE brand IN ('Nike', 'Adidas'))
    public static Specification<Product> hasBrands(List<String> brands) {
        return (root, query, cb) -> (brands == null || brands.isEmpty())
                ? null
                : root.get("brand").in(brands);
    }

    // Lọc theo giá tối thiểu (WHERE price >= minPrice)
    public static Specification<Product> priceGreaterThanOrEqual(Double minPrice) {
        return (root, query, cb) -> minPrice == null
                ? null
                : cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    // Lọc theo giá tối đa (WHERE price <= maxPrice)
    public static Specification<Product> priceLessThanOrEqual(Double maxPrice) {
        return (root, query, cb) -> maxPrice == null
                ? null
                : cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    // Lọc theo danh sách danh mục (WHERE category_id = ...)
    public static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, cb) -> categoryId == null
                ? null
                : cb.equal(root.get("category").get("id"), categoryId);
    }

    // Lọc theo danh sách Kích cỡ
    public static Specification<Product> hasSizes(List<Integer> sizes) {
        return (root, query, cb) -> {
            if (sizes == null || sizes.isEmpty()) {
                return null;
            }

            // Đảm bảo không bị lặp lại Product khi một sản phẩm khớp nhiều size trùng nhau
            query.distinct(true);

            // Join từ Product vào ProductVariant
            Join<?, ?> variantJoin = root.join("variants");

            // Join từ ProductVariant lặn tiếp vào ProductVariantSize
            Join<?, ?> variantSizeJoin = variantJoin.join("sizes");

            // Join từ ProductVariantSize vào Size
            Join<?, ?> sizeJoin = variantSizeJoin.join("size");

            // Lấy ra giá trị số nguyên để so sánh điều kiện IN
            return sizeJoin.get("value").in(sizes);
        };
    }

    // Lọc theo từ khóa hiện tại
    public static Specification<Product> hasKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return null;
            }

            // Tạo chuỗi tìm kiếm (chuyển về chữ thường để không phân biệt hoa thường)
            String searchPattern = "%" + keyword.trim().toLowerCase() + "%";

            // 1. Tìm trong Tên sản phẩm
            var namePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")), searchPattern
            );

            // 2. Tìm trong Thương hiệu (Brand)
            var brandPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("brand")), searchPattern
            );

            // 3. Tìm trong Mô tả (Description)
            var descPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("description")), searchPattern
            );

            // Gộp tất cả lại bằng toán tử OR
            return criteriaBuilder.or(namePredicate, brandPredicate, descPredicate);
        };
    }
}