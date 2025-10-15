// API url
var API = "http://localhost:3000";

// get element by selector
function $(sel) {
  return document.querySelector(sel);
}

// get API json result
function getJSON(url) {
  return fetch(API + url).then(function(r){
    return r.json();
  });
}

// get event status
function getEventStatus(e){
  var now = Date.now();
  var start = new Date(e.start_datetime).getTime();
  var end = new Date(e.end_datetime).getTime();
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
function statusChip(status){
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
  var cfg = map[status] || map.upcoming;
  return '<span class="'+cfg.cls+'">'+cfg.label+'</span>';
}

function eventContent(e) {
  var when = new Date(e.start_datetime).toLocaleString() + " — " + new Date(e.end_datetime).toLocaleString();
  var place = [e.city||"", e.state_region||""].filter(Boolean).join(" · ") || "—";
  var st = getEventStatus(e);

  var html = ''
    + '<article class="card">'
    + '  <div class="card-head">'
    + '    <div class="meta">'
    + '      <span class="chip">'+(e.category_name||"—")+'</span>'
    + '      <span class="chip">'+(e.organisation_name||"—")+'</span>'
    +        statusChip(st)
    + '    </div>'
    + '    <h3 class="card-title">'+e.name+'</h3>'
    + '  </div>'
    + '  <div class="card-body">'
    + '    <p class="pr">'+when+'</p>'
    + '    <p class="pr place">'+place+'</p>'
    + '  </div>'
    + '  <div class="card-foot">'
    + '    <a class="btn-primary btn-sm" href="detail.html?id='+e.id+'">View details</a>'
    + '  </div>'
    + '</article>';

  return html;
}
