import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SPORT_WEIGHT_MAP } from 'src/app/const';
import { Activity, Athlete } from 'src/app/datatypes/APIDataType';
import { SportType } from 'src/app/enum';
import { AthleteService } from 'src/app/services/athlete.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public athletesData: Athlete[] = [];
  public errorMessage = '';
  public totalDistance = 0;
  public totalDistanceStr = '';

  constructor(
    private athleteService: AthleteService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.getDashboard();
  }

  onSync(): void {
    //sync
    this.athleteService.syncAthleteData().subscribe({
      // sync data
      next: (res) => {
        this.errorMessage = res.message;
        console.log(res)
        // getDashboard again
        if (res.statusCode == 'success') {
          this.getDashboard();
        }

      },
      error: (error) => {
        console.error(error)
        this.errorMessage = 'Can not sync data! ' + error;
      }
    })
  }

  private getDashboard(): void {
    // load the dashboard
    console.log("load athlete data")
    this.athleteService.getDashboardData('2022-12-01').subscribe({
      next: (res) => {
        this.athletesData = res.data;

        //adjust data
        this.athletesData.forEach((item) => {
          //filter to remove unqualified SportType
          item.activities = item.activities.filter((activity) => {
            return (Object.values(SportType).includes(activity.sportType))
          })
          item.activities.forEach((activity) => {
            // add weight
            activity.distance = activity.distance as number * SPORT_WEIGHT_MAP.get(activity.sportType)!;
            // count total distance
            this.totalDistance += activity.distance;
            activity.distance = Math.floor(activity.distance / 1000);
          })
        })

        this.totalDistanceStr = new Intl.NumberFormat('en-US').format(this.totalDistance / 1000);

        // rank athlete by distance
        //TODO
      },
      error: (error) => {
        console.error(error)
        this.errorMessage = 'Can not load data! ' + error;
        //redirect to login
        this.router.navigate(['/login']);
      }
    })

  }

}
