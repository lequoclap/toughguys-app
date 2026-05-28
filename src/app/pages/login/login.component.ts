import { Component } from '@angular/core';
import { config } from 'src/app/config';
import { faTrophy, faChartLine, faBolt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  faTrophy = faTrophy;
  faChartLine = faChartLine;
  faBolt = faBolt;

  constructor() {
    console.log("Login page loaded")
  }

  connectStrava(): void {
    window.location.href = config.stravaAuthURL;
  }
}
