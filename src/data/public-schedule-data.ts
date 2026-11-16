import { curatedScheduleGames, curatedScheduleTeams } from "@/data/schedule-display-data";
import { games, teams } from "@/data/site-data";

export const allScheduleGames = [...games, ...curatedScheduleGames];
export const allScheduleTeams = [...teams, ...curatedScheduleTeams.filter((team) => !teams.some((item) => item.id === team.id))];
