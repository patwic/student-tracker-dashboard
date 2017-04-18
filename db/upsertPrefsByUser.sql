insert into prefs (user_id, cohort_ids)
values ($1, $2)
on conflict (user_id) do update set cohort_ids = excluded.cohort_ids returning cohort_ids;