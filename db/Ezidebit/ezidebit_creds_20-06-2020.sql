-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 20, 2020 at 09:25 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.1.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rentronics_prod`
--

-- --------------------------------------------------------

--
-- Table structure for table `ezidebit_creds`
--

CREATE TABLE `ezidebit_creds` (
  `id` int(11) NOT NULL,
  `franchise_id` int(11) NOT NULL,
  `public_key` blob NOT NULL,
  `digital_key` blob NOT NULL,
  `user_name` blob NOT NULL,
  `client_id` blob NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ezidebit_creds`
--

INSERT INTO `ezidebit_creds` (`id`, `franchise_id`, `public_key`, `digital_key`, `user_name`, `client_id`, `is_active`, `created_at`) VALUES
(1, 1, '', 0x7ca582558289eb14a3a9da559662eb2c2f35e8e88e703258e8ac81e7b49d4acefcbe2cb6d51781a93276180c0f339993, 0x68156b560d8ebe85dde9fba8ee8a6b254eb39b4c517c0fef5a5ac18475c8bcf0, 0xe6545af42c03a2dcdf9a9b722e2ced95, 1, '2020-06-19 12:37:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ezidebit_creds`
--
ALTER TABLE `ezidebit_creds`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ezidebit_creds`
--
ALTER TABLE `ezidebit_creds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
