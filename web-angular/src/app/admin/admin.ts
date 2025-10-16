import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

}
