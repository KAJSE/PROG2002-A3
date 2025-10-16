import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api-service';

@Component({
  selector: 'app-events',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events implements OnInit {
  events: any[] = [];
  organisations: any[] = [];
  categories: any[] = [];
  showDialog = false;
  isEditing = false;
  selectedEventId: number | null = null;
  form: FormGroup;
  errorMessage = '';

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    // create form group, add Validators to name/organisation_id/category_id/... field
    this.form = this.fb.group({
      name: ['', Validators.required],
      organisation_id: [null, Validators.required],
      category_id: [null, Validators.required],
      short_description: [''],
      full_description: [''],
      venue_name: [''],
      address_line1: [''],
      city: [''],
      state_region: [''],
      postcode: [''],
      start_datetime: ['', Validators.required],
      end_datetime: ['', Validators.required],
      goal_amount: [0],
      image_url: [''],
    });
  }

  // init loading events/organisations/categories
  ngOnInit() {
    this.getEvents();
    this.getOrganisations();
    this.getCategories();
  }

  // get all events
  getEvents() {
    this.apiService.getAllEvents({ status: 'all' }).subscribe(
      (res: any) => {
        this.events = res
      },
      () => {
        this.errorMessage = 'Failed to load events'
      }
    );
  }

  // organisations
  getOrganisations() {
    this.apiService.getAllOrganisations().subscribe(
      (res: any) => {
        this.organisations = res
      },
      () => {
        this.errorMessage = 'Failed to load organisations'
      }
    );
  }

  // get categories
  getCategories() {
    this.apiService.getAllCategories().subscribe(
      (res: any) => {
        this.categories = res
      },
      () => {
        this.errorMessage = 'Failed to load categories'
      }
    );
  }

  openAddDialog() {
    this.form.reset({
      goal_amount: 0
    });
    this.isEditing = false;
    this.errorMessage = '';
    this.showDialog = true;
  }

  openEditDialog(event: any) {
    // Convert datetime to local string format for input
    const start = event.start_datetime ? new Date(event.start_datetime).toISOString().slice(0,16) : '';
    const end = event.end_datetime ? new Date(event.end_datetime).toISOString().slice(0,16) : '';
    this.form.patchValue({ ...event, start_datetime: start, end_datetime: end });
    this.selectedEventId = event.id;
    this.isEditing = true;
    this.errorMessage = '';
    this.showDialog = true;
  }

  deleteEvent(id: number) {
    // delete confirm
    if (confirm('Are you sure to delete this event?')) {
      this.apiService.deleteEvent(id).subscribe(
        () => {
          this.getEvents()
        },
        (error) => {
          // 400 represents that the current event has registration information and cannot be deleted
          if (error.status === 400) {
            alert(error.error?.message)
          } else {
            this.errorMessage = 'Failed to delete event'
          }
        }
      );
    }
  }

  saveEvent() {
    // Mark all fields as visited
    this.form.markAllAsTouched();

    // Check if the form is valid
    if (this.form.invalid) return;

    const data = { ...this.form.value };

    // convert goal_amount to number
    data.goal_amount = Number(data.goal_amount);

    // call update or add by isEditing flag
    if (this.isEditing) {
      this.apiService.updateEvent(this.selectedEventId!, data).subscribe(
        () => {
          this.form.reset();
          this.isEditing=false;
          this.showDialog=false;
          this.getEvents();
        },
        () => {
          this.errorMessage='Failed to update event'
        }
      );
    } else {
      this.apiService.addEvent(data).subscribe(
        () => {
          this.form.reset();
          this.showDialog=false;
          this.getEvents();
        },
        () => {
          this.errorMessage='Failed to create event'
        }
      );
    }
  }
}
