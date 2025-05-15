ALTER TABLE hedgehog
  ADD COLUMN name VARCHAR(255) NOT NULL,
  ADD COLUMN age INTEGER NOT NULL;

CREATE TYPE hedgehog_gender AS ENUM ('male', 'female', 'unknown');

ALTER TABLE hedgehog
  ADD COLUMN gender hedgehog_gender NOT NULL,
  ADD COLUMN location GEOMETRY(Point, 3067) NOT NULL;

COMMENT ON COLUMN hedgehog.location IS 'Location of hedgehogs in ETRS89-TM35FIN (EPSG:3067)';

CREATE INDEX hedgehog_location_idx ON hedgehog USING GIST (location);
