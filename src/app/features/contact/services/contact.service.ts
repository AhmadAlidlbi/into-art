import { Injectable } from '@angular/core';

export type ContactPayload = {
  fullName: string;
  phone?: string | null;
  email?: string | null;
  subject?: string | null;
  message: string;
  contactPreference: 'WhatsApp' | 'Call' | 'Email';
};

@Injectable({ providedIn: 'root' })
export class ContactService {
  async submit(payload: ContactPayload): Promise<{ ok: boolean; id?: string }> {
    console.log('[Contact Submission]', payload);

    await new Promise((r) => setTimeout(r, 650));

    return { ok: true, id: crypto?.randomUUID?.() ?? `${Date.now()}` };
  }
}
