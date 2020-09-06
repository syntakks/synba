use werkdb;

select
	sum(hour(sec_to_time((to_seconds(project.completed) - to_seconds(project.created))))) as total_time
from project;