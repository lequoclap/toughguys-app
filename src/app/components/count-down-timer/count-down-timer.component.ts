import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-count-down-timer',
  templateUrl: './count-down-timer.component.html',
  styleUrls: ['./count-down-timer.component.scss']
})
export class CountDownTimerComponent {

  @Input() endDate!: string;

  isOver = false;
  date: any;
  now: any;

  targetTime: any = '';
  difference!: number;
  months: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  currentTime: any = '';

  @ViewChild('days', { static: true }) days!: ElementRef;
  @ViewChild('hours', { static: true }) hours!: ElementRef;
  @ViewChild('minutes', { static: true }) minutes!: ElementRef;
  @ViewChild('seconds', { static: true }) seconds!: ElementRef;

  ngOnInit() {

    let targetDate: any = new Date(this.endDate);
    this.targetTime = targetDate.getTime()

    this.currentTime = `${this.months[targetDate.getMonth()]
      } ${targetDate.getDate()}, ${targetDate.getFullYear()}`;

  }

  ngAfterViewInit() {
    setInterval(() => {
      this.tickTock();
      this.difference = this.targetTime - this.now;
      if (this.difference < 0) {
        this.isOver = true;
      }
      this.difference = this.difference / (1000 * 60 * 60 * 24);
      !isNaN(this.days.nativeElement.innerText)
        ? (this.days.nativeElement.innerText = Math.max(Math.floor(this.difference), 0))
        : (this.days.nativeElement.innerHTML = `<img src="https://i.gifer.com/VAyR.gif" />`);
    }, 1000);
  }

  tickTock() {
    if (!this.isOver) {
      this.date = new Date();
      this.now = this.date.getTime();
      this.days.nativeElement.innerText = Math.floor(this.difference);
      this.hours.nativeElement.innerText = 23 - this.date.getHours();
      this.minutes.nativeElement.innerText = 60 - this.date.getMinutes();
      this.seconds.nativeElement.innerText = 60 - this.date.getSeconds();
    } else {
      this.days.nativeElement.innerText = 0;
      this.hours.nativeElement.innerText = 0;
      this.minutes.nativeElement.innerText = 0;
      this.seconds.nativeElement.innerText = 0;
    }

  }
}
