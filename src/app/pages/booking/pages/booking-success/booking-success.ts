import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './booking-success.html',
  styleUrls: ['./booking-success.scss'],
})
export class BookingSuccessPage {
  viewProjectsLink = {
    path: '/',
    disabled: true,
  };
}