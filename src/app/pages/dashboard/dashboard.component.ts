import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SPORT_WEIGHT_MAP, totalDistanceThreshold } from 'src/app/const';
import { Athlete } from 'src/app/datatypes/APIDataType';
import { SportType } from 'src/app/enum';
import { AthleteService } from 'src/app/services/athlete.service';
import { 
  faCrown, 
  faPersonBiking, 
  faPersonHiking, 
  faPersonSkiing, 
  faPersonSwimming, 
  faRunning, 
  faSnowboarding, 
  faSync, 
  faTrophy, 
  faPoop,
  faChevronLeft,
  faChevronRight,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { config } from 'src/app/config';
import { CHALLENGES } from 'src/app/challenges';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public athletesData: Athlete[] = [];
  public errorMessage = '';
  public totalDistance = 0;
  public countdownText = '';
  public isSyncing = false;
  public isHardSyncing = false;
  public challenges = CHALLENGES;

  public challenge: any = {};
  currentChallengeId = 0;
  
  // Enable mock data for development/demo
  public useMockData = true;

  // Icons
  faRide = faPersonBiking;
  faHike = faPersonHiking;
  faSnowboard = faSnowboarding;
  faRun = faRunning;
  faRunning = faRunning;
  faSwim = faPersonSwimming;
  faAlpineSki = faPersonSkiing;
  faCrown = faCrown;
  faTrophy = faTrophy;
  faSync = faSync;
  faPoop = faPoop;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

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
      // Skip redirect for mock data mode
      if (!this.useMockData) {
        this.router.navigate(['/login']);
      }
    }

    this.route.queryParams.subscribe(params => {
      this.currentChallengeId = params['id']
      // if there is a non-existing id then it will be assign to the latest challenge
      this.challenge = this.challenges.find(c => c.id == this.currentChallengeId) || this.challenges[0] as any
      this.currentChallengeId = this.challenge.id; // assign back the verified id 
    })
    
    if (this.useMockData) {
      this.loadMockData();
    } else {
      this.getDashboard();
    }
  }

  private loadMockData(): void {
    const mockAthletes: Athlete[] = [
      {
        athlete: { 
          id: '1', 
          name: 'Nguyen Van Anh', 
          imgURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nguyen' 
        },
        activities: [
          { id: '1a', sportType: SportType.Ride, distance: 1250.5, newDistance: 45.2 },
          { id: '1b', sportType: SportType.Run, distance: 380.2, newDistance: 12.5 },
          { id: '1c', sportType: SportType.Swim, distance: 42.0, newDistance: 3.2 }
        ],
        totalDistance: 0,
        totalNewDistance: 0
      },
      {
        athlete: { 
          id: '2', 
          name: 'Tran Minh Duc', 
          imgURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tran' 
        },
        activities: [
          { id: '2a', sportType: SportType.Ride, distance: 980.3, newDistance: 32.1 },
          { id: '2b', sportType: SportType.Hike, distance: 156.8, newDistance: 8.5 },
          { id: '2c', sportType: SportType.Run, distance: 245.6, newDistance: 15.3 }
        ],
        totalDistance: 0,
        totalNewDistance: 0
      },
      {
        athlete: { 
          id: '3', 
          name: 'Le Hoang Nam', 
          imgURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hoang' 
        },
        activities: [
          { id: '3a', sportType: SportType.Run, distance: 520.4, newDistance: 22.3 },
          { id: '3b', sportType: SportType.Swim, distance: 28.5, newDistance: 2.1 },
          { id: '3c', sportType: SportType.Snowboard, distance: 85.0, newDistance: 0 }
        ],
        totalDistance: 0,
        totalNewDistance: 0
      },
      {
        athlete: { 
          id: '4', 
          name: 'Pham Thu Ha', 
          imgURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pham' 
        },
        activities: [
          { id: '4a', sportType: SportType.Ride, distance: 720.1, newDistance: 28.5 },
          { id: '4b', sportType: SportType.Run, distance: 180.5, newDistance: 9.8 },
          { id: '4c', sportType: SportType.AlpineSki, distance: 120.0, newDistance: 0 }
        ],
        totalDistance: 0,
        totalNewDistance: 0
      },
      {
        athlete: { 
          id: '5', 
          name: 'Vo Quoc Bao', 
          imgURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bao' 
        },
        activities: [
          { id: '5a', sportType: SportType.Ride, distance: 650.8, newDistance: 18.2 },
          { id: '5b', sportType: SportType.Hike, distance: 98.3, newDistance: 5.6 }
        ],
        totalDistance: 0,
        totalNewDistance: 0
      },
      {
        athlete: { 
          id: '6', 
          name: 'Dang Kim Ngan', 
          imgURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ngan' 
        },
        activities: [
          { id: '6a', sportType: SportType.Run, distance: 420.5, newDistance: 16.7 },
          { id: '6b', sportType: SportType.Swim, distance: 35.2, newDistance: 2.8 }
        ],
        totalDistance: 0,
        totalNewDistance: 0
      },
      {
        athlete: { 
          id: '7', 
          name: 'Bui Thanh Tung', 
          imgURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tung' 
        },
        activities: [
          { id: '7a', sportType: SportType.Ride, distance: 480.2, newDistance: 15.3 },
          { id: '7b', sportType: SportType.Run, distance: 125.8, newDistance: 7.2 },
          { id: '7c', sportType: SportType.Hike, distance: 65.5, newDistance: 4.1 }
        ],
        totalDistance: 0,
        totalNewDistance: 0
      },
      {
        athlete: { 
          id: '8', 
          name: 'Hoang My Linh', 
          imgURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linh' 
        },
        activities: [
          { id: '8a', sportType: SportType.Swim, distance: 52.8, newDistance: 4.2 },
          { id: '8b', sportType: SportType.Run, distance: 285.3, newDistance: 11.5 }
        ],
        totalDistance: 0,
        totalNewDistance: 0
      }
    ];

    // Process mock data similar to real data
    this.totalDistance = 0;
    this.progressMap.clear();
    
    mockAthletes.forEach((item) => {
      item.totalDistance = 0;
      item.totalNewDistance = 0;
      
      item.activities.forEach((activity: any) => {
        const weight = SPORT_WEIGHT_MAP.get(activity.sportType as SportType) || 1;
        const weightedDistance = activity.distance * 1000 * weight; // Convert to meters
        
        this.progressMap.set(activity.sportType, (this.progressMap.get(activity.sportType) || 0) + weightedDistance);
        this.totalDistance += weightedDistance;
        item.totalDistance += weightedDistance;
        item.totalNewDistance += activity.newDistance * 1000 * weight;
      });
    });

    mockAthletes.sort((a, b) => b.totalDistance - a.totalDistance);
    
    this.athletesData = mockAthletes;
    this.totalDistance = Math.floor(this.totalDistance / 1000);
    
    this.progress = {
      ride: (this.progressMap.get(SportType.Ride) || 0) / 1000 / this.challenge.goal * 100,
      snowboard: (this.progressMap.get(SportType.Snowboard) || 0) / 1000 / this.challenge.goal * 100,
      hike: (this.progressMap.get(SportType.Hike) || 0) / 1000 / this.challenge.goal * 100,
      run: (this.progressMap.get(SportType.Run) || 0) / 1000 / this.challenge.goal * 100,
      swim: (this.progressMap.get(SportType.Swim) || 0) / 1000 / this.challenge.goal * 100,
      alpineSki: (this.progressMap.get(SportType.AlpineSki) || 0) / 1000 / this.challenge.goal * 100,
    };
  }

  getActivityIcon(sportType: string): IconDefinition {
    const iconMap: { [key: string]: IconDefinition } = {
      'Ride': this.faRide,
      'Run': this.faRun,
      'Swim': this.faSwim,
      'Hike': this.faHike,
      'Snowboard': this.faSnowboard,
      'AlpineSki': this.faAlpineSki,
    };
    return iconMap[sportType] || this.faRun;
  }

  onSync(): void {
    this.isSyncing = true;
    this.athleteService.syncAthleteData().subscribe({
      next: (res) => {
        this.errorMessage = res.message;
        console.log(res)
        console.log(res.status)
        if (res.status == "success") {
          this.getDashboard();
        }
      },
      error: (error) => {
        console.error(error)
        this.errorMessage = 'Can not sync data! ' + error;
      },
    }).add(() => {
      this.isSyncing = false;
    })
  }

  onHardSync(): void {
    this.isHardSyncing = true;
    this.athleteService.syncAthleteData(true).subscribe({
      next: (res) => {
        this.errorMessage = res.message;
        console.log(res)
        console.log(res.status)
        if (res.status == "success") {
          this.getDashboard();
        }
      },
      error: (error) => {
        console.error(error)
        this.errorMessage = 'Can not hard sync data! ' + error;
      },
    }).add(() => {
      this.isHardSyncing = false;
    })
  }

  onClickPreviousChallenge(): void {
    if (this.currentChallengeId > 1) {
      this.router.navigate([], { queryParams: { id: this.currentChallengeId - 1 } }).then(() => {
        window.location.reload();
      })
    }
  }

  onClickNextChallenge(): void {
    if (this.currentChallengeId < this.challenges.length) {
      this.router.navigate([], { queryParams: { id: this.currentChallengeId + 1 } }).then(() => {
        window.location.reload();
      });
    }
  }

  private getDashboard(): void {
    this.progressMap.clear();
    console.log("load athlete data")
    this.athleteService.getDashboardData(this.challenge.start, this.challenge.end).subscribe({
      next: (res) => {
        this.athletesData = res.data;

        this.athletesData.forEach((item) => {
          item.totalDistance = 0
          item.totalNewDistance = 0

          item.activities = item.activities.filter((activity) => {
            return (Object.values(SportType).includes(activity.sportType))
          })
          item.activities.forEach((activity) => {
            if (activity.sportType === SportType.VirtualRide) {
              activity.sportType = SportType.Ride;
            }
            if (activity.sportType === SportType.TrailRun) {
              activity.sportType = SportType.Run;
            }
            activity.distance = activity.distance as number * SPORT_WEIGHT_MAP.get(activity.sportType)!;
            this.progressMap.set(activity.sportType, (this.progressMap.get(activity.sportType) || 0) + activity.distance)
            this.totalDistance += activity.distance;
            item.totalDistance += activity.distance;
            item.totalNewDistance += activity.newDistance * SPORT_WEIGHT_MAP.get(activity.sportType)!;
            activity.distance = Math.round(activity.distance / 100) / 10;
          })

          const consolidatedActivities = new Map<string, any>();
          item.activities.forEach((activity) => {
            if (consolidatedActivities.has(activity.sportType)) {
              const existing = consolidatedActivities.get(activity.sportType);
              existing.distance += activity.distance;
              existing.newDistance += activity.newDistance;
            } else {
              consolidatedActivities.set(activity.sportType, { ...activity });
            }
          });
          item.activities = Array.from(consolidatedActivities.values());
        })
        
        this.athletesData = this.athletesData.filter(athlete => athlete.totalDistance > totalDistanceThreshold);
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
        if (e.status == 401 || e.status == 403 || e.status == 500) {
          this.router.navigate(['/login']);
        }
      }
    })
  }
}
