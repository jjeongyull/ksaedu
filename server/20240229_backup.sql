-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- 생성 시간: 24-02-29 18:52
-- 서버 버전: 5.7.31
-- PHP 버전: 7.2.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `ksaedu`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `class_info`
--

CREATE TABLE `class_info` (
  `idx` int(11) NOT NULL,
  `class_name_ko` varchar(100) NOT NULL COMMENT '교육 과정명(한국어)',
  `class_name_ch` varchar(100) NOT NULL COMMENT '교육 과정명(중국어)',
  `class_name_en` varchar(100) NOT NULL COMMENT '교육 과정명(영어)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `class_info`
--

INSERT INTO `class_info` (`idx`, `class_name_ko`, `class_name_ch`, `class_name_en`) VALUES
(1, '품질관리담당자 정기교육', '质量管理负责人定期培训', 'Regular training for quality control managers'),
(2, '품질관리담당자 양성교육', '质量管理负责人资格培训', 'Quality Control Manager\'s Training Program'),
(3, '경영간부를 위한 품질경영', '经营干部质量管理培训', 'Quality Management Training for Executives');

-- --------------------------------------------------------

--
-- 테이블 구조 `class_time`
--

CREATE TABLE `class_time` (
  `idx` int(11) NOT NULL,
  `class_idx` int(11) NOT NULL COMMENT 'class_name의 idx',
  `class_time` varchar(100) NOT NULL COMMENT '교육 시간, 입력예시 : 2024.01.01 ~ 2024.01.15',
  `class_lang` char(2) NOT NULL COMMENT '국가코드, ch, en 등',
  `class_max_count` int(11) NOT NULL DEFAULT '40'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `class_time`
--

INSERT INTO `class_time` (`idx`, `class_idx`, `class_time`, `class_lang`, `class_max_count`) VALUES
(3, 1, '2024.04.17 ~ 2024.04.19', 'en', 40),
(4, 1, '2024.06.26 ~ 2024.06.28', 'en', 40),
(5, 1, '2024.02.26 ~ 2024.04.25', 'ch', 40),
(10, 2, '2024.05.06 ~ 2024.05.24', 'ch', 40),
(11, 3, '2024.03.26 ~ 2024.03.28', 'ch', 40),
(12, 3, '2024.06.25 ~ 2024.06.27', 'ch', 40),
(13, 3, '2024.04.15 ~ 2024.04.17', 'en', 40),
(14, 3, '2024.07.02 ~ 2024.07.04', 'en', 40),
(15, 3, '2024.10.29 ~ 2024.10.31', 'en', 40),
(16, 2, '2024.03.15 ~ 2024.04.15', 'en', 40),
(17, 2, '2024.04.15 ~ 2024.05.14', 'en', 40),
(18, 2, '2024.05.16 ~ 2024.06.14', 'en', 40),
(19, 2, '2024.06.14 ~ 2024.07.15', 'en', 40),
(20, 2, '2024.07.15 ~ 2024.08.14', 'en', 40),
(21, 2, '2024.08.16 ~ 2024.09.19', 'en', 40),
(22, 2, '2024.09.12 ~ 2024.10.14', 'en', 40),
(23, 2, '2024.10.15 ~ 2024.11.14', 'en', 40),
(24, 2, '2024.11.15 ~ 2024.12.16', 'en', 40),
(25, 2, '2024.12.16 ~ 2025.01.15', 'en', 40),
(26, 2, '2024.02.29 ~ 2024.02.28', 'en', 1111);

-- --------------------------------------------------------

--
-- 테이블 구조 `log_download`
--

CREATE TABLE `log_download` (
  `idx` int(11) NOT NULL,
  `manager_id` varchar(50) NOT NULL COMMENT '다운로드 한 관리자 아이디',
  `download_filename` varchar(100) NOT NULL COMMENT '다운로드 한 파일명',
  `download_date` datetime NOT NULL COMMENT '다운로드한 날짜',
  `sql_data` varchar(500) NOT NULL COMMENT '실제 수행한 쿼리문'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `log_download`
--

INSERT INTO `log_download` (`idx`, `manager_id`, `download_filename`, `download_date`, `sql_data`) VALUES
(1, 'admin', '교육신청현황.xls', '2024-02-29 11:15:56', 'INSERT INTO log_download (manager_id, download_filename, 	download_date, sql_data) VALUES (:manager_id, :download_filename, now(), :sql_data)');

-- --------------------------------------------------------

--
-- 테이블 구조 `manager`
--

CREATE TABLE `manager` (
  `idx` int(11) NOT NULL,
  `manager_id` varchar(50) NOT NULL,
  `manager_password` varchar(100) NOT NULL,
  `manager_name` varchar(50) NOT NULL,
  `mem_level` int(11) NOT NULL,
  `mem_login_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `manager`
--

INSERT INTO `manager` (`idx`, `manager_id`, `manager_password`, `manager_name`, `mem_level`, `mem_login_date`) VALUES
(1, 'admin', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', '관리자', 5, '2024-02-28 20:02:52'),
(5, 'test', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'test', 1, '2024-02-28 20:01:07');

-- --------------------------------------------------------

--
-- 테이블 구조 `subs_class`
--

CREATE TABLE `subs_class` (
  `idx` int(11) NOT NULL,
  `class_idx` int(10) NOT NULL COMMENT '교육과정 구분 코드 (class_name의 idx)',
  `subs_class_time_idx` int(11) NOT NULL,
  `subs_user_email` varchar(100) NOT NULL COMMENT '신청자 이메일(암호화 필요)',
  `subs_user_password` varchar(100) NOT NULL COMMENT '신청자 비밀번호(암호화 필요)',
  `subs_user_name_en` varchar(255) NOT NULL COMMENT '신청자 영문이름',
  `subs_user_name_ch` varchar(255) DEFAULT NULL COMMENT '사용자 중문이름(영문신청시 입력안해도 됨)',
  `subs_company_position` varchar(255) NOT NULL COMMENT '직위',
  `subs_sex` int(11) NOT NULL COMMENT '신청자 성별(0이면 남자, 1이면 여)',
  `subs_identity_number` varchar(500) NOT NULL COMMENT '신청자 주민번호 및 신분번호(암호화필요)',
  `subs_phone_number` varchar(255) NOT NULL COMMENT '신청자 휴대폰 번호(암호화 필요)',
  `subs_company_name_ch` text COMMENT '중문 업체명(영문신청일때 작성할 필요 없음)',
  `subs_company_name_en` text NOT NULL COMMENT '영문 업체명',
  `subs_company_address_ch` text COMMENT '중문 공장주소(영문신청시 작성 안해도 됨)',
  `subs_company_address_en` text NOT NULL COMMENT '영문 공장주소',
  `subs_agent_name` varchar(255) DEFAULT NULL COMMENT '에이전트이름(에이전트를 끼고 신청할 시에만 작성)',
  `subs_agent_manager` varchar(255) DEFAULT NULL COMMENT '에이전트 담당자 이름(에이전트를 끼고 신청시에만 작성)',
  `subs_agent_phone_number` varchar(100) DEFAULT NULL COMMENT '에이전트 담당자 전화번호(에이전트를 끼고 신청시 입력)',
  `subs_agent_email` varchar(255) DEFAULT NULL COMMENT '에이전트 이메일(에이전트를 끼고 신청시 필요)',
  `subs_depositor_name` varchar(255) NOT NULL COMMENT '입금자명',
  `subs_currency` char(50) NOT NULL COMMENT '송금통화',
  `subs_user_payment` char(1) NOT NULL DEFAULT '0' COMMENT '납입할 경우 1, 교육신청시 기본값 0',
  `subs_country` char(2) NOT NULL COMMENT '중국신청(ch), 영어신청(en)',
  `subs_payment_date` datetime DEFAULT NULL COMMENT '관리자가 납입을 체크를 확인한 날짜(user_payment가 1일 때 타임스탬프 자동 기록)',
  `subs_date` varchar(30) NOT NULL COMMENT '교육 신청일 (class_time에 등록된 교육 날짜)',
  `subs_deposit_date` date DEFAULT NULL COMMENT '입금일자',
  `subs_remittance_amount` int(100) DEFAULT NULL COMMENT '송금액',
  `subs_take` int(100) DEFAULT NULL COMMENT '매출액',
  `subs_briefs` varchar(255) DEFAULT NULL COMMENT '적요',
  `subs_slip_number` varchar(255) DEFAULT NULL COMMENT '선수 전표번호',
  `subs_bill` varchar(255) DEFAULT NULL COMMENT '계산서구분',
  `subs_sales_slip` varchar(255) DEFAULT NULL COMMENT '매출전표',
  `subs_payment_manager_id` varchar(100) DEFAULT NULL COMMENT '납입확인을 한 관리자 아이디',
  `subs_type` char(1) NOT NULL DEFAULT '' COMMENT '대기상태로 신청 시 1 : 신청 시 class_max_usercount 값을 초과했을 경우 대기 상태(1)로 입력',
  `subs_delete` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `subs_class`
--

INSERT INTO `subs_class` (`idx`, `class_idx`, `subs_class_time_idx`, `subs_user_email`, `subs_user_password`, `subs_user_name_en`, `subs_user_name_ch`, `subs_company_position`, `subs_sex`, `subs_identity_number`, `subs_phone_number`, `subs_company_name_ch`, `subs_company_name_en`, `subs_company_address_ch`, `subs_company_address_en`, `subs_agent_name`, `subs_agent_manager`, `subs_agent_phone_number`, `subs_agent_email`, `subs_depositor_name`, `subs_currency`, `subs_user_payment`, `subs_country`, `subs_payment_date`, `subs_date`, `subs_deposit_date`, `subs_remittance_amount`, `subs_take`, `subs_briefs`, `subs_slip_number`, `subs_bill`, `subs_sales_slip`, `subs_payment_manager_id`, `subs_type`, `subs_delete`) VALUES
(1, 1, 1, 'MmdQbUFIUFNPc2hEeWlYMEdBNHJyUDBncm50cUpndDJrRE4rbjB0Nk44QT0=', '5231a29af7d162829df80b940184c0c290cbb8c2f5f870c523def3a30bc28935', '2', '1', '3', 0, 'Nmo4YnBFcXpCM0MxNkR3MkNabEFFQT09', 'Nmo4YnBFcXpCM0MxNkR3MkNabEFFQT09', '11', '22', '33', '44', '55', '66', '77', '88', 'dfsfds', 'KRW', '0', 'ch', NULL, '2024-02-26 05:43:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', 1),
(2, 1, 2, 'VDI4Y0poODhIbEU1Vzg1SWc4Rm9MemhSU1h3SWFoZjhTa1hwUFFZOUxEUT0=', 'c9dbe0f6c6c933e3157fb2edde98954741cffc2aae25b3eded2797d20a779f0a', 'gfdgfd', 'fdgdf', 'gfdf', 0, 'QS9wWG5jWm5rVjVHQXFMa1V5ZjlnUT09', 'KzdvTlQ0TmhRQXNrRkQ2MWM3cU5RQT09', 'sads', 'dasdsad', 'da', 'asdas', '', '', '', '', 'fsdfsd', 'KRW', '0', 'ch', NULL, '2024-02-26 18:41:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', 1),
(3, 1, 2, 'OUhyc2NkZmFoZHFGOUlDN25uZVFaZz09', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', 'asdsa', 'sads', 'dsad', 0, 'OGNQR3A2b0dJeEJFK0VVK1FPNkhmZz09', 'aHhEY01ONWJhRnQ2bm9nRld2YmFjdz09', 'dasd', 'asd', 'asda', 'asdas', '', '', '', '', 'asfasf', 'KRW', '0', 'ch', NULL, '2024-02-26 19:30:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', 1),
(4, 1, 2, 'OUhyc2NkZmFoZHFGOUlDN25uZVFaZz09', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', 'gfhgf', 'gbf', 'gfhg', 0, 'Y0I2NkFBdzlTZEJEaTNtajBzQUFMQT09', 'eUphc1U1dWt0WnhLck85WWVFdlVkQT09', 'jk', 'jkjl', 'kjl', 'jkl', '', '', '', '', 'dawdas', 'KRW', '0', 'ch', NULL, '2024-02-26 19:33:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', 1),
(5, 1, 5, 'RmFwSTErMDI3a2R4Yy9LVHhGQ2VaZz09', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'dsfsdf', 'dfds', 'dsf', 1, 'cWlINnBCbGRIOHZLYXUvVDEwd3FUdz09', 'bjQ2aFRyTWp1TnRvZFRPek1rSmo4dz09', 'dfssd', 'fsdfsdf', 'sdfsdf', 'sdf', '', '', '', '', 'sadadas', 'USD', '0', 'ch', NULL, '2024-02-27 12:56:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', 1),
(6, 1, 5, 'RmFwSTErMDI3a2R4Yy9LVHhGQ2VaZz09', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'dsfsdf', 'dfds', 'dsf', 1, 'cWlINnBCbGRIOHZLYXUvVDEwd3FUdz09', 'bjQ2aFRyTWp1TnRvZFRPek1rSmo4dz09', 'dfssd', 'fsdfsdf', 'sdfsdf', 'sdf', '', '', '', '', 'sadadas', 'USD', '1', 'ch', '2024-02-28 10:58:33', '2024-02-27 12:57:23', '2024-02-28', 75757, 577, 'dfgdgfd', 'dfgdfg', 'dfgdfgfdgdf', 'dfgdfgd', 'admin', '0', 0),
(7, 1, 5, 'RmFwSTErMDI3a2R4Yy9LVHhGQ2VaZz09', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'dsfsdf', 'dfds', 'dsf', 1, 'cWlINnBCbGRIOHZLYXUvVDEwd3FUdz09', 'bjQ2aFRyTWp1TnRvZFRPek1rSmo4dz09', 'dfssd', 'fsdfsdf', 'sdfsdf', 'sdf', '', '', '', '', 'sadadas', 'USD', '0', 'ch', NULL, '2024-02-27 12:59:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', 0),
(8, 1, 2, 'RmFwSTErMDI3a2R4Yy9LVHhGQ2VaZz09', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'dfds', 'dfds', 'fdsfsd', 1, 'RlVaQVpDNE1IdVhoR1o2cjRMZzNYUT09', 'cDRnVGVmN2ZMd0FHejJ2UVZDOVB2QT09', 'sadas', 'dsadsad', 'asda', 'dsad', '', '', '', '', 'asdasd', 'USD', '1', 'ch', '2024-02-27 19:47:58', '2024-02-27 13:02:33', '2024-02-15', 542452542, 452524, 'hfgh', 'fhfghfg', 'hgfhgfhgf', 'gfhfgh', 'admin', '1', 1),
(9, 3, 10, 'Qjkvd3N4cVJYN0VyK3B4ZWFhYzkxQT09', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'sdfsdf', 'fsdfgdsf', 'fdsfsd', 0, 'R0dwazdqbk9walF2UURGR1FYM2pDZz09', 'YWhWa3NiSlB2ZmtGSXA5ZWMrVC9DUT09', 'kjhkhj', 'kjhkhjk', 'jhkhj', 'jhkh', '', '', '', '', 'khjjk', 'USD', '0', 'ch', NULL, '2024-02-27 23:55:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', 0),
(10, 3, 10, 'U2V6ZEk4OTdpaDZDYU5nbmxPSmhSZz09', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'fsdfsd', 'dfds', 'sfsdf', 0, 'V0k5SDdac3UyaU9hMWp6cmpKNzhaZz09', 'ZXFTS0VxQ0RzRXpIWTluMUFaUVBtdz09', 'hgfhfgh', 'hfghgh', 'gfhfgh', 'gfhfgh', '', '', '', '', 'gfhgf', 'CNY', '0', 'ch', NULL, '2024-02-28 00:03:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', 0),
(11, 3, 10, 'TlM1ZisxbDYrRFYvVUlEa3VHQktEUT09', 'cdad86ca9450d1c143675a8436131cabaf55905c114fa4524bf6a9ec5662cad7', 'fdfd', 'fdgfdg', 'fdgdfg', 0, 'UXN6YnRuVGJ4NmxJSXJHNWRNdm5udz09', 'eFU2RmVmUWRBcHg1WTcvYVU5R3V5QT09', 'rwere', 'ewrewr', 'ewrewrwe', 'erwrw', '', '', '', '', 'dfgd', 'USD', '0', 'ch', NULL, '2024-02-28 00:08:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', 0),
(12, 3, 10, 'VmVRbGl2cXFnY1QxMTF4TWIzWW5wZz09', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', '1', '1', '1', 0, 'VmVRbGl2cXFnY1QxMTF4TWIzWW5wZz09', 'VmVRbGl2cXFnY1QxMTF4TWIzWW5wZz09', '1', '1', '1', '1', '', '', '', '', '1', 'KRW', '0', 'ch', NULL, '2024-02-28 00:11:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', 0),
(13, 1, 5, 'ejhSWWxWVFpoakZnL1RVUElBNlZZazFwTFNWZzZNc04vU3dnNlRjb0o1QT0=', '572698bcd5e685b27739bc66943d66a2ebc8eec7afdd108b692c77a76e6fb4e4', '중국이름', '중국이름', '중국직위', 0, 'bG9MQldoRWlYVjJPMnplWk1mVFovdz09', 'dktMYm9TdVpjTi9seVE3a0gxWG4wR3NxRjZkQTd2RHVwdWxLMml0M2JxVT0=', '업체명중문', '업체명영문', '주소중문', '주소영문', '에이전트', '에이전트담당자', '00000000000000000000000000', 'agent@additcorp.cpmk', '입금자명', 'USD', '0', 'ch', NULL, '2024-02-28 16:00:33', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', 0),
(14, 1, 5, 'aFpSNVl4bFVMVlBuUXdwQ253aEdUQUo4UWpDSDhhQU5aYlJtY1BCQWFIVT0=', 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae', '2', '1', '3', 0, 'VmVRbGl2cXFnY1QxMTF4TWIzWW5wZz09', 'VmVRbGl2cXFnY1QxMTF4TWIzWW5wZz09', '2', '2', '2', '2', '2', '2', '2', '2', '111', 'KRW', '0', 'ch', NULL, '2024-02-28 16:34:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', 0),
(15, 1, 3, 'b2p5clQ2Z1ByODJiZTdnMTd2QWJYQT09', '4cd630653deb7d3f1c35f52f9991724b33cc65f0ee710577e74cdcb0e2908d74', 'ㅀㅇ', '', 'ㄹㅇㅎㄹㅇ', 0, 'c3dPRHpVZ2JxYUJzVVdBb1FxZjB6Zz09', 'UzFuYWZsS1J2czdnWkFCR3RkQ3RtQT09', '', '호ㅓㅗㅎ', '', '호ㅓㅗㅎㄹ', '', '', '', '', '호ㅓㅎ', 'USD', '0', 'en', NULL, '2024-02-29 15:03:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', 1),
(16, 1, 3, 'WDFTbEg4dWlXMEJPZ1JhUUc1bkZiZz09', 'bf6aaaab7c143ca12ae448c69fb72bb4cf1b29154b9086a927a0a91ae334cdf7', 'fgf', '', 'hfghg', 1, 'L2dwUmgyc0x5endRTDRrMlZtNHo2dz09', 'dnNFY3BxWGwvRXZLZEJUTDJiTFlKUT09', '', 'hjkjh', '', 'jhkhjk', '', '', '', '', 'khj', 'USD', '0', 'en', NULL, '2024-02-29 15:04:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', 1),
(17, 1, 3, 'UEs4U0J4U1U1YlJidkt2N25wbUFPQT09', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'ㅎ로', '', 'ㄹ홇', 0, 'Rm02bzhBVnJSdFNoZHRTWFkzUktzZz09', 'aTYyN2JnbWJMSDdwazBlOGdpMVp5dz09', '', 'ㅗ홀호', '', 'ㅎ롫', '', '', '', '', 'ㄹ홀호', 'USD', '0', 'en', NULL, '2024-02-29 15:06:25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', 1),
(18, 1, 3, 'NTNQWjQ1blY0WEs4dllMek9OMWQ0UT09', 'd53a998b7bdca1a3eb93a32d1ec94af6090c1a349326641b25e170caf08ccb87', 'fsdf', '', 'fsdfd', 1, 'ZkwzdUhxWFNEc1J5SlBsUTdVWnJEdz09', 'YmV0Vm8vQTVYUlkyckd1QmJDbyt2QT09', '', 'hfdgfgh', '', 'fhgf', '', '', '', '', 'gfhf', 'USD', '0', 'en', NULL, '2024-02-29 15:08:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', 1),
(19, 1, 3, 'SWpEaUErWDZkMjVGUFJaWS9aLzlmZz09', '48f89b630677c2cbb70e2ba05bf7a3633294e368a45bdc2c7df9d832f9e0c941', 'hfghfg', '', 'hfg', 0, 'bjQ2aFRyTWp1TnRvZFRPek1rSmo4dz09', 'YmV0Vm8vQTVYUlkyckd1QmJDbyt2QT09', '', '53', '', '543', '', '', '', '', '452', 'USD', '0', 'en', NULL, '2024-02-29 15:08:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', 0);

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `class_info`
--
ALTER TABLE `class_info`
  ADD PRIMARY KEY (`idx`);

--
-- 테이블의 인덱스 `class_time`
--
ALTER TABLE `class_time`
  ADD PRIMARY KEY (`idx`);

--
-- 테이블의 인덱스 `log_download`
--
ALTER TABLE `log_download`
  ADD PRIMARY KEY (`idx`);

--
-- 테이블의 인덱스 `manager`
--
ALTER TABLE `manager`
  ADD PRIMARY KEY (`idx`),
  ADD UNIQUE KEY `manager_id` (`manager_id`);

--
-- 테이블의 인덱스 `subs_class`
--
ALTER TABLE `subs_class`
  ADD PRIMARY KEY (`idx`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `class_info`
--
ALTER TABLE `class_info`
  MODIFY `idx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 테이블의 AUTO_INCREMENT `class_time`
--
ALTER TABLE `class_time`
  MODIFY `idx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- 테이블의 AUTO_INCREMENT `log_download`
--
ALTER TABLE `log_download`
  MODIFY `idx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 테이블의 AUTO_INCREMENT `manager`
--
ALTER TABLE `manager`
  MODIFY `idx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 테이블의 AUTO_INCREMENT `subs_class`
--
ALTER TABLE `subs_class`
  MODIFY `idx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
