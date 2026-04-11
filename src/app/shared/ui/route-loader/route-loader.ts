import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-route-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './route-loader.html',
  styleUrls: ['./route-loader.scss'],
})
export class RouteLoaderComponent {
  /** Controls visibility — bound from the parent. */
  @Input() visible = false;
}