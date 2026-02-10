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
    'https://script.google.com/macros/s/AKfycbw9wV538G75f9JzgVTcxmVuTY2hA1ADDcWbXc6_fwSUVNNs9Hfqj_ho1-8vvLWjLJU6/exec';

  constructor(private http: HttpClient) {}

  submitConsultation(payload: ConsultationPayload) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return firstValueFrom(
      this.http.post<{ ok: boolean }>(this.endpoint, formData)
    );
  }
}
