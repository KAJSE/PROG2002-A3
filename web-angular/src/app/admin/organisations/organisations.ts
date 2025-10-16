import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api-service';


@Component({
  selector: 'app-organisations',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organisations.html',
  styleUrl: './organisations.css'
})
export class Organisations implements OnInit {
  organisations: any[] = [];
  showDialog = false;
  isEditing = false;
  selectedOrganisationId: number | null = null;
  form: FormGroup;
  errorMessage = '';

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      mission_text: [''],
      contact_email: [''],
      contact_phone: [''],
      website_url: [''],
    });
  }

  ngOnInit() {
    this.getOrganisations();
  }


  // get organisations
  getOrganisations() {
    this.apiService.getAllOrganisations().subscribe((orgs: any) => {
      this.organisations = orgs;
    }, error => {
      this.errorMessage = 'Failed to load organisations';
    });
  }

  openAddDialog() {
    this.form.reset({ is_active: 1 });
    this.isEditing = false;
    this.errorMessage = '';
    this.showDialog = true;
  }

  openEditDialog(org: any) {
    this.form.patchValue(org);
    this.selectedOrganisationId = org.id;
    this.isEditing = true;
    this.errorMessage = '';
    this.showDialog = true;
  }

  deleteOrganisation(id: number) {
    // delete confirm
    if (confirm('Are you sure to delete this organisation?')) {
      this.apiService.deleteOrganisation(id).subscribe(() => {
        this.getOrganisations();
      }, error => {
        this.errorMessage = 'Failed to delete organisation';
      });
    }
  }

  saveOrganisation() {
    // Mark all fields as visited
    this.form.markAllAsTouched();

    // Check if the form is valid
    if (this.form.invalid) return;

    const data = this.form.value;
    // call update or add by isEditing flag
    if (this.isEditing) {
      this.apiService.updateOrganisation(this.selectedOrganisationId!, data).subscribe(() => {
        this.form.reset();
        this.isEditing = false;
        this.showDialog = false;
        this.getOrganisations();
      }, error => {
        this.errorMessage = 'Failed to update organisation';
      });
    } else {
      this.apiService.addOrganisation(data).subscribe(() => {
        this.form.reset();
        this.showDialog = false;
        this.getOrganisations();
      }, error => {
        this.errorMessage = 'Failed to create organisation';
      });
    }
  }
}
