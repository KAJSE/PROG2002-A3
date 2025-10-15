DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
USE charityevents_db;


CREATE TABLE organisations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  mission_text TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  website_url VARCHAR(255),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  description VARCHAR(255),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organisation_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(180) NOT NULL,
  short_description VARCHAR(255),
  full_description TEXT,
  venue_name VARCHAR(180),
  address_line1 VARCHAR(180),
  city VARCHAR(120),
  state_region VARCHAR(120),
  postcode VARCHAR(20),
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  is_suspended TINYINT(1) NOT NULL DEFAULT 0,
  image_url VARCHAR(255),
  goal_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_events_org FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_events_cat FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  attendee_name VARCHAR(120),
  attendee_email VARCHAR(255),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  amount DECIMAL(10,2) AS (quantity * unit_price) STORED,
  status ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_regs_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE
);



INSERT INTO organisations (name, mission_text, contact_email, website_url) VALUES
('Night Gardeners', 'Midnight urban greening & pollinator corridors.', 'hi@nightgardeners.org', 'https://nightgardeners.example'),
('Decimal Doves', 'Micro-donations for macro changes.', 'team@d-doves.org', 'https://d-doves.example'),
('Thrift Orchestra','Upcycling instruments for youth bands.', 'hello@thriftorchestra.org', 'https://thriftorchestra.example'),
('Lighthouse Labs', 'STEM pop-ups for under-resourced neighborhoods.', 'contact@llabs.org', 'https://llabs.example');



INSERT INTO categories (name, description) VALUES
('Midnight Cleanup', 'After-hours city clean & glow painting'),
('Odd-Meter Concert', 'Unusual time signatures & recycled instruments'),
('Reverse Auction', 'Prices drop with each pledge threshold'),
('Parkour for Pantry', 'Movement jam to stock community fridges'),
('Silent Breakfast', 'Headphone-based morning fundraiser'),
('Micro Grants Day', 'Dozens of tiny grants, instant voting');


INSERT INTO events
(organisation_id, category_id, name, short_description, full_description, venue_name, address_line1, city, state_region, postcode, start_datetime, end_datetime, is_suspended, image_url, goal_amount)
VALUES
(1, 1, 'Neon Rake #3', 'Glow rake along the canal', 'Volunteers rake litter at night; LEDs mark progress.', 'Canal Edge', 'Kiyosu-bashi', 'Tokyo', 'Tokyo', '130-0005', '2025-09-07 22:00:00', '2025-09-08 00:30:00', 0, NULL, 2777.00),
(4, 6, 'One-Minute Grants', '60-sec pitches, instant votes', 'Rapid-fire STEM micro-grants; each pitch exactly 60s.', 'Makers Hall', '48 Circuit Ave', 'Reykjavik', 'Capital Region', '101', '2025-08-29 18:00:00', '2025-08-29 21:00:00', 0, NULL, 9999.00),

(3, 2, '7/8 for Good', 'Odd-meter street set', 'Buskers perform only in 7/8 and 5/4 with upcycled gear.', 'Old Port Steps', 'Quay 2', 'Valparaíso', 'V Region', '2340000', '2025-10-05 17:30:00', '2025-10-05 20:00:00', 0, NULL, 4132.00),

(2, 3, 'Falling Prices, Rising Books', 'Reverse auction of rare zines', 'Each pledge tier passed drops price for everyone.', 'Depot Z', '19 Switchyard Ln', 'Tallinn', 'Harju', '10111', '2025-10-12 19:00:00', '2025-10-12 21:30:00', 0, NULL, 7777.00),
(1, 4, 'Wallrun for Warmth', 'Parkour jam for heaters', 'Community heaters for elderly homes; checkpoints donate.', 'Granite Yard', '9 Stone Mill', 'Tbilisi', 'Mtatsminda', '0108', '2025-10-19 09:00:00', '2025-10-19 11:00:00', 0, NULL, 12000.00),
(3, 5, 'Silent Breakfast 2: Oatwave', 'Headphone buffet at sunrise', 'Multi-channel audio breakfast; choose your chef track.', 'Harbor Roof', 'Pier 1', 'Oaxaca', 'Oaxaca', '68000', '2025-10-26 06:10:00', '2025-10-26 08:00:00', 0, NULL, 0.00), -- 零目标（展示“无目标”）
(4, 6, 'Nano-Grant Alley', 'Vote with stickers', 'Dozens of tiny science requests on a wall, live funding.', 'Alley 47', 'Backline Rd', 'Rotorua', 'Bay of Plenty', '3010', '2025-11-09 14:00:00', '2025-11-09 17:00:00', 0, NULL, 5310.00),
(2, 3, 'Ghost Bid Market', 'Reverse auction… in the dark', 'Prices drop, lights drop; final minute by lantern.', 'Old Grain Hall', 'Warehouse 3', 'Ulaanbaatar', 'UB', '15160', '2025-11-22 20:30:00', '2025-11-22 22:00:00', 0, NULL, 8888.00),

(1, 1, 'Moon Brooms', 'Suspended by admins', 'Awaiting permit validation.', 'Riverside', 'South Walk', 'London', 'ENG', 'SE1', '2025-10-15 23:00:00', '2025-10-16 01:00:00', 1, NULL, 3333.00),

(3, 2, 'Rhythm of Reuse', 'Percussion from scrap', 'Youth band premieres metal-bin symphony.', 'Rail Shed', 'Dock 7', 'Nairobi', 'Nairobi', '00100', '2025-12-01 18:45:00', '2025-12-01 20:15:00', 0, NULL, 4600.00);


INSERT INTO registrations (event_id, attendee_name, attendee_email, quantity, unit_price, status, created_at) VALUES
(1, 'Kenta I.', 'kenta@example.com', 1, 7.77, 'confirmed', '2025-09-01 21:00:00'),
(1, 'Aoi M.', 'aoi@example.com', 3, 13.37, 'confirmed', '2025-09-05 10:30:00'),
(1, 'Jin R.', 'jin@example.com', 2, 0.00, 'pending', '2025-09-06 23:10:00');

INSERT INTO registrations (event_id, attendee_name, attendee_email, quantity, unit_price, status, created_at) VALUES
(2, 'Sigrid', 'sigrid@example.com', 1, 60.00, 'confirmed', '2025-08-20 18:10:00'),
(2, 'Bjorn', 'bjorn@example.com',  5, 12.34, 'confirmed', '2025-08-25 07:05:00'),
(2, 'Edda', 'edda@example.com', 1, 100.00,'cancelled', '2025-08-28 12:00:00');

INSERT INTO registrations (event_id, attendee_name, attendee_email, quantity, unit_price, status, created_at) VALUES
(3, 'Mateo', 'mateo@example.com', 2, 19.99, 'confirmed', '2025-10-03 11:00:00'),
(3, 'Luz', 'luz@example.com', 1, 7.00, 'confirmed', '2025-10-04 20:00:00'),
(3, 'Nina', 'nina@example.com', 4, 5.25, 'pending', '2025-10-05 09:12:00');
