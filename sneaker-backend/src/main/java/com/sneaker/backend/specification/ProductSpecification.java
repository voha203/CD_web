package com.sneaker.backend.specification;

import com.sneaker.backend.entity.Product;
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
}