\c db

CREATE TABLE IF NOT EXISTS repo_val_mem (
  id SERIAL PRIMARY KEY,
  id_task_redis VARCHAR(50) NOT NULL,
  id_rep_val VARCHAR(50) NOT NULL UNIQUE,
  method_fill VARCHAR(25),
  p_value FLOAT,
  trend FLOAT,
  path_out VARCHAR(255),
  status_task BOOLEAN DEFAULT FALSE,
  from_t VARCHAR(25),
  to_d VARCHAR(25)
);

CREATE TABLE IF NOT EXISTS nan_distribution (
  id SERIAL PRIMARY KEY,
  station VARCHAR(50) NOT NULL UNIQUE,
  info TEXT
); 

CREATE TABLE IF NOT EXISTS task_cache (
  id SERIAL PRIMARY KEY,
  id_task_redis VARCHAR(50) NOT NULL,
  id_task VARCHAR(50) UNIQUE,
  status_task BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS station_info (
  id SERIAL PRIMARY KEY,
  id_repository VARCHAR(50) NOT NULL UNIQUE,
  json_info TEXT
);
