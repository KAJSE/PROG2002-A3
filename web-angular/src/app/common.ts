// get event status
export function getEventStatus(e: any){
  const now = Date.now();
  const start = new Date(e.start_datetime).getTime();
  const end = new Date(e.end_datetime).getTime();
  if (e.is_suspended) {
    return "suspended";
  }
  if (end < now) {
    return "past";
  }
  if (start > now) {
    return "upcoming";
  }
  return "active";
}


// get status chip
export function statusChip(status: 'active' | 'upcoming' | 'past' | 'suspended'){
  var map = {
    active: {
      cls: "chip-status chip-active",
      label: "Active"
    },
    upcoming: {
      cls: "chip-status chip-upcoming",
      label: "Upcoming"
    },
    past: {
      cls: "chip-status chip-past",
      label: "Past"
    },
    suspended: {
      cls:"chip-status chip-suspended",
      label: "Suspended"
    }
  };
  return map[status] || map.upcoming;
}
