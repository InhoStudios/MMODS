CREATE DATABASE IF NOT EXISTS skinimages;
USE skinimages;

CREATE TABLE IF NOT EXISTS Cases (
	case_id varchar(255),
    age int,
    sex varchar(1),
    history varchar(1),
    ethnicity varchar(100),
    user_selected_entity varchar(255) not null,
    clinician_entity varchar(255),
    pathologist_entity varchar(255),
    anatomic_site varchar(150),
    size int,
    severity varchar(100),
    fitzpatric_type int,
    tags varchar(255),
    primary key (case_id)
);

CREATE TABLE IF NOT EXISTS ICD_Entity (
	entity_id varchar(255),
    entity_title varchar(255),
    primary key (entity_id)
);

CREATE TABLE IF NOT EXISTS Image (
	img_id int,
    filename varchar(255) not null,
    case_id varchar(255) not null,
    modality varchar(255) not null,
    camera varchar(255),
    imaging_conditions varchar(255),
    operator varchar(255),
    image_quality varchar(255),
    illumination varchar(255),
    distance varchar(255),
    clinical_site varchar(255),
    color_constancy_applied varchar(150),
    polarization varchar(50),
    privacy varchar(50),
    fst_eval_method varchar(150),
    individual_typology_angle varchar(10),
    primary key (img_id),
    foreign key (case_id) references Cases(case_id)
);

CREATE TABLE IF NOT EXISTS Case_Categories (
	case_id varchar(255),
    entity_id varchar(255),
    foreign key (case_id) references Cases(case_id),
    foreign key (entity_id) references ICD_Entity(entity_id)
);

CREATE TABLE IF NOT EXISTS Case_Alt_Diagnoses (
	case_id varchar(255),
	entity_id varchar(255),
    foreign key (case_id) references Cases(case_id),
    foreign key (entity_id) references ICD_Entity(entity_id)
);