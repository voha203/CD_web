package com.sneaker.backend.dto.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminCategoryResponse {
    private Long id;
    private String name;
    private String code;
    private Boolean active;
    private Long productCount;
}
