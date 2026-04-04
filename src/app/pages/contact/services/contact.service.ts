import { Injectable } from '@angular/core';

export interface ContactPayload {
  fullName: string;
  phone: string;
  email: string;
  subject: string | null;
  message: string;
}

interface Web3FormsResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly endpoint = 'https://api.web3forms.com/submit';
  private readonly accessKey = '4e41aef6-d3d3-4866-aef1-3db8ce543b6b';

  async submit(payload: ContactPayload): Promise<{ ok: boolean; message?: string }> {
    const formData = new FormData();

    formData.append('access_key', this.accessKey);
    formData.append('name', payload.fullName);
    formData.append('email', payload.email.trim());
    formData.append('phone', payload.phone.trim());
    formData.append('subject', payload.subject?.trim() || 'New Contact Form Submission');
    formData.append('message', payload.message);

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    });

    const data = (await response.json()) as Web3FormsResponse;

    return {
      ok: !!data.success,
      message: data.message,
    };
  }
}