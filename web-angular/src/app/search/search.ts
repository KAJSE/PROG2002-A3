import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api-service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {getEventStatus, statusChip} from '../common';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
  categories: any[] = []
  events: any[] = []
  error = ""
  city = ""
  status = "active"
  keyword = ""
  state = ""
  category = ""
  startDateTime = ""
  endDateTime = ""

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    // load category options
    this.apiService.getAllCategories().subscribe((items: any) => {
      this.categories = items;
    }, error => {
      this.error = 'Failed to load categories'
    })

    this.searchEvents()
  }

  // search button click
  searchEvents(): void {
    // init parameters is empty object
    const params: any = {};

    // set attr if has binding value
    if(this.status) {
      params['status'] = this.status;
    }
    if(this.city) {
      params['city'] = this.city;
    }
    if(this.keyword) {
      params['q'] = this.keyword;
    }
    if(this.state) {
      params['state'] = this.state;
    }
    if(this.category) {
      params['categoryId'] = this.category;
    }
    if(this.startDateTime) {
      params['start'] = this.startDateTime;
    }
    if(this.endDateTime) {
      params['end'] = this.endDateTime;
    }

    // search event
    this.apiService.getAllEvents(params).subscribe((items: any) => {
      this.events = items;
    }, error => {
      this.error = 'Failed to load events'
    })
  }

  // reset search result
  resetSearch() {
    // reset input value
    this.error = ""
    this.city = ""
    this.status = "active"
    this.keyword = ""
    this.state = ""
    this.category = ""
    this.startDateTime = ""
    this.endDateTime = ""

    // reload events
    this.searchEvents()
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
