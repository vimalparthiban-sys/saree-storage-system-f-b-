package com.appzys.ecommerce.controller;

import com.appzys.ecommerce.dto.ApiResponse;
import com.appzys.ecommerce.dto.CreateReviewRequest;
import com.appzys.ecommerce.entity.Review;
import com.appzys.ecommerce.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/{productId}")
    public ApiResponse<Map<String, Object>> getReviews(
            @PathVariable String productId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<Review> reviewPage = reviewService.getPaginatedReviews(productId, page, size);
        return ApiResponse.success("Reviews fetched successfully", Map.of(
            "reviews", reviewPage.getContent(),
            "currentPage", page,
            "totalPages", reviewPage.getTotalPages(),
            "totalReviews", reviewPage.getTotalElements(),
            "pageSize", size
        ));
    }

    @PostMapping
    public ApiResponse<Review> createReview(@RequestBody CreateReviewRequest request) {
        Review saved = reviewService.addReview(request);
        return ApiResponse.success("Review submitted successfully", saved);
    }
}
