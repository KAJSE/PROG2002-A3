import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  SERVER_URL = 'http://localhost:3000'

  constructor(private httpClient: HttpClient) {
  }

  getAllEvents() {
    return this.httpClient.get(`${this.SERVER_URL}/events?status=all`)
  }
}
