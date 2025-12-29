import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SERVICES, Service } from '../../services/services.data';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-details.html',
  styleUrls: ['./service-details.scss'],
})
export class ServiceDetailsPage {
  constructor(private route: ActivatedRoute) {}

  service = computed<Service | null>(() => {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    return SERVICES.find((s) => s.slug === slug) ?? null;
  });
}
