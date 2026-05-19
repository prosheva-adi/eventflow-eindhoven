-- Venues
INSERT INTO venues (id, name, description, address, latitude, longitude, image_url, website, category, created_at) VALUES
                                                                                                                       (
                                                                                                                           'a1b2c3d4-0000-0000-0000-000000000001',
                                                                                                                           'Effenaar',
                                                                                                                           'A popular cultural venue in the heart of Eindhoven hosting concerts, club nights and festivals.',
                                                                                                                           'Dommelstraat 2, 5611 CK Eindhoven',
                                                                                                                           51.438700,
                                                                                                                           5.474600,
                                                                                                                           'https://images.unsplash.com/photo-1501386761578-eaa54b-bc35f?w=800',
                                                                                                                           'https://www.effenaar.nl',
                                                                                                                           'Music Venue',
                                                                                                                           NOW()
                                                                                                                       ),
                                                                                                                       (
                                                                                                                           'a1b2c3d4-0000-0000-0000-000000000002',
                                                                                                                           'Natlab',
                                                                                                                           'A creative hub in the Strijp-S area featuring art, film, music and cultural events.',
                                                                                                                           'Kastanjelaan 500, 5616 LZ Eindhoven',
                                                                                                                           51.447200,
                                                                                                                           5.458900,
                                                                                                                           'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800',
                                                                                                                           'https://www.natlab.nl',
                                                                                                                           'Cultural Center',
                                                                                                                           NOW()
                                                                                                                       ),
                                                                                                                       (
                                                                                                                           'a1b2c3d4-0000-0000-0000-000000000003',
                                                                                                                           'MusicO',
                                                                                                                           'Eindhoven''s largest indoor music and events complex with multiple stages.',
                                                                                                                           'Boschdijktunnel 10, 5611 AC Eindhoven',
                                                                                                                           51.441800,
                                                                                                                           5.469300,
                                                                                                                           'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
                                                                                                                           'https://www.musico.nl',
                                                                                                                           'Club',
                                                                                                                           NOW()
                                                                                                                       );

-- Events
INSERT INTO events (id, venue_id, name, description, image_url, start_date, start_time, end_time, ticket_price, ticket_url, organiser_name, created_at) VALUES
                                                                                                                                                            (
                                                                                                                                                                'b1b2c3d4-0000-0000-0000-000000000001',
                                                                                                                                                                'a1b2c3d4-0000-0000-0000-000000000001',
                                                                                                                                                                'Summer Sounds Festival',
                                                                                                                                                                'A vibrant summer music festival featuring local and international artists across multiple genres.',
                                                                                                                                                                'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
                                                                                                                                                                '2026-07-15',
                                                                                                                                                                '18:00:00',
                                                                                                                                                                '23:30:00',
                                                                                                                                                                12.50,
                                                                                                                                                                'https://www.effenaar.nl/tickets',
                                                                                                                                                                'Effenaar',
                                                                                                                                                                NOW()
                                                                                                                                                            ),
                                                                                                                                                            (
                                                                                                                                                                'b1b2c3d4-0000-0000-0000-000000000002',
                                                                                                                                                                'a1b2c3d4-0000-0000-0000-000000000002',
                                                                                                                                                                'Digital Art Exhibition',
                                                                                                                                                                'An immersive digital art experience showcasing cutting-edge works from artists around the world.',
                                                                                                                                                                'https://images.unsplash.com/photo-1545987796-200677ee1011?w=800',
                                                                                                                                                                '2026-06-20',
                                                                                                                                                                '10:00:00',
                                                                                                                                                                '18:00:00',
                                                                                                                                                                8.00,
                                                                                                                                                                'https://www.natlab.nl/tickets',
                                                                                                                                                                'Natlab',
                                                                                                                                                                NOW()
                                                                                                                                                            ),
                                                                                                                                                            (
                                                                                                                                                                'b1b2c3d4-0000-0000-0000-000000000003',
                                                                                                                                                                'a1b2c3d4-0000-0000-0000-000000000003',
                                                                                                                                                                'Techno Night',
                                                                                                                                                                'An unforgettable night of electronic music with top DJs from across Europe.',
                                                                                                                                                                'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
                                                                                                                                                                '2026-06-28',
                                                                                                                                                                '22:00:00',
                                                                                                                                                                '05:00:00',
                                                                                                                                                                15.00,
                                                                                                                                                                'https://www.musico.nl/tickets',
                                                                                                                                                                'MusicO',
                                                                                                                                                                NOW()
                                                                                                                                                            );

-- Event categories
INSERT INTO event_categories (event_id, category) VALUES
                                                      ('b1b2c3d4-0000-0000-0000-000000000001', 'MUSIC'),
                                                      ('b1b2c3d4-0000-0000-0000-000000000002', 'ART'),
                                                      ('b1b2c3d4-0000-0000-0000-000000000003', 'MUSIC'),
                                                      ('b1b2c3d4-0000-0000-0000-000000000003', 'NIGHTLIFE');