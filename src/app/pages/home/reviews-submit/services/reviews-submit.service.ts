import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ReviewPayload {
  clientName: string;
  rating: string;
  reviewText: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewsSubmitService {
  private endpoint =
    'https://script.google.com/macros/s/AKfycbweEwV2AfGz0EtxZRyS7jRCC-C2RWWw9jISsUwLaq_uTLBG9atPktUP3MjoXbyXvOns/exec';

  constructor(private http: HttpClient) {}

  submitReview(payload: ReviewPayload) {
    const formData = new FormData();

    formData.append('clientName', payload.clientName);
    formData.append('rating', payload.rating);
    formData.append('reviewText', payload.reviewText);

    return firstValueFrom(
      this.http.post<{
        ok: boolean;
        error?: string;
      }>(this.endpoint, formData)
    );
  }
}
