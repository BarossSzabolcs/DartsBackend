-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Feb 03. 11:09
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `dartsmobil`
--
CREATE DATABASE IF NOT EXISTS `dartsmobil` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `dartsmobil`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo`
--

CREATE TABLE `felhasznalo` (
  `felhasznalo_id` int(11) NOT NULL,
  `felhasznalo_nev` varchar(255) NOT NULL,
  `felhasznalo_jelszo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalo`
--

INSERT INTO `felhasznalo` (`felhasznalo_id`, `felhasznalo_nev`, `felhasznalo_jelszo`) VALUES
(3, 'Szabi', '$2a$10$Y6OHGjd6wxdaNApUQw6t4.UszIdeo2J524gHE9ShkmHwE497zaRSG'),
(4, 'Boti', '$2a$10$HJA.IPE8vdHzDL//DF0BHuKYw.etsOFw4eOAjTl98x7QxlJvSqvh6');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `meccs`
--

CREATE TABLE `meccs` (
  `meccs_id` int(11) NOT NULL,
  `meccs_elsojatekos` varchar(255) NOT NULL,
  `meccs_masodikjatekos` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `meccs`
--

INSERT INTO `meccs` (`meccs_id`, `meccs_elsojatekos`, `meccs_masodikjatekos`) VALUES
(1, 'Szabi', 'Mazsi'),
(2, 'Boti', 'Mazsi'),
(3, 'Boti', 'Szabi'),
(4, 'Szabi', 'Tanárnő'),
(5, 'Szabi', 'Dávid'),
(6, 'Szabi', 'Dani');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `meccseredmeny`
--

CREATE TABLE `meccseredmeny` (
  `meccseredmeny_id` int(11) NOT NULL,
  `meccseredmeny_meccsid` int(11) NOT NULL,
  `meccseredmeny_datum` datetime NOT NULL,
  `meccseredmeny_eredmeny` varchar(255) NOT NULL,
  `meccseredmeny_gyoztes` varchar(255) NOT NULL,
  `meccseredmeny_vesztes` varchar(255) NOT NULL,
  `meccseredmeny_atlaggyoztes` int(11) NOT NULL,
  `meccseredmeny_atlagvesztes` int(11) NOT NULL,
  `meccseredmeny_veszteskiszallo` int(11) NOT NULL,
  `meccseredmeny_gyozteskiszallo` int(11) NOT NULL,
  `meccseredmeny_veszteslegnagyobb` int(11) NOT NULL,
  `meccseredmeny_gyozteslegnagyobb` int(11) NOT NULL,
  `meccseredmeny_gyozteskorszam` int(11) NOT NULL,
  `meccseredmeny_veszteskorszam` int(11) NOT NULL,
  `meccseredmeny_vesztesdobas` int(11) NOT NULL,
  `meccseredmeny_gyoztesdobas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `meccseredmeny`
--

INSERT INTO `meccseredmeny` (`meccseredmeny_id`, `meccseredmeny_meccsid`, `meccseredmeny_datum`, `meccseredmeny_eredmeny`, `meccseredmeny_gyoztes`, `meccseredmeny_vesztes`, `meccseredmeny_atlaggyoztes`, `meccseredmeny_atlagvesztes`, `meccseredmeny_veszteskiszallo`, `meccseredmeny_gyozteskiszallo`, `meccseredmeny_veszteslegnagyobb`, `meccseredmeny_gyozteslegnagyobb`, `meccseredmeny_gyozteskorszam`, `meccseredmeny_veszteskorszam`, `meccseredmeny_vesztesdobas`, `meccseredmeny_gyoztesdobas`) VALUES
(1, 1, '2024-11-20 09:05:37', '2-3', 'Szabi', 'Mazsi', 60, 50, 20, 40, 60, 80, 3, 4, 13, 11),
(2, 2, '2024-11-20 09:07:26', '1-3', 'Boti', 'Mazsi', 80, 72, 12, 24, 54, 60, 6, 4, 21, 20),
(3, 3, '2024-11-20 09:07:59', '1-3', 'Boti', 'Szabi', 92, 84, 50, 66, 100, 120, 3, 3, 10, 6),
(4, 4, '2024-12-02 09:58:14', '2-3', 'Tanárnő', 'Szabi', 80, 50, 20, 66, 54, 120, 3, 3, 13, 6),
(5, 5, '2024-12-04 09:29:04', '3-3', 'Szabi', 'Dávid', 50, 40, 20, 24, 60, 60, 6, 4, 21, 6),
(6, 6, '2024-12-04 09:38:13', '2-2', 'Szabi', 'Dani', 72, 30, 20, 66, 60, 60, 6, 4, 21, 20),
(7, 2, '2025-01-29 10:36:03', '2-1', 'Szabi', 'Boti', 101, 43, 34, 23, 32, 56, 2, 1, 10, 13),
(8, 2, '2025-01-29 10:36:03', '2-1', 'Szabi', 'Boti', 101, 43, 34, 23, 32, 56, 2, 1, 10, 13),
(9, 2, '2025-01-29 10:36:03', '2-1', 'Szabi', 'Boti', 101, 43, 34, 23, 32, 56, 2, 1, 10, 13),
(10, 2, '2025-01-29 10:36:03', '2-1', 'Szabi', 'Boti', 101, 43, 34, 23, 32, 56, 2, 1, 10, 13),
(11, 2, '2025-01-29 10:36:03', '2-1', 'Szabi', 'Boti', 101, 43, 34, 23, 32, 56, 2, 1, 10, 13),
(12, 2, '2025-01-29 10:36:03', '2-1', 'Szabi', 'Boti', 101, 43, 34, 23, 32, 56, 2, 1, 10, 13),
(13, 2, '2025-01-29 10:36:03', '2-1', 'Szabi', 'Boti', 101, 43, 34, 23, 32, 56, 2, 1, 10, 13),
(14, 2, '2025-01-29 10:50:15', '2-1', 'Szabi', 'Boti', 101, 43, 34, 23, 32, 56, 2, 1, 10, 13),
(15, 2, '2025-01-30 12:48:45', '2-1', 'Szabi', 'Boti', 101, 43, 34, 23, 32, 56, 2, 1, 10, 13);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`felhasznalo_id`);

--
-- A tábla indexei `meccs`
--
ALTER TABLE `meccs`
  ADD PRIMARY KEY (`meccs_id`);

--
-- A tábla indexei `meccseredmeny`
--
ALTER TABLE `meccseredmeny`
  ADD PRIMARY KEY (`meccseredmeny_id`),
  ADD KEY `meccseredmeny_meccsid` (`meccseredmeny_meccsid`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `meccs`
--
ALTER TABLE `meccs`
  MODIFY `meccs_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `meccseredmeny`
--
ALTER TABLE `meccseredmeny`
  MODIFY `meccseredmeny_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `meccseredmeny`
--
ALTER TABLE `meccseredmeny`
  ADD CONSTRAINT `meccseredmeny_ibfk_1` FOREIGN KEY (`meccseredmeny_meccsid`) REFERENCES `meccs` (`meccs_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
