import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { config } from 'src/app/config';
import { AthleteService } from 'src/app/services/athlete.service';

@Component({
  selector: 'app-generate-token',
  templateUrl: './generate-token.component.html',
  styleUrls: ['./generate-token.component.scss']
})
export class GenerateTokenComponent {
  private code: string = '';
  public errorMessage = ''

  constructor(private athleteService: AthleteService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {

    // get code from url
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.code = params['code'];
      }
      );

    // send request to API to generate Token and store back to Cookie
    this.athleteService.generateToken(this.code).subscribe({
      next: (res) => {
        // set expiration date = now() + 7 days
        const expiresAt = Date.parse(new Date().toLocaleDateString()) + 7 * 24 * 3600 * 1000;
        // store auth info in cookie
        this.cookieService.set(config.cookie.athleteId, res.data.athleteId, expiresAt)
        this.cookieService.set(config.cookie.accessToken, res.data.token, expiresAt)

        // delayed 2s to make sure cookies are set
        setTimeout(() => {
          console.log("Delayed for 2 seconds.");
        }, 2000)
        // redirect back to dashboard
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log(error)
        this.errorMessage = JSON.stringify(error)
      }
    }
    )
  }
}
