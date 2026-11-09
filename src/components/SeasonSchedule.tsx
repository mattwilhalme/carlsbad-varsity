"use client";

import { useState } from "react";
import { ScheduleList } from "@/components/ScheduleList";
import type { Game, School } from "@/domain/models";

export function SeasonSchedule({ schedules, school }: { schedules: Record<string, Game[]>; school: School }) {
  const seasons = Object.keys(schedules).sort((a, b) => b.localeCompare(a));
  const [season, setSeason] = useState(seasons[0] || "");

  return (
    <>
      <div className="section-heading season-heading">
        <div>
          <label className="kicker" htmlFor="season-select">Season</label>
          <select id="season-select" value={season} onChange={(event) => setSeason(event.target.value)}>
            {seasons.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <h2 id="schedule-heading">Schedule &amp; results</h2>
        </div>
        <span className="status-label">Verified data only</span>
      </div>
      <ScheduleList schedule={schedules[season] || []} school={school} />
    </>
  );
}
