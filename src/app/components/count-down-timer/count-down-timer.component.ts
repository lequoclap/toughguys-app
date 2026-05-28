import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-count-down-timer',
  templateUrl: './count-down-timer.component.html',
  styleUrls: ['./count-down-timer.component.scss']
})
export class CountDownTimerComponent implements OnChanges, OnDestroy {

  @Input() endDate!: string;

  isOver = false;
  targetTime = 0;
  countdown = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  };
  private intervalId: ReturnType<typeof setInterval> | null = null;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['endDate']?.currentValue) {
      this.startCountdown();
    }
  }

  ngOnDestroy(): void {
    this.clearCountdownInterval();
  }

  private startCountdown(): void {
    const targetDate = this.parseDate(this.endDate);
    this.targetTime = targetDate.getTime();
    this.currentTime = `${this.months[targetDate.getMonth()]} ${targetDate.getDate()}, ${targetDate.getFullYear()}`;

    this.clearCountdownInterval();
    this.updateCountdown();
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }

  private updateCountdown(): void {
    const diffMs = this.targetTime - Date.now();

    if (diffMs <= 0) {
      this.isOver = true;
      this.countdown = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      };
      this.clearCountdownInterval();
      return;
    }

    this.isOver = false;
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    this.countdown = {
      days: this.pad(days),
      hours: this.pad(hours),
      minutes: this.pad(minutes),
      seconds: this.pad(seconds)
    };
  }

  private clearCountdownInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private parseDate(value: string): Date {
    const normalized = value.replace(' ', 'T');
    let parsed = new Date(normalized);

    if (isNaN(parsed.getTime())) {
      parsed = new Date(value);
    }

    if (isNaN(parsed.getTime())) {
      return new Date();
    }

    return parsed;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
