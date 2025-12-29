import { Injectable } from '@angular/core';

export type ConsultationPayload = {
  fullName: string;
  phone: string;
  email?: string | null;
  area?: string | null;
  propertyType: 'Villa' | 'Apartment' | 'Room' | 'Office' | 'Other';
  preferredDate: string;  // yyyy-mm-dd
  preferredHour: string;  // HH:mm
  message?: string | null;
  contactPreference: 'WhatsApp' | 'Call' | 'Email';
};

@Injectable({ providedIn: 'root' })
export class BookingService {
  async submitConsultation(payload: ConsultationPayload): Promise<{ ok: boolean; id?: string }> {
    console.log('[Consultation Submission]', payload);

    await new Promise((r) => setTimeout(r, 650));

    return { ok: true, id: crypto?.randomUUID?.() ?? `${Date.now()}` };
  }
}
