import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ApiService} from '../../api-service';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  categories: any[] = [];
  showDialog = false;
  isEditing = false;
  selectedCategoryId: number | null = null;
  form: FormGroup;
  errorMessage = '';

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    // create form group, add Validators to name field
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
    });
  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.apiService.getAllCategories().subscribe((categories: any) => {
      this.categories = categories;
    }, error => {
      this.errorMessage = 'Failed to load categories'
    })
  }

  // open dialog
  openAddDialog() {
    this.form.reset();
    this.isEditing = false;
    this.errorMessage = '';
    this.showDialog = true;
  }

  // open dialog and fill the form
  openEditDialog(category: any) {
    this.form.patchValue(category);
    this.selectedCategoryId = category.id;
    this.isEditing = true;
    this.errorMessage = '';
    this.showDialog = true;
  }

  edit(cat: any) {
    this.form.patchValue(cat);
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure to delete this category?')) {
      this.apiService.deleteCategory(id).subscribe(() => {
        this.getCategories()
      }, error => {
        this.errorMessage = 'Failed to delete category'
      })
    }
  }

  saveCategory() {
    // Mark all fields as visited
    this.form.markAllAsTouched();

    // Check if the form is valid
    if (this.form.invalid) return;

    const data = this.form.value;
    console.log(data)
    if (this.isEditing) {
      this.apiService.updateCategory(this.selectedCategoryId!, data).subscribe(() => {
        this.form.reset();
        this.isEditing = false;
        this.showDialog = false;
        this.getCategories();
      }, error => {
        this.errorMessage = 'Failed to update category'
      });
    } else {
      this.apiService.addCategory(data).subscribe(() => {
        this.form.reset();
        this.showDialog = false;
        this.getCategories();
      }, error => {
        this.errorMessage = 'Failed to create category'
      });
    }
  }
}
