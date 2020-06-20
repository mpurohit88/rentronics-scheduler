-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 20, 2020 at 09:29 AM
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
-- Database: `rentronics_prod_auso`
--

-- --------------------------------------------------------

--
-- Table structure for table `ezidebit_payments`
--

CREATE TABLE `ezidebit_payments` (
  `id` int(11) NOT NULL,
  `bankFailedReason` text,
  `bankReceiptID` varchar(50) DEFAULT NULL,
  `bankReturnCode` varchar(20) DEFAULT NULL,
  `customerName` varchar(100) DEFAULT NULL,
  `debitDate` datetime DEFAULT NULL,
  `eziDebitCustomerID` varchar(20) DEFAULT NULL,
  `invoiceID` varchar(20) DEFAULT NULL,
  `paymentAmount` double DEFAULT NULL,
  `paymentID` varchar(20) DEFAULT NULL,
  `paymentMethod` varchar(20) DEFAULT NULL,
  `paymentReference` varchar(50) DEFAULT NULL,
  `paymentSource` varchar(20) DEFAULT NULL,
  `paymentStatus` varchar(20) DEFAULT NULL,
  `settlementDate` datetime DEFAULT NULL,
  `scheduledAmount` double DEFAULT NULL,
  `transactionFeeClient` double DEFAULT NULL,
  `transactionFeeCustomer` double DEFAULT NULL,
  `yourGeneralReference` varchar(50) DEFAULT NULL,
  `yourSystemReference` varchar(50) DEFAULT NULL,
  `is_active` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ezidebit_payments`
--
ALTER TABLE `ezidebit_payments`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ezidebit_payments`
--
ALTER TABLE `ezidebit_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
