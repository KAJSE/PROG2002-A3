import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  SERVER_URL = 'http://localhost:3000'

  constructor(private httpClient: HttpClient) {
  }

  getAllEvents(params: any) {
    return this.httpClient.get(`${this.SERVER_URL}/events`, {
      params
    })
  }

  addEvent(data: any) {
    return this.httpClient.post(`${this.SERVER_URL}/events`, data);
  }

  updateEvent(id: number, data: any) {
    return this.httpClient.put(`${this.SERVER_URL}/events/${id}`, data);
  }

  deleteEvent(id: number) {
    return this.httpClient.delete(`${this.SERVER_URL}/events/${id}`);
  }

  getAllCategories() {
    return this.httpClient.get(`${this.SERVER_URL}/categories`)
  }

  getEventById(eventId: number) {
    return this.httpClient.get(`${this.SERVER_URL}/events/${eventId}`)
  }

  addRegistration(eventId: number, body: any) {
    return this.httpClient.post(`${this.SERVER_URL}/events/${eventId}/register`, body)
  }

  addCategory(data: any) {
    return this.httpClient.post(`${this.SERVER_URL}/categories`, data)
  }

  updateCategory(categoryId: number, data: any) {
    return this.httpClient.put(`${this.SERVER_URL}/categories/${categoryId}`, data)
  }

  deleteCategory(categoryId: number) {
    return this.httpClient.delete(`${this.SERVER_URL}/categories/${categoryId}`)
  }

  getAllOrganisations() {
    return this.httpClient.get(`${this.SERVER_URL}/organisations`);
  }

  addOrganisation(data: any) {
    return this.httpClient.post(`${this.SERVER_URL}/organisations`, data);
  }

  updateOrganisation(id: number, data: any) {
    return this.httpClient.put(`${this.SERVER_URL}/organisations/${id}`, data);
  }

  deleteOrganisation(id: number) {
    return this.httpClient.delete(`${this.SERVER_URL}/organisations/${id}`);
  }
}
