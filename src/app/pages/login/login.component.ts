import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor() {
    console.log("here")
  }

  /**
   * 
   */
  connectStrava(): void {
    //redirect to Strava Auth page
    window.location.href = config.stravaAuthURL;
  }


}
