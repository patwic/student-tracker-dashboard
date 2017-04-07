drop table if exists prefs;

create table prefs (
    id serial primary key,
    user_id int unique not null,
    cohort_ids int[]
);

insert into prefs (user_id, cohort_ids) values (1, '{2, 3, 4}');
insert into prefs (user_id, cohort_ids) values (2, '{1, 3}');