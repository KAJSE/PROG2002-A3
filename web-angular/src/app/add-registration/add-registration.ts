import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { ApiService } from '../api-service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import {getEventStatus, statusChip} from '../common';

@Component({
  selector: 'app-add-registration',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-registration.html',
  styleUrl: './add-registration.css'
})
export class AddRegistration {
  event: any;
  error = '';
  registrationForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  eventId: number | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+]{7,15}$/)]],
      donation: [null, [Validators.required, Validators.min(1)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
    });
    this.route.params.subscribe(params => {
      this.eventId = params['id']
      // get event detail by id
      this.apiService.getEventById(params['id']).subscribe((event: any) => {
        this.event = event;
      }, error => {
        this.error = 'Failed to load event'
      })
    })
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      this.successMessage = '';
      return;
    }

    const { name, email, phone, donation, quantity } = this.registrationForm.value

    const body = {
      attendee_name: name,
      attendee_email: email,
      contact_phone: phone,
      unit_price: donation,
      quantity: quantity,
    }

    this.apiService.addRegistration(this.eventId || 0, body).subscribe({
      next: (res) => {
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        this.registrationForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Failed to register. Please try again.';
        this.successMessage = '';
      }
    });
  }

  get f(): any {
    return this.registrationForm.controls;
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
