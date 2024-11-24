INSERT INTO
    users (email, password, user_type)
VALUES
    (
        'groovy@deaditehunter.com',
        '$argon2id$v=19$m=65536,t=3,p=4$5TDVzgULwo2BooHQz1C3Fw$DvJyJqFsgyYkfubTky2RHnX+BrT0DW2Dtv0ks5Ly+Hg',
        'faculty'
    ),
    (
        'cworley@romancerun.com',
        '$argon2id$v=19$m=65536,t=3,p=4$9HYDtwbK9UsPOvvYgWO1Zw$kYl7nlv2TnaEE7b4MxwQAuBaSNRtmGXqvCm9hUR3l30',
        'faculty'
    ),
    (
        'marge@fargopd.org',
        '$argon2id$v=19$m=65536,t=3,p=4$ww9ovvsv9lTiMKyb+ECs5A$taULrNxKA9ksZG4O0VdOJqN9g36PdvRcCbSS2zdpEMs',
        'faculty'
    ),
    (
        'brundlefly@telepodlabs.com',
        '$argon2id$v=19$m=65536,t=3,p=4$nJHJPbQdF6eUkaMviMCk0Q$GeJxgEG0T3v2+DKvuNyIJ4FgZX8xPzLssbAl5GbB3cA',
        'faculty'
    ),
    (
        'jack@porkchopexpress.net',
        '$argon2id$v=19$m=65536,t=3,p=4$SxjtG8UBu9OPkPpe5p5wxg$ydBwFrulQ7QL1pbfHIrB/ZLak8u7RBbpzS2smBQF1H8',
        'faculty'
    );

INSERT INTO
    faculty (user_id, department, hire_date)
VALUES
    (1, 'Chainsaw Arts', DATE '2022-01-15'),
    (2, 'Interdimensional Studies', DATE '2021-08-10'),
    (3, 'Witty Heroics', DATE '2020-09-05'),
    (4, 'Practical Physics', DATE '2019-03-22'),
    (5, 'History', DATE '2018-11-11');

INSERT INTO
    courses (name, code, description, credits, faculty_id)
SELECT
    name,
    code,
    description,
    credits,
    id
FROM
    (
        VALUES
            (
                'Chainsaw Maintenance 101',
                'CSM101',
                'Learn to keep your chainsaw in top shape.',
                3,
                'groovy@deaditehunter.com'
            ),
            (
                'Intro to Interdimensional Studies',
                'IDS201',
                'Discover secrets of the multiverse.',
                4,
                'cworley@romancerun.com'
            ),
            (
                'Witty Heroics 101',
                'WH101',
                'Master witty retorts under pressure.',
                3,
                'marge@fargopd.org'
            ),
            (
                'Practical Physics',
                'PHYS101',
                'Learn physics concepts practically.',
                4,
                'brundlefly@telepodlabs.com'
            ),
            (
                'History of the Multiverse',
                'HIST301',
                'Explore significant multiversal events.',
                3,
                'jack@porkchopexpress.net'
            )
    ) AS data (name, code, description, credits, email)
    JOIN faculty ON faculty.user_id = (
        SELECT
            id
        FROM
            users
        WHERE
            email = data.email
    );