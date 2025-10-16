import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {DreamBackground} from './dream-background/dream-background';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, DreamBackground],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('web-angular');
}
