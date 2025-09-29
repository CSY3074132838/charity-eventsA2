-- sql/charityevents_db.sql
DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

-- Organisations
CREATE TABLE organisations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  mission TEXT,
  phone VARCHAR(40),
  email VARCHAR(120),
  website VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories (gala, fun run, auction, concert...)
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL
);

-- Events
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  org_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  short_desc VARCHAR(300),
  full_desc TEXT,
  city VARCHAR(100),
  venue VARCHAR(150),
  address VARCHAR(200),
  start_time DATETIME NOT NULL,
  end_time   DATETIME NOT NULL,
  hero_image_url VARCHAR(500),
  status ENUM('active','suspended') DEFAULT 'active',
  goal_amount DECIMAL(10,2) DEFAULT 0,
  raised_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ev_org FOREIGN KEY (org_id) REFERENCES organisations(id),
  CONSTRAINT fk_ev_cat FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tickets (simple for A2; A3 can add CRUD)
CREATE TABLE tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,  -- 0.00 means free
  currency CHAR(3) DEFAULT 'USD',
  CONSTRAINT fk_tk_ev FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Seed organisations
INSERT INTO organisations (name, mission, phone, email, website) VALUES
('Heart of Hope Foundation', 'Empowering underprivileged youth through education and health.', '+81-3-1234-5678', 'info@heartofhope.org', 'https://heartofhope.org'),
('Green City Alliance', 'Urban greening and sustainability initiatives.', '+81-3-2345-6789', 'hello@greencity.org', 'https://greencity.org');

-- Seed categories
INSERT INTO categories (slug, name) VALUES
('gala','Gala Dinner'),
('fun-run','Fun Run'),
('auction','Silent Auction'),
('concert','Charity Concert');

-- Seed events (mix of past & upcoming; one suspended)
-- Adjust dates as needed; examples assume current date context
INSERT INTO events
(org_id, category_id, title, short_desc, full_desc, city, venue, address, start_time, end_time, hero_image_url, status, goal_amount, raised_amount)
VALUES
(1, 1, 'Stars for Scholars Gala', 'Black-tie dinner to fund scholarships.',
 'A formal evening with guest speakers and live music to raise scholarship funds for low-income students.',
 'Tokyo', 'Imperial Hotel Ballroom', '1-1 Uchisaiwaicho, Chiyoda City, Tokyo',
 '2025-10-12 18:30:00', '2025-10-12 22:00:00',
 'https://images.unsplash.com/photo-1543007630-9710e4a00a20', 'active', 50000.00, 12000.00),

(1, 2, 'Run for Young Minds 10K', 'Community 5K/10K fun run.',
 'Join our city fun run to support youth mental health programs. Family friendly with medals for top finishers.',
 'Tokyo', 'Odaiba Seaside Park', '1-4-1 Daiba, Minato City, Tokyo',
 '2025-11-09 08:00:00', '2025-11-09 12:00:00',
 'https://images.unsplash.com/photo-1520975922203-b88663a1b0d4', 'active', 20000.00, 4600.00),

(2, 3, 'Art for Trees Silent Auction', 'Bid on local art to plant trees.',
 'Local artists donate works; proceeds fund urban tree planting near schools and hospitals.',
 'Tokyo', 'Shibuya Culture Center', '23-21 Sakuragaokacho, Shibuya City, Tokyo',
 '2025-10-26 17:00:00', '2025-10-26 20:30:00',
 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4', 'active', 15000.00, 3000.00),

(2, 4, 'Sounds of the City Benefit Concert', 'Indie bands unite for greener streets.',
 'An outdoor concert featuring 4 indie bands. All ticket revenue supports pocket parks and bike lanes.',
 'Tokyo', 'Yoyogi Park Stage', '2-1 Yoyogikamizonocho, Shibuya City, Tokyo',
 '2025-12-02 16:00:00', '2025-12-02 21:00:00',
 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229', 'active', 30000.00, 0.00),

(1, 2, 'Family Fun Run (5K)', 'All ages welcome. Strollers OK!',
 'Casual 5K suitable for all ages. Water stations every 1km. Dogs on leashes welcome.',
 'Tokyo', 'Sumida Park', '1-1 Mukojima, Sumida City, Tokyo',
 '2025-09-14 08:30:00', '2025-09-14 10:30:00',
 'https://images.unsplash.com/photo-1502810190503-8303352d0aa0', 'active', 8000.00, 7800.00),

(1, 1, 'Hope Spring Gala 2024', 'Last year’s gala (past event).',
 'A memorable night of impact stories from scholarship recipients.',
 'Tokyo', 'Palace Hotel', '1-1-1 Marunouchi, Chiyoda City, Tokyo',
 '2024-11-10 18:00:00', '2024-11-10 22:00:00',
 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f', 'active', 45000.00, 45000.00),

(2, 3, 'Vintage Vinyl Auction', 'Rare LPs for a greener city.',
 'Collectors donate rare vinyl. Every bid plants trees across the city wards.',
 'Tokyo', 'Nakano Sunplaza', '4-1-1 Nakano, Nakano City, Tokyo',
 '2025-08-20 18:00:00', '2025-08-20 21:30:00',
 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', 'active', 12000.00, 11200.00),

(2, 4, 'Rooftop Jazz Night', 'Suspended: pending policy review.',
 'Smooth jazz with city views. Event suspended due to noise policy concerns.',
 'Tokyo', 'Ginza Rooftop Hall', '5-5-5 Ginza, Chuo City, Tokyo',
 '2025-10-30 19:00:00', '2025-10-30 22:00:00',
 'https://images.unsplash.com/photo-1511193311914-0346f7f2fd1d', 'suspended', 10000.00, 0.00);

-- Seed simple tickets
INSERT INTO tickets (event_id, name, price) VALUES
(1, 'Gala Standard', 120.00), (1, 'Gala VIP', 250.00),
(2, '10K Entry', 25.00), (2, '5K Entry', 15.00),
(3, 'Auction Entry', 0.00),
(4, 'Concert Ticket', 35.00),
(5, '5K Family Entry', 0.00),
(6, '2024 Gala Archive', 0.00),
(7, 'Auction Entry', 0.00),
(8, 'Jazz Night', 40.00);
