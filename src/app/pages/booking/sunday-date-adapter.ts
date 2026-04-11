import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class SundayFirstDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 0; // 0 = Sunday
  }
}