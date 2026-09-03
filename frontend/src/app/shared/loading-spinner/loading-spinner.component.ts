import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="visible">
      <div class="spinner"></div>
      <p class="loading-text">A carregar...</p>
    </div>
  `,
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  visible = true;
}