import { useCallback, useEffect, useState } from "react";
import {
    canReviewProduct,
    getProductById,
    getProductReviewSummary,
    getProductReviews,
    submitProductReview
} from "../../services/api";
import { getApiErrorMessage } from "../../services/apiError";
import { isAuthenticated } from "../utils/auth";

export function useProductDetail(id) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ totalElements: 0, totalPages: 0 });
    const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, totalReviews: 0 });
    const [canReview, setCanReview] = useState({ canReview: false, message: "" });
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchReviews = useCallback(async (page = 0) => {
        try {
            const data = await getProductReviews(id, page);
            setReviews(data.content || []);
            setReviewStats({
                totalElements: data.totalElements || 0,
                totalPages: data.totalPages || 0
            });
        } catch (err) {
            console.error("Lỗi lấy đánh giá:", getApiErrorMessage(err));
        }
    }, [id]);

    const refreshReviewMeta = useCallback(async () => {
        try {
            const summary = await getProductReviewSummary(id);
            setReviewSummary(summary || { averageRating: 0, totalReviews: 0 });
        } catch (err) {
            console.error("Lỗi lấy tổng quan đánh giá:", getApiErrorMessage(err));
        }

        if (!isAuthenticated()) {
            setCanReview({ canReview: false, message: "Đăng nhập và mua sản phẩm để đánh giá." });
            return;
        }

        try {
            setCanReview(await canReviewProduct(id));
        } catch (err) {
            setCanReview({ canReview: false, message: getApiErrorMessage(err, "Không thể kiểm tra quyền đánh giá.") });
        }
    }, [id]);

    useEffect(() => {
        fetchReviews(currentPage);
        refreshReviewMeta();
    }, [currentPage, fetchReviews, refreshReviewMeta]);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");

        getProductById(id)
            .then(data => {
                if (!active) return;
                setProduct(data);
            })
            .catch(err => {
                if (active) setError(getApiErrorMessage(err, "Không thể tải chi tiết sản phẩm."));
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    const addReview = async (newReviewData) => {
        if (newReviewData.comment.trim() === "") {
            alert("Vui lòng nhập nội dung đánh giá.");
            return false;
        }

        setIsSubmitting(true);
        try {
            await submitProductReview(id, newReviewData);
            alert("Đánh giá thành công.");

            if (currentPage === 0) {
                await fetchReviews(0);
            } else {
                setCurrentPage(0);
            }
            await refreshReviewMeta();
            return true;
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
        reviewSummary,
        canReview,
        currentPage,
        setCurrentPage,
        isSubmitting,
        addReview,
        refreshReviewMeta
    };
}
