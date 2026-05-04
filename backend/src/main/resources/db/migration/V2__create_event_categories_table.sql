CREATE TABLE event_categories (
                                  event_id UUID REFERENCES events(id),
                                  category VARCHAR(50) NOT NULL,
                                  PRIMARY KEY (event_id, category)
);