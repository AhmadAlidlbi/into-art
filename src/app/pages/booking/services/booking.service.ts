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
    'https://script.google.com/macros/s/AKfycbzlZNGBkiRpD4-ZiFVJ9jl2jyEOpcG0692NYnhWOkd3y8FxWBnDqL_8TlIUgcTpQgDm/exec';

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
