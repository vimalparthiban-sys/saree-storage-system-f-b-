package com.appzys.ecommerce.service;

import com.appzys.ecommerce.dto.CreateReviewRequest;
import com.appzys.ecommerce.entity.Review;
import com.appzys.ecommerce.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Page<Review> getPaginatedReviews(String productId, int page, int size) {
        int zeroBasedPage = Math.max(0, page - 1);
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, PageRequest.of(zeroBasedPage, size));
    }

    public List<Review> getAllReviews(String productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Review addReview(CreateReviewRequest req) {
        Review r = new Review(
            req.getProductId(),
            req.getName() != null && !req.getName().isBlank() ? req.getName() : "Verified Customer",
            req.getCity() != null && !req.getCity().isBlank() ? req.getCity() : "Tamil Nadu",
            req.getRating() != null ? req.getRating() : 5,
            "Just now",
            req.getTitle() != null && !req.getTitle().isBlank() ? req.getTitle() : "Great quality!",
            req.getComment(),
            true
        );
        return reviewRepository.save(r);
    }

    public long getReviewCount(String productId) {
        return reviewRepository.countByProductId(productId);
    }
}
