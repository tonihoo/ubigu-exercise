INSERT INTO hedgehog (name, age, gender, location) VALUES
('Selma Siili', 2, 'female', ST_GeomFromText('POINT(385000 6670000)', 3067)), -- Helsinki
('Mikko Mallikas-Siili', 3, 'male', ST_GeomFromText('POINT(530500 7125000)', 3067)), -- Kajaani
('Sampo Siili', 5, 'male', ST_GeomFromText('POINT(330000 6820000)', 3067)), -- Tampere
('Pirkko Piikikäs', 1, 'female', ST_GeomFromText('POINT(453000 7282000)', 3067)), -- North from Oulu
('Siili Sievänen', 4, 'unknown', ST_GeomFromText('POINT(425000 7020000)', 3067)); -- Pihtipudas

