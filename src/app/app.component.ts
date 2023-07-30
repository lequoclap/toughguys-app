import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CHALLENGES } from 'src/app/challenges';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'toughguys-app';
  public logoName = ''
  public themeName = ''
  constructor(
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let currentChallengeId = params['id']
      // if there is a non-existing id then it will be assign to the latest challenge
      const challenge = CHALLENGES.find(c => c.id == currentChallengeId) || CHALLENGES[0] as any
      this.logoName = challenge.icon
      this.themeName = challenge.theme
    })

  }
}

