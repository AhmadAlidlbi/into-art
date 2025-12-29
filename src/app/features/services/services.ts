import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SERVICES, Service } from './services/services.data';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.html',
  styleUrls: ['./services.scss'],
})
export class ServicesPage {
  @Input() brandName = 'IntoArt';
  services: Service[] = SERVICES;
}
