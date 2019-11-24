CREATE TABLE `scheduler` ( 
  `id` INT(11) NOT NULL, 
  `type` INT(11) NOT NULL,
  `customer_id` INT(11) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

ALTER TABLE `scheduler`
ADD PRIMARY KEY (`id`);

ALTER TABLE `scheduler` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;