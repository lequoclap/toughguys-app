import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  public athleteData: Athlete | null = null;
  public errorMessage = '';
  public totalDistance = 0;
  public totalSports = 0;
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
  public sortedSports: Array<{sportType: string, distance: number}> = [];
  
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
    this.route.queryParams.subscribe(params => {
      // Auto-detect current year from system if not provided
      this.currentYear = params['year'] ? parseInt(params['year']) : new Date().getFullYear();
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
    this.sortedSports = [];
    this.totalSports = 0;
    // load the recap
    console.log("load athlete data 1")
    const loggedInAthleteId = this.cookieService.get(config.cookie.athleteId);
    
    this.athleteService.getDashboardData(this.challenge.start, this.challenge.end).subscribe({
      next: (res) => {
        // Get only the logged-in athlete's data
        const athlete = res.data.find((athlete) => athlete.athlete.id === loggedInAthleteId);
        
        if (athlete) {
          this.athleteData = athlete;
          
          // init athlete total distance
          this.athleteData.totalDistance = 0
          this.athleteData.totalNewDistance = 0

          //filter to remove unqualified SportType
          this.athleteData.activities = this.athleteData.activities.filter((activity) => {
            return (Object.values(SportType).includes(activity.sportType))
          })
          
          // count total activities
          this.totalSports = this.athleteData.activities.length;
          
          this.athleteData.activities.forEach((activity) => {
            this.progressMap.set(activity.sportType, (this.progressMap.get(activity.sportType) || 0) + activity.distance);

            // count total distance
            this.totalDistance += activity.distance;

            // athlete total distance
            this.athleteData!.totalDistance += activity.distance;

            // athlete total new distance
            this.athleteData!.totalNewDistance += activity.newDistance;

            activity.distance = Math.round(activity.distance / 100) / 10;
          })

          this.totalDistance = Math.floor(this.totalDistance / 1000);
          
          // Sort sports by distance (high to low) and create array
          this.sortedSports = [...this.progressMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .map((entry, index) => ({
              sportType: entry[0],
              distance: entry[1],
              rank: index + 1
            }));
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
