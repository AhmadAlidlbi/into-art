import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ConsultationPayload {
  fullName: string;
  phone: string;

  buildingCondition: string;
  buildingConditionOther: string | null;

  designPackage: string;

  preferredDate: string;
  preferredHour: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private endpoint =
    'https://script.google.com/macros/s/AKfycbxUmN9Gwxdr1S46r7eOEUER0bJ-xIJLx4hOO97Ee8Ba79WJMS8_jn8wAlkc7eTXtpo8/exec';

  constructor(private http: HttpClient) {}

  submitConsultation(payload: ConsultationPayload) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return firstValueFrom(
      this.http.post<{
        ok: boolean;
        error?: string; // ✅ optional
      }>(this.endpoint, formData)
    );
  }

  getBookedSlots(date: string) {
    return firstValueFrom(
      this.http.get<{
        ok: boolean;
        bookedSlots: string[];
      }>(`${this.endpoint}?date=${date}`)
    );
  }
}
