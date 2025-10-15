import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api-service';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {getEventStatus, statusChip} from '../common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  events: any[] = []
  error = ''

  constructor(private apiService: ApiService) {
  }

  // load all events
  ngOnInit(): void {
    this.apiService.getAllEvents({ status: 'all' }).subscribe((items: any) => {
      this.events = items;
    }, error => {
      this.error = 'Failed to load events'
    })
  }

  // get status clip
  getStatusChip(event: any) {
    return statusChip(getEventStatus(event))
  }

  // get event datetime
  eventWhen(event: any) {
    return new Date(event.start_datetime).toLocaleString() + " — " + new Date(event.end_datetime).toLocaleString()
  }

  // get event location
  eventWhere(event: any) {
    return [event.city||"", event.state_region||""].filter(Boolean).join(" · ") || "—"
  }
}
