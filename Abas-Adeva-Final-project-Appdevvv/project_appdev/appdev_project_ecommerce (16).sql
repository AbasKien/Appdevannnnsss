-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 07, 2024 at 08:44 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appdev_project_ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','ship','delivered','cancelled','complete') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `contact_number`, `address`, `payment_method`, `total_price`, `status`, `created_at`) VALUES
(1, 1, '09878768768', 'ilaya calapan city', 'cod', 350.00, 'complete', '2024-12-03 13:50:45'),
(2, 1, '09878768768', 'ilaya calapan city', 'cod', 189.00, 'cancelled', '2024-12-03 13:53:10'),
(3, 1, '09878768768', 'ilaya calapan city', 'cod', 93.00, 'complete', '2024-12-03 13:53:31'),
(4, 1, '09878768768', 'ilaya calapan city', 'cod', 78.00, 'complete', '2024-12-03 14:08:55'),
(5, 1, '09878768768', 'ilaya calapan city', 'cod', 78.00, 'complete', '2024-12-03 15:02:07'),
(6, 1, '09878768768', 'ilaya calapan city', 'cod', 224.00, 'complete', '2024-12-03 15:29:00'),
(7, 1, '09878768768', 'ilaya calapan city', 'cod', 78.00, 'complete', '2024-12-03 17:22:39'),
(8, 1, '09878768768', 'ilaya calapan city', 'cod', 118.00, 'complete', '2024-12-07 14:03:35'),
(9, 1, '09878768768', 'ilaya calapan city', 'cod', 78.00, 'pending', '2024-12-07 14:22:26'),
(10, 1, '09878768768', 'ilaya calapan city', 'cod', 118.00, 'pending', '2024-12-07 14:23:09'),
(11, 1, '09878768768', 'ilaya calapan city', 'cod', 189.00, 'complete', '2024-12-07 15:06:23'),
(12, 1, '09878768768', 'ilaya calapan city', 'cod', 78.00, 'pending', '2024-12-07 16:13:00'),
(13, 1, '09878768768', 'ilaya calapan city', 'cod', 73.00, 'cancelled', '2024-12-07 19:19:35'),
(14, 1, '09878768768', 'ilaya calapan city', 'cod', 278.00, 'complete', '2024-12-07 19:27:31');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 2, 15.00),
(2, 1, 2, 2, 20.00),
(3, 1, 3, 2, 111.00),
(4, 2, 2, 1, 20.00),
(5, 2, 3, 1, 111.00),
(6, 3, 1, 1, 15.00),
(7, 3, 2, 1, 20.00),
(8, 4, 2, 1, 20.00),
(9, 5, 2, 1, 20.00),
(10, 6, 1, 1, 15.00),
(11, 6, 2, 2, 20.00),
(12, 6, 3, 1, 111.00),
(13, 7, 2, 1, 20.00),
(14, 8, 2, 3, 20.00),
(15, 9, 2, 1, 20.00),
(16, 10, 2, 3, 20.00),
(17, 11, 2, 1, 20.00),
(18, 11, 3, 1, 111.00),
(19, 12, 2, 1, 20.00),
(20, 13, 1, 1, 15.00),
(21, 14, 4, 10, 22.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `stock` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image_url`, `stock`, `created_at`) VALUES
(1, 'Pencil', 'For writing', 15.00, '/uploads/1733058441762-pencil.jpg', 151, '2024-12-01 13:07:21'),
(2, 'folder', 'a', 20.00, '/uploads/1733147080569-folder.jpg', 180, '2024-12-02 13:44:40'),
(3, 'Chalk', 'd', 111.00, '/uploads/1733221687898-chalk.jpg', 105, '2024-12-03 10:28:07'),
(4, 'a', 's', 22.00, '/uploads/1733586328524-Gtech.jpg', 101, '2024-12-07 15:45:28'),
(5, 'Envelop', 's', 20.00, '/uploads/1733599834336-envelop.jpg', 101, '2024-12-07 19:30:34');

-- --------------------------------------------------------

--
-- Table structure for table `product_quantity_logs`
--

CREATE TABLE `product_quantity_logs` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `previous_quantity` int NOT NULL,
  `quantity_changed` int NOT NULL,
  `new_quantity` int NOT NULL,
  `reason` enum('Restock','Order','Return') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_quantity_logs`
--

INSERT INTO `product_quantity_logs` (`id`, `product_id`, `previous_quantity`, `quantity_changed`, `new_quantity`, `reason`, `created_at`) VALUES
(29, 2, 0, 222, 222, 'Restock', '2024-12-02 13:44:50'),
(30, 1, 94, 21, 115, 'Restock', '2024-12-02 18:56:50'),
(31, 1, 115, 1, 116, 'Restock', '2024-12-02 19:06:36'),
(32, 1, 116, 4, 120, 'Restock', '2024-12-03 06:09:35'),
(33, 3, 0, 111, 111, 'Restock', '2024-12-03 10:28:23'),
(34, 1, 111, 2, 113, 'Restock', '2024-12-04 02:46:51'),
(35, 1, 113, 22, 135, 'Restock', '2024-12-07 14:10:23'),
(36, 2, 180, -1, 179, 'Order', '2024-12-07 15:06:23'),
(37, 3, 106, -1, 105, 'Order', '2024-12-07 15:06:23'),
(38, 1, 135, 10, 145, 'Restock', '2024-12-07 15:09:39'),
(39, 4, 0, 111, 111, 'Restock', '2024-12-07 15:45:40'),
(40, 5, 0, 100, 100, 'Restock', '2024-12-07 19:30:44'),
(41, 5, 100, 1, 101, 'Restock', '2024-12-07 19:31:03'),
(42, 1, 145, 1, 146, 'Restock', '2024-12-07 19:34:42'),
(43, 1, 146, 4, 150, 'Restock', '2024-12-07 19:36:53'),
(44, 2, 178, 2, 180, 'Restock', '2024-12-07 19:37:07'),
(45, 1, 150, 1, 151, 'Restock', '2024-12-07 19:39:44');

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `user_id`, `fullname`, `email`, `phone`, `address`, `created_at`, `updated_at`) VALUES
(1, 1, 'Kien Eros M. Abas', 'abaskien@gmail.com', '09878768768', 'ilaya calapan city', '2024-12-01 12:56:54', '2024-12-01 18:43:32'),
(2, 2, 'Admin', 'med696200@gmail.com', NULL, NULL, '2024-12-01 12:59:26', '2024-12-01 12:59:26');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('iqs7FP4JGZxFp_xZMHFZL7-yeBfFOGdO', 1733688841, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2024-12-08T20:13:55.299Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":1,\"role\":\"client\",\"email\":\"abaskien@gmail.com\"}');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` enum('admin','client') NOT NULL DEFAULT 'client'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `verification_token`, `is_verified`, `created_at`, `updated_at`, `role`) VALUES
(1, 'Kien Eros M. Abas', 'abaskien@gmail.com', '$2b$10$T/m4.mauwMNrLHvKLCsRoe0HHnjLx8i1vEyOe1tI5q2OJ2M4o4YWy', '5d790d223d00946014a98fd34194bb18a1d7d52b128ec742f78a394e795deb66', 1, '2024-12-01 12:56:54', '2024-12-01 12:57:10', 'client'),
(2, 'Admin', 'med696200@gmail.com', '$2b$10$xv5Nxg4SKgXJTJ/NEbuBDurq997i1muN/2EgWD0pxJq/NEdQY2ewO', '7f6ae0c04b11ec3eb34a9971297b45857d1f07d3d9479ea1d6c6fbd65d623fd4', 1, '2024-12-01 12:59:26', '2024-12-01 13:00:12', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_quantity_logs`
--
ALTER TABLE `product_quantity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_quantity_logs`
--
ALTER TABLE `product_quantity_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `product_quantity_logs`
--
ALTER TABLE `product_quantity_logs`
  ADD CONSTRAINT `product_quantity_logs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
