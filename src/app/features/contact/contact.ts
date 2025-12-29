import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactPayload, ContactService } from './services/contact.service';

type ContactForm = FormGroup<{
  fullName: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
  subject: FormControl<string>;
  message: FormControl<string>;
  contactPreference: FormControl<'WhatsApp' | 'Call' | 'Email'>;
}>;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class ContactPage {
  // Config (can move to env/config later)
  whatsappNumber = '96550000000';
  whatsappDisplay = '+965 5000 0000';

  phoneDisplay = '+965 5000 0000';
  phoneDial = '+96550000000';

  emailAddress = 'info@intoartkw.com';

  isSubmitting = signal(false);
  submitError = signal<string | null>(null);
  submittedOk = signal(false);

  form!: ContactForm;

  constructor(private fb: FormBuilder, private contact: ContactService) {
    this.form = this.fb.nonNullable.group({
      fullName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      phone: this.fb.nonNullable.control('', [Validators.pattern(/^[0-9+\-\s]{6,20}$/)]),
      email: this.fb.nonNullable.control('', [Validators.email]),
      subject: this.fb.nonNullable.control(''),
      message: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
      contactPreference: this.fb.nonNullable.control<'WhatsApp' | 'Call' | 'Email'>('WhatsApp', [
        Validators.required,
      ]),
    }) as ContactForm;
  }

  // Derived hrefs (used in template micro-links)
  get whatsAppHref(): string {
    return `https://wa.me/${this.whatsappNumber}`;
  }

  get telHref(): string {
    const cleaned = this.phoneDial.replace(/[^\d+]/g, '');
    return `tel:${cleaned}`;
  }

  get mailtoHref(): string {
    return `mailto:${this.emailAddress}`;
  }

  isInvalid(name: keyof ContactForm['controls']): boolean {
    const c = this.form.controls[name];
    return !!(c.touched && c.invalid);
  }

  openWhatsApp(): void {
    window.open(this.whatsAppHref, '_blank', 'noopener,noreferrer');
  }

  callNow(): void {
    window.open(this.telHref, '_self');
  }

  sendEmail(): void {
    window.open(this.mailtoHref, '_self');
  }

  private toPayload(): ContactPayload {
    const v = this.form.getRawValue();
    return {
      fullName: v.fullName.trim(),
      phone: v.phone.trim() || null,
      email: v.email.trim() || null,
      subject: v.subject.trim() || null,
      message: v.message.trim(),
      contactPreference: v.contactPreference,
    };
  }

  async submit(): Promise<void> {
    this.submitError.set(null);
    this.submittedOk.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitError.set('Please review the required fields and try again.');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const payload = this.toPayload();
      const res = await this.contact.submit(payload);

      if (!res.ok) {
        this.submitError.set('Submission failed. Please try again.');
        return;
      }

      this.submittedOk.set(true);
      this.form.reset({
        fullName: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
        contactPreference: 'WhatsApp',
      });
    } catch {
      this.submitError.set('Something went wrong. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
