import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AthleteService } from 'src/app/services/athlete.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public athleteData: any[] = [];
  public errorMessage = 'This is a test message';

  constructor(
    private athleteService: AthleteService,
    private router: Router) {
  }

  ngOnInit(): void {
    console.log("this is on init");
    // load the dashboard
    console.log("load athlete data")
    this.athleteService.getDashboardData('2022-12-01').subscribe({
      next: (res) => {
        this.athleteData = res.data
      },
      error: (error) => {
        console.error(error)
        this.errorMessage = 'Can not load data! ' + error;
        //redirect to login
        this.router.navigate(['/login']);
      }
    })
  }

  onSync(): void {
    //sync
    this.athleteService.syncAthleteData().subscribe({
      // sync data
      next: (res) => {
        this.errorMessage = res.message;
        console.log(res)
        // getDashboard again

      },
      error: (error) => {
        console.error(error)
        this.errorMessage = 'Can not sync data! ' + error;
      }
    })
  }


}
