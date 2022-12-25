import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SPORT_WEIGHT_MAP } from 'src/app/const';
import { Activity, Athlete } from 'src/app/datatypes/APIDataType';
import { SportType } from 'src/app/enum';
import { AthleteService } from 'src/app/services/athlete.service';
import { faBicycle, faPersonHiking, faPersonSwimming, faRunning, faSnowboarding } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public athletesData: Athlete[] = [];
  public errorMessage = '';
  public totalDistance = 0;
  public challengeGoal = 1000;
  public challengeName = "Chao xuan 2023";

  faRide = faBicycle;
  faHike = faPersonHiking;
  faSnowboard = faSnowboarding;
  faRun = faRunning;
  faSwim = faPersonSwimming;

  public progressMap = new Map();
  public progress = {
    ride: 0,
    snowboard: 0,
    hike: 0,
    run: 0,
    swim: 0,
  }

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
        if (res.statusCode == 200) {
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

            // accumulate to map
            this.progressMap.set(activity.sportType, (this.progressMap.get(activity.sportType) || 0) + activity.distance)

            // count total distance
            this.totalDistance += activity.distance;
            activity.distance = Math.floor(activity.distance / 1000);
          })
        })

        this.totalDistance = Math.floor(this.totalDistance / 1000);
        this.progressMap = this.progressMap;

        this.progress = {
          ride: this.progressMap.get(SportType.Ride) / 1000 / this.challengeGoal * 100,
          snowboard: this.progressMap.get(SportType.Snowboard) / 1000 / this.challengeGoal * 100,
          hike: this.progressMap.get(SportType.Hike) / 1000 / this.challengeGoal * 100,
          run: this.progressMap.get(SportType.Run) / 1000 / this.challengeGoal * 100,
          swim: this.progressMap.get(SportType.Swim) / 1000 / this.challengeGoal * 100,
        }

        console.log(this.progress)


        // rank athlete by distance
        //TODO
      },
      error: (e: HttpErrorResponse) => {
        console.error(e)
        this.errorMessage = 'Can not load data! ';
        //redirect to login if it is unauthozied error
        if (e.status == 401 || e.status == 403 || e.status == 500) {
          this.router.navigate(['/login']);
        }

      }
    })

  }

}
