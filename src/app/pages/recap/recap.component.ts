import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SPORT_WEIGHT_MAP } from 'src/app/const';
import { Athlete } from 'src/app/datatypes/APIDataType';
import { SportType } from 'src/app/enum';
import { AthleteService } from 'src/app/services/athlete.service';
import { faCrown, faPersonBiking, faPersonHiking, faPersonSkiing, faPersonSwimming, faRunning, faSnowboarding, faSync, faTrophy, faPoop } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { config } from 'src/app/config';
import { CHALLENGES } from 'src/app/challenges';

@Component({
  selector: 'app-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.scss']
})
export class RecapComponent {

  public athletesData: Athlete[] = [];
  public errorMessage = '';
  public totalDistance = 0;
  public countdownText = '';
  public isSyncing = false;
  public isHardSyncing = false;

  public challenge: any = {};
  currentYear = 2024;

  faRide = faPersonBiking;
  faHike = faPersonHiking;
  faSnowboard = faSnowboarding;
  faRun = faRunning;
  faSwim = faPersonSwimming;
  faAlpineSki = faPersonSkiing;
  faCrown = faCrown;
  faTrophy = faTrophy;
  faSync = faSync;
  faPoop = faPoop;

  public progressMap = new Map();
  public progress = {
    ride: 0,
    snowboard: 0,
    hike: 0,
    run: 0,
    swim: 0,
    alpineSki: 0,
  }

  public isAdmin = false;

  constructor(
    private cookieService: CookieService,
    private athleteService: AthleteService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.isAdmin = this.cookieService.get(config.cookie.athleteId) == config.adminId;

    if (!this.cookieService.get(config.cookie.athleteId) || !this.cookieService.get(config.cookie.athleteId)) {
      this.router.navigate(['/login']);
    }
    console.log("asdasd")
    this.route.queryParams.subscribe(params => {
      this.currentYear = params['year'] || new Date().getFullYear();
      this.challenge = {
        start: this.currentYear + '-01-01 00:00:00',
        end: this.currentYear + '-12-31 23:59:59',
      }


    })
    this.getRecap();
  }

  onSync(): void {
    this.isSyncing = true;
    //sync
    this.athleteService.syncAthleteData().subscribe({
      // sync data
      next: (res) => {
        this.errorMessage = res.message;
        // getrecap again
        console.log(res)
        console.log(res.status)
        if (res.status == "success") {
          this.getRecap();
        }

      },
      error: (error) => {
        console.error(error)
        this.errorMessage = 'Can not sync data! ' + error;
      },
    }).add(() => {
      //finally
      this.isSyncing = false;
    })
  }


  onClickPreviousChallenge(): void {
    this.router.navigate([], { queryParams: { year: this.currentYear - 1 } }).then(() => {
      window.location.reload();
    })
  }
  onClickNextChallenge(): void {
    this.router.navigate([], { queryParams: { year: this.currentYear + 1 } }).then(() => {
      window.location.reload();
    });
  }



  private getRecap(): void {
    // clear map
    this.progressMap.clear();
    // load the recap
    console.log("load athlete data 1")
    this.athleteService.getDashboardData(this.challenge.start, this.challenge.end).subscribe({
      next: (res) => {
        this.athletesData = res.data;

        //adjust data
        this.athletesData.forEach((item) => {
          // init athlete total distance
          item.totalDistance = 0
          item.totalNewDistance = 0

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

            // athletes total distance
            item.totalDistance += activity.distance;

            // athletes total new distance
            item.totalNewDistance += activity.newDistance * SPORT_WEIGHT_MAP.get(activity.sportType)!;

            activity.distance = Math.round(activity.distance / 100) / 10;
          })
        })
        // ranking by total distance
        this.athletesData.sort((a, b) => b.totalDistance - a.totalDistance);

        this.totalDistance = Math.floor(this.totalDistance / 1000);
        this.progressMap = this.progressMap;

        this.progress = {
          ride: this.progressMap.get(SportType.Ride) / 1000 / this.challenge.goal * 100,
          snowboard: this.progressMap.get(SportType.Snowboard) / 1000 / this.challenge.goal * 100,
          hike: this.progressMap.get(SportType.Hike) / 1000 / this.challenge.goal * 100,
          run: this.progressMap.get(SportType.Run) / 1000 / this.challenge.goal * 100,
          swim: this.progressMap.get(SportType.Swim) / 1000 / this.challenge.goal * 100,
          alpineSki: this.progressMap.get(SportType.AlpineSki) / 1000 / this.challenge.goal * 100,
        }

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
