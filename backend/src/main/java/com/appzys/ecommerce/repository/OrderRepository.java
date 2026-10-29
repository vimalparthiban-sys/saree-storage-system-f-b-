package com.appzys.ecommerce.repository;

import com.appzys.ecommerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Optional<Order> findByAwb(String awb);
    List<Order> findByPhoneOrderByCreatedAtDesc(String phone);
    List<Order> findAllByOrderByCreatedAtDesc();
}
