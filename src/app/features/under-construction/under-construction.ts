import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-under-construction',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './under-construction.html',
  styleUrls: ['./under-construction.scss'],
})
export class UnderConstructionPage {
  @Input() title = 'Under Construction';
  @Input() message =
    'This page is currently being prepared. Please check back soon.';

  // Optional: show a button to go back home
  homePath = '/';
}
