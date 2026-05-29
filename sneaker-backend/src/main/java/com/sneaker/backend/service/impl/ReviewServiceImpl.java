package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.review.ReviewDTO;
import com.sneaker.backend.dto.review.ReviewRequest;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.Review;
import com.sneaker.backend.entity.User;
import com.sneaker.backend.mapper.ReviewMapper;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.repository.ReviewRepository;
import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewMapper reviewMapper;

    // =========================
    // ADD REVIEW
    // =========================
    @Override
    @Transactional
    public ReviewDTO addReview(Long productId, ReviewRequest request) {
        Long userId = getCurrentUserId();

        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setProduct(product);
        review.setUser(user);

        Review savedReview = reviewRepository.save(review);
        productRepository.save(product);

        return reviewMapper.toDTO(savedReview);
    }

    // =========================
    // GET REVIEWS BY PRODUCT
    // =========================
    @Override
    public Page<ReviewDTO> getReviewsByProduct(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);

        return reviews.map(reviewMapper::toDTO);
    }

    // =========================
    // CÁC PHƯƠNG THỨC HỖ TRỢ LẤY USER
    // =========================
    private String getCurrentUsername() {
        // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // if (auth == null || auth.getPrincipal() == null) throw new RuntimeException("Unauthenticated");
        // return auth.getPrincipal().toString();
        return "admin";
    }

    private Long getCurrentUserId() {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}