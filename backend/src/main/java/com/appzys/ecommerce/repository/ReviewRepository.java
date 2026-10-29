package com.appzys.ecommerce.repository;

import com.appzys.ecommerce.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProductIdOrderByCreatedAtDesc(String productId, Pageable pageable);
    List<Review> findByProductIdOrderByCreatedAtDesc(String productId);
    long countByProductId(String productId);
}
