ALTER TABLE hedgehog
  ADD COLUMN name VARCHAR(255) NOT NULL,
  ADD COLUMN age INTEGER NOT NULL;

CREATE TYPE hedgehog_gender AS ENUM ('male', 'female', 'unknown');

ALTER TABLE hedgehog
  ADD COLUMN gender hedgehog_gender NOT NULL,
  ADD COLUMN location GEOMETRY(Point, 3067) NOT NULL;

CREATE INDEX hedgehog_location_idx ON hedgehog USING GIST (location);
