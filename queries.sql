-- select lesions based on patient ID (fill in participant id)
SELECT *
FROM Lesion l
WHERE l.participant_id="participant_id";
-- select participant information based on participant id
SELECT *
FROM Participant p
WHERE p.participant_id="participant_id";