// src/app/pages/result/result.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SubmissionResult } from '../../models';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  standalone: true,
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatProgressBarModule]
})
export class ResultPage {
  result: SubmissionResult | null = null;
  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.result = (nav?.extras?.state as { result: SubmissionResult })?.result ?? null;
  }
}
