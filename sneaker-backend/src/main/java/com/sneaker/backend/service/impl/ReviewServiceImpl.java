package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.review.ReviewRequest;
import com.sneaker.backend.dto.review.ReviewResponse;
import com.sneaker.backend.dto.review.ReviewSummaryResponse;
import com.sneaker.backend.entity.Order;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.Review;
import com.sneaker.backend.entity.User;
import com.sneaker.backend.repository.OrderItemRepository;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.repository.ReviewRepository;
import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public ReviewResponse addReview(Long productId, ReviewRequest request) {
        User user = getCurrentUser();
        Product product = findProduct(productId);
        Order reviewOrder = findReviewableOrder(user.getId(), productId);

        if (reviewRepository.existsByUserIdAndProductIdAndOrderId(user.getId(), productId, reviewOrder.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn đã đánh giá sản phẩm này cho đơn hàng đã chọn");
        }

        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());
        review.setProduct(product);
        review.setUser(user);
        review.setOrder(reviewOrder);

        return toResponse(reviewRepository.save(review), user.getId());
    }

    @Override
    public Page<ReviewResponse> getReviewsByProduct(Long productId, int page, int size) {
        findProduct(productId);
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 20), Sort.by("createdAt").descending());
        Long currentUserId = getOptionalCurrentUserId();
        return reviewRepository.findByProductId(productId, pageable)
                .map(review -> toResponse(review, currentUserId));
    }

    @Override
    public ReviewSummaryResponse getSummary(Long productId) {
        findProduct(productId);
        return new ReviewSummaryResponse(
                reviewRepository.getAverageRatingByProductId(productId),
                reviewRepository.countByProductId(productId)
        );
    }

    @Override
    public Map<String, Object> canReview(Long productId) {
        User user = getCurrentUser();
        findProduct(productId);
        List<Order> deliveredOrders = orderItemRepository.findDeliveredOrdersForReview(user.getId(), productId);

        Order reviewableOrder = deliveredOrders.stream()
                .filter(order -> !reviewRepository.existsByUserIdAndProductIdAndOrderId(user.getId(), productId, order.getId()))
                .findFirst()
                .orElse(null);

        boolean canReview = reviewableOrder != null;
        return Map.of(
                "canReview", canReview,
                "orderId", canReview ? reviewableOrder.getId() : 0,
                "message", canReview
                        ? "Bạn có thể đánh giá sản phẩm này"
                        : "Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã giao và chưa đánh giá trước đó"
        );
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request) {
        User user = getCurrentUser();
        Review review = reviewRepository.findByIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đánh giá của bạn"));

        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());
        return toResponse(reviewRepository.save(review), user.getId());
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        User user = getCurrentUser();
        Review review = reviewRepository.findByIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đánh giá của bạn"));
        reviewRepository.delete(review);
    }

    private Order findReviewableOrder(Long userId, Long productId) {
        return orderItemRepository.findDeliveredOrdersForReview(userId, productId)
                .stream()
                .filter(order -> !reviewRepository.existsByUserIdAndProductIdAndOrderId(userId, productId, order.getId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn chỉ có thể đánh giá sản phẩm đã mua trong đơn đã giao"));
    }

    private Product findProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm"));
        if (Boolean.FALSE.equals(product.getActive())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm");
        }
        return product;
    }

    private ReviewResponse toResponse(Review review, Long currentUserId) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setProductId(review.getProduct().getId());
        response.setOrderId(review.getOrder() == null ? null : review.getOrder().getId());
        response.setOwner(currentUserId != null && review.getUser().getId().equals(currentUserId));
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setUsername(review.getUser().getUsername());
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());
        return response;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");
        }

        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private Long getOptionalCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        return userRepository.findByUsername(auth.getName()).map(User::getId).orElse(null);
    }
}
