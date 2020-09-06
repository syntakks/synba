-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema werkdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema werkdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `werkdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `werkdb` ;

-- -----------------------------------------------------
-- Table `werkdb`.`project`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `werkdb`.`project` (
  `projectID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`projectID`),
  UNIQUE INDEX `uc_Project_name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `werkdb`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `werkdb`.`role` (
  `roleID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`roleID`),
  UNIQUE INDEX `uc_Role_name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `werkdb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `werkdb`.`user` (
  `userID` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE INDEX `userID_UNIQUE` (`userID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `werkdb`.`project_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `werkdb`.`project_user` (
  `projectID` INT NOT NULL AUTO_INCREMENT,
  `roleID` INT NOT NULL,
  `userID` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`projectID`),
  INDEX `fk_ProjectUser_roleID` (`roleID` ASC) VISIBLE,
  INDEX `fk_projectuser_user1_idx` (`userID` ASC) VISIBLE,
  CONSTRAINT `fk_ProjectUser_projectID`
    FOREIGN KEY (`projectID`)
    REFERENCES `werkdb`.`project` (`projectID`),
  CONSTRAINT `fk_ProjectUser_roleID`
    FOREIGN KEY (`roleID`)
    REFERENCES `werkdb`.`role` (`roleID`),
  CONSTRAINT `fk_projectuser_user1`
    FOREIGN KEY (`userID`)
    REFERENCES `werkdb`.`user` (`userID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `werkdb`.`session`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `werkdb`.`session` (
  `sessionID` INT NOT NULL AUTO_INCREMENT,
  `projectID` INT NOT NULL,
  `start` DATETIME NOT NULL,
  `end` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`sessionID`),
  INDEX `fk_Session_projectID` (`projectID` ASC) VISIBLE,
  CONSTRAINT `fk_Session_projectID`
    FOREIGN KEY (`projectID`)
    REFERENCES `werkdb`.`project` (`projectID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
