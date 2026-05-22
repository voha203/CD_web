package com.sneaker.backend.mapper;

import com.sneaker.backend.dto.review.ReviewDTO;
import com.sneaker.backend.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    // Tự động bốc username từ entity User lồng bên trong Review
    @Mapping(source = "user.username", target = "username")
    ReviewDTO toDTO(Review review);
}