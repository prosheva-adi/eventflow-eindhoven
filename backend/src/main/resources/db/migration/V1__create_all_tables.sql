-- Users
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       username VARCHAR(50) UNIQUE NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venues
CREATE TABLE venues (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        name VARCHAR(100) NOT NULL,
                        description TEXT,
                        address VARCHAR(255),
                        latitude DECIMAL(9,6),
                        longitude DECIMAL(9,6),
                        image_url VARCHAR(255),
                        website VARCHAR(255),
                        category VARCHAR(50),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE events (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        venue_id UUID REFERENCES venues(id),
                        name VARCHAR(150) NOT NULL,
                        description TEXT,
                        image_url VARCHAR(255),
                        start_date DATE,
                        start_time TIME,
                        end_time TIME,
                        ticket_price DECIMAL(10,2),
                        ticket_url VARCHAR(255),
                        organiser_name VARCHAR(100),
                        categories VARCHAR(255),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User liked events
CREATE TABLE user_liked_events (
                                   user_id UUID REFERENCES users(id),
                                   event_id UUID REFERENCES events(id),
                                   liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   PRIMARY KEY (user_id, event_id)
);

-- User followed venues
CREATE TABLE user_followed_venues (
                                      user_id UUID REFERENCES users(id),
                                      venue_id UUID REFERENCES venues(id),
                                      followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                      PRIMARY KEY (user_id, venue_id)
);