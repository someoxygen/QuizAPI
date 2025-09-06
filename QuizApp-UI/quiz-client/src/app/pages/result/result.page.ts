import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubmissionResult } from '../../models';

@Component({
  standalone: true,
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.css'],
  imports: [CommonModule]
})
export class ResultPage {
  result: SubmissionResult | null = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.result = (nav?.extras?.state as { result: SubmissionResult })?.result ?? null;
  }
}
