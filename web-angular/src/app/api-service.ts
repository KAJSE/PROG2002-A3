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

  getAllCategories() {
    return this.httpClient.get(`${this.SERVER_URL}/categories`)
  }

  getEventById(eventId: number) {
    return this.httpClient.get(`${this.SERVER_URL}/events/${eventId}`)
  }

  addRegistration(eventId: number, body: any) {
    return this.httpClient.post(`${this.SERVER_URL}/events/${eventId}/register`, body)
  }
}
