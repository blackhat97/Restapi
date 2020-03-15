USE `main`;

-- Category 초기화
-- 시 단위
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (1, 0, '서울시', 1);
-- 구 단위 : 서울시 소속
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (2, 1, '강남구', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (3, 1, '서초구', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (4, 1, '송파구', 1);
-- 동 단위 : 강남구 소속
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (5, 2, '신사동', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (6, 2, '논현동', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (7, 2, '청담동', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (8, 2, '삼성동', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (9, 2, '대치동', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (10, 2, '개포동', 1);
-- 동 단위 : 서초구 소속
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (11, 3, '서초동', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (12, 3, '반포동', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (13, 3, '방배동', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (14, 3, '양재동', 1);
-- 동 단위 : 송파구 소속
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (15, 4, '잠실동', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (16, 4, '마천동', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (17, 4, '오금동', 1);
INSERT INTO `main`.`category` (`id`, `parent_id`, `name`, `type`) VALUES (18, 4, '가락동', 1);


-- Comments 초기화
INSERT INTO `main`.`comments` (`id`, `user_id`, `parent_id`, `content`, `timestamp`, `likes`, `dislikes`) VALUES (1, 1, 0, 'Comment 1', 1573484968690, 2, 3);
INSERT INTO `main`.`comments` (`id`, `user_id`, `parent_id`, `content`, `timestamp`, `likes`, `dislikes`) VALUES (2, 2, 1, 'Comment 1 > 1', 1573484969690, 5, 1);
INSERT INTO `main`.`comments` (`id`, `user_id`, `parent_id`, `content`, `timestamp`, `likes`, `dislikes`) VALUES (3, 3, 1, 'Comment 1 > 2', 1573485969690, 0, 0);
INSERT INTO `main`.`comments` (`id`, `user_id`, `parent_id`, `content`, `timestamp`, `likes`, `dislikes`) VALUES (4, 4, 3, 'Comment 1 > 2 > 1', 1573485969690, 1, 0);
INSERT INTO `main`.`comments` (`id`, `user_id`, `parent_id`, `content`, `timestamp`, `likes`, `dislikes`) VALUES (5, 4, 3, 'Comment 1 > 2 > 2', 1573485969690, 1, 0);

INSERT INTO `main`.`comments` (`id`, `user_id`, `parent_id`, `content`, `timestamp`, `likes`, `dislikes`) VALUES (6, 1, 0, 'Comment 2', 1573484968690, 2, 3);
INSERT INTO `main`.`comments` (`id`, `user_id`, `parent_id`, `content`, `timestamp`, `likes`, `dislikes`) VALUES (7, 2, 6, 'Comment 2 > 1', 1573484969690, 5, 1);
INSERT INTO `main`.`comments` (`id`, `user_id`, `parent_id`, `content`, `timestamp`, `likes`, `dislikes`) VALUES (8, 3, 6, 'Comment 2 > 2', 1573485969690, 0, 0);
INSERT INTO `main`.`comments` (`id`, `user_id`, `parent_id`, `content`, `timestamp`, `likes`, `dislikes`) VALUES (9, 4, 8, 'Comment 2 > 2 > 1', 1573485969690, 1, 0);
INSERT INTO `main`.`comments` (`id`, `user_id`, `parent_id`, `content`, `timestamp`, `likes`, `dislikes`) VALUES (10, 4, 8, 'Comment 2 > 2 > 2', 1573485969690, 1, 0);
INSERT INTO `main`.`comments` (`id`, `user_id`, `parent_id`, `content`, `timestamp`, `likes`, `dislikes`) VALUES (11, 4, 10, 'Comment 2 > 2 > 2 > 1', 1573485969690, 1, 0);
