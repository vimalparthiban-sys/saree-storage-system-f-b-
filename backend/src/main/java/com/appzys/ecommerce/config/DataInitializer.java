package com.appzys.ecommerce.config;

import com.appzys.ecommerce.entity.*;
import com.appzys.ecommerce.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(
            ProductRepository productRepository,
            ReviewRepository reviewRepository,
            OrderRepository orderRepository
    ) {
        return args -> {
            // 1. Initialize Products if not present
            if (productRepository.count() == 0) {
                // Product 1: Saree Organiser
                Product saree = new Product(
                    "saree-organiser",
                    "Wardrobe Organizers",
                    "60L Saree Organiser | Stainless Steel Frame Foldable Living Box (50 x 40 x 30 cm)",
                    "60L Saree Organiser | Stainless Steel Frame Foldable Living Box",
                    "Wardrobe Organizers",
                    4.9,
                    99,
                    499,
                    799,
                    "APPZYS® 60L Saree Organiser is engineered with a built-in heavy-duty stainless steel wire frame. Normal cloth bags sag and wrinkle your expensive silk sarees. This living box stands completely rigid, supports stacking up to 4 boxes, and has a front clear zipper window to pull any saree out effortlessly without unstacking!"
                );
                saree.getPacks().add(new ProductPack(1, "1", 499, 799, "Save ₹300", false, saree));
                saree.getPacks().add(new ProductPack(2, "2", 899, 1599, "Save ₹700", false, saree));
                saree.getPacks().add(new ProductPack(4, "4", 1599, 2999, "Save ₹1,400", true, saree));
                saree.getPacks().add(new ProductPack(6, "6", 2299, 4499, "Save ₹2,200", false, saree));
                productRepository.save(saree);

                // Product 2: Jewellery Organiser
                Product jewel = new Product(
                    "jewellery-organiser",
                    "Wardrobe Organizers",
                    "Luxury Portable Travel Jewellery Organiser | Dust & Scratch Proof Compartments",
                    "Luxury Portable Travel Jewellery Organiser | Dust & Scratch Proof Compartments",
                    "Wardrobe Organizers",
                    4.8,
                    65,
                    349,
                    599,
                    "Keep your precious gold, silver, and diamond jewellery safe, scratch-free, and untangled! Crafted with high-grade PU leather and lined with ultra-soft anti-tarnish velvet."
                );
                jewel.getPacks().add(new ProductPack(1, "1 Box", 349, 599, "Save ₹250", false, jewel));
                jewel.getPacks().add(new ProductPack(2, "Pack of 2", 599, 1199, "Save ₹600", true, jewel));
                productRepository.save(jewel);

                System.out.println("✅ Products & Packs initialized in Database!");
            }

            // 2. Initialize 99 Saree Reviews if empty
            if (reviewRepository.count() == 0) {
                String[] names = {
                    "Dr. Meenakshi Sundaram", "Kavitha Radhakrishnan", "Priya Sundaram", "Lakshmi Narayanan",
                    "Deepa Shankar", "Ananya Rao", "Meera Krishnan", "Sangeetha Balaji", "Revathi Raman",
                    "Soundarya S.", "Divya Ramesh", "Poornima R.", "Shanthi Venkatesh", "Jayashree M.",
                    "Radhika Iyer", "Archana N.", "Swetha G.", "Padma Srinivasan", "Uma Maheswari",
                    "Subashini K.", "Gayathri Natarajan", "Aparna Venkat", "Bhavani Chandran", "Nithya Sridhar",
                    "Karpagam R.", "Malarvizhi P.", "Vasanthi Murugan", "Hemalatha D.", "Suganya Mohan",
                    "Brinda Parthasarathy", "Yamuna Devi", "Kausalya R.", "Mythili Raghavan", "Preethi V.",
                    "Shobana Anand", "Sudha Ramachandran", "Geetha Sekar", "Pavithra Raj", "Chitra Varadarajan",
                    "Saranya B.", "Indira Ganesan", "Manjula K.", "Janaki S.", "Sowmya Narayan", "Lavanya K.",
                    "Gomathi T.", "Sandhya Menon", "Saraswathi A.", "Dhanalakshmi S.", "Rekha Kannan",
                    "Vijaya Lakshmi", "Harini S.", "Anitha Babu", "Bhuvaneshwari M.", "Vidhya Prakash",
                    "Kalpana S.", "Devi Priya", "Ranjani S.", "Pushpa R.", "Sathya Narayanan",
                    "Kamala Subramanian", "Akshaya R.", "Sindhuja V.", "Gita Nair", "Padmini S.",
                    "Rajalakshmi K.", "Karthika M.", "Anusuya D.", "Vasumathi R.", "Latha Sundar",
                    "Shylaja P.", "Kokila V.", "Rajeswari M.", "Sunitha B.", "Valliammai C.",
                    "Rupa Shankar", "Jayalakshmi R.", "Menaka S.", "Parvathi K.", "Roopa C.",
                    "Malathi K.", "Sumathi N.", "Devaki M.", "Vijayashree B.", "Sujatha R.",
                    "Alamelu S.", "Shalini K.", "Nalini V.", "Thenmozhi S.", "Kalaivani R.",
                    "Ponmani T.", "Aarthi S.", "Sharmila K.", "Nandhini R.", "Sridevi P.",
                    "Bala Tripura", "Gnanambal S.", "Amutha V.", "Vimala Devi"
                };

                String[] cities = {
                    "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu",
                    "Bangalore, Karnataka", "Trichy, Tamil Nadu", "Salem, Tamil Nadu",
                    "Hyderabad, Telangana", "Kanchipuram, Tamil Nadu", "Erode, Tamil Nadu",
                    "Tirunelveli, Tamil Nadu", "Vellore, Tamil Nadu", "Thanjavur, Tamil Nadu",
                    "Pondicherry", "Tiruppur, Tamil Nadu", "Mumbai, Maharashtra"
                };

                String[][] templates = {
                    {"Best wardrobe purchase this year! Front zip is genius.", "I have around 40 silk sarees and my Godrej cupboard was overflowing. The front transparent window is a lifesaver. I took out my muhurtham saree without disturbing the top sarees!"},
                    {"Very sturdy steel frame, not like cheap cloth covers.", "The steel rods are thick and rigid. I stacked 3 boxes on top of each other inside my almirah. Doubled my wardrobe space. Highly recommended!"},
                    {"Protects my expensive Kanjivaram pattu sarees.", "Living in coastal Chennai, moisture and silverfish were always a worry. This box seals tightly and keeps all my wedding silk sarees crisp and clean."},
                    {"Heavy-duty zippers and genuine 60L capacity.", "Was sceptical at first, but easily loaded 17 heavy sarees with bloused folds. The zipper glides like butter with zero snagging."},
                    {"Finally solved my cupboard clutter!", "Before this, pulling one saree meant 10 other sarees got crushed. Now with the front window, I slide out exactly what I need in 5 seconds."}
                };

                for (int i = 0; i < names.length; i++) {
                    String name = names[i];
                    String city = cities[i % cities.length];
                    String[] tmpl = templates[i % templates.length];
                    String date = (i < 3) ? "Just now" : (i / 5 + 1) + " days ago";
                    Review r = new Review("saree-organiser", name, city, 5, date, tmpl[0], tmpl[1], true);
                    reviewRepository.save(r);
                }

                System.out.println("✅ 99 Verified Customer Reviews seeded into Database!");
            }

            // 3. Initialize Demo Order if empty
            if (orderRepository.count() == 0) {
                Order order = new Order();
                order.setId("ORD-2026-9686");
                order.setCustomerName("Vimal P");
                order.setPhone("9840012345");
                order.setAddress("No. 12, Anna Nagar West, Chennai, Tamil Nadu - 600040");
                order.setTotalAmount(899);
                order.setPaymentMethod("UPI");
                order.setPaymentStatus("PAID");
                order.setStatus("CONFIRMED");
                order.setAwb("AWB-DEL-982140");
                order.setCourier("Delhivery Express");
                order.setCreatedAt(LocalDateTime.now());

                OrderItem item = new OrderItem(
                    "saree-organiser",
                    "APPZYS 60L Saree Organiser",
                    "Pack of 2 (Most Popular)",
                    "Classic Grey Diamond",
                    1,
                    899,
                    order
                );
                order.getItems().add(item);

                TrackingEvent event = new TrackingEvent(
                    "CONFIRMED",
                    "Order Confirmed & Payment Verified",
                    "10:30 AM, Today",
                    "APPZYS Central Online Gateway",
                    true,
                    order
                );
                order.getTrackingEvents().add(event);

                orderRepository.save(order);
                System.out.println("✅ Sample Orders & Live Tracking seeded into Database!");
            }
        };
    }
}
