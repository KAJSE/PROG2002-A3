import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api-service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {getEventStatus, statusChip} from '../common';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit {
  event: any;
  error = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // get route params id
    this.route.params.subscribe(params => {
      // get event detail by id
      this.apiService.getEventById(params['id']).subscribe((event: any) => {
        this.event = event;
      }, error => {
        this.error = 'Failed to load event'
      })
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
    return [event.venue_name, event.address_line1, event.city, event.state_region, event.postcode].filter(Boolean).join(' · ') || '—'
  }

  // get progress percent
  get pct() {
    return Math.max(0, Math.min(100, this.event.progress_percent));
  }
}
