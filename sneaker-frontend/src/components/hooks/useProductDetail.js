import { useState, useEffect, useCallback } from "react";
import { getProductById, getProductReviews, submitProductReview } from "../../services/api";
import { getApiErrorMessage } from "../../services/apiError";

export function useProductDetail(id) {
    // State để lưu dữ liệu chi tiết sản phẩm
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // State quản lý phần bình luận và đánh giá (REVIEWS)
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ totalElements: 0, totalPages: 0 });
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState("");

    // State cho Form gửi đánh giá
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hàm lấy danh sách bình luận (Reviews)
    const fetchReviews = useCallback((page = 0) => {
        getProductReviews(id, page)
            .then(data => {
                setReviews(data.content);
                setReviewStats({
                    totalElements: data.totalElements,
                    totalPages: data.totalPages,
                });
            })
            .catch(err => console.error("Lỗi lấy bình luận:", getApiErrorMessage(err)));
    }, [id, product?.averageRating]);

    // Tự động gọi API Reviews (fetchReviews) khi mở tab Reviews, đổi ID sản phẩm hoặc chuyển trang
    useEffect(() => {
        fetchReviews(currentPage);
    }, [currentPage, fetchReviews]);

    // Gọi API lấy chi tiết sản phẩm khi ID thay đổi hoặc khi component vừa load
    useEffect(() => {
        setLoading(true);   // Reset loading mỗi khi id thay đổi
        setError("");
        getProductById(id)
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                setError(getApiErrorMessage(err, "Không thể tải chi tiết sản phẩm."));
                setLoading(false);
            });
    }, [id]);

    // Hàm xử lý gửi review mới
    const addReview = async (newReviewData) => {
        if (newReviewData.comment.trim() === "") {
            alert("Vui lòng nhập nội dung đánh giá!");
            return false;
        }

        setIsSubmitting(true);
        try {
            await submitProductReview(id, newReviewData);
            alert("Đánh giá thành công!");

            // Đồng bộ lại trang hiển thị
            if (currentPage === 0) {
                fetchReviews(0);
            } else {
                setCurrentPage(0);
            }
            return true; // Trả về true nếu thành công để Component xóa dữ liệu trong Form
        } catch (err) {
            alert(getApiErrorMessage(err, "Có lỗi xảy ra khi gửi đánh giá."));
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        product,
        loading,
        error,
        reviews,
        reviewStats,
        currentPage,
        setCurrentPage,
        isSubmitting,
        addReview
    };
}
