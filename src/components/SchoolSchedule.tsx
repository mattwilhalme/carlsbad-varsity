"use client";

import { useState } from "react";
import { ScheduleList } from "@/components/ScheduleList";
import type { Game, School } from "@/domain/models";

type SchoolSeason = { games: Game[]; archived: boolean; season: string };

export function SchoolSchedule({ school, seasons }: { school: School; seasons: SchoolSeason[] }) {
  const [season, setSeason] = useState(seasons[0]?.season || "");
  const selected = seasons.find((item) => item.season === season) || seasons[0];

  return (
    <section className="school-schedule section-rule" aria-labelledby="schedule-heading">
      <div className="section-heading season-heading">
        <div>
          <label className="kicker" htmlFor={`school-season-${school.slug}`}>Season</label>
          <select id={`school-season-${school.slug}`} value={season} onChange={(event) => setSeason(event.target.value)}>
            {seasons.map((option) => <option key={option.season} value={option.season}>{option.season}{option.archived ? " · Archive" : ""}</option>)}
          </select>
          <h2 id="schedule-heading">Schedule &amp; results</h2>
        </div>
        <span className="status-label">{selected?.archived ? "Archived calendar" : "Active calendar"}</span>
      </div>
      <ScheduleList schedule={selected?.games || []} school={school} showSport />
    </section>
  );
}
