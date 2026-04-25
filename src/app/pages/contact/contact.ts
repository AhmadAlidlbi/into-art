import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactPayload, ContactService } from './services/contact.service';

type ContactForm = FormGroup<{
  fullName: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
  subject: FormControl<string>;
  message: FormControl<string>;
}>;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class ContactPage {
  whatsappNumber = '96566576673';
  whatsappDisplay = '+965 6657 6673';
  emailAddress = 'info@intoakwt.com';

  get whatsAppHref(): string {
    return `https://wa.me/${this.whatsappNumber}`;
  }

  get mailtoHref(): string {
    return `mailto:${this.emailAddress}`;
  }

  isSubmitting = signal(false);
  submitError = signal<string | null>(null);
  submittedOk = signal(false);

  form!: ContactForm;

  constructor(private fb: FormBuilder, private contact: ContactService) {
    this.form = this.fb.nonNullable.group({
      fullName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      phone: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.pattern(/^[0-9+\-\s]{6,20}$/),
      ]),
      email: this.fb.nonNullable.control('', [Validators.email]),
      subject: this.fb.nonNullable.control(''),
      message: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(5)]),
    }) as ContactForm;
  }

  isInvalid(name: keyof ContactForm['controls']): boolean {
    const c = this.form.controls[name];
    return !!(c.touched && c.invalid);
  }

  private toPayload(): ContactPayload {
    const v = this.form.getRawValue();

    return {
      fullName: v.fullName.trim(),
      phone: v.phone.trim(),
      email: v.email.trim(),
      subject: v.subject.trim() || null,
      message: v.message.trim(),
    };
  }

  async submit(): Promise<void> {
    this.submitError.set(null);
    this.submittedOk.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitError.set('contact.form.errorReview');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const payload = this.toPayload();
      const res = await this.contact.submit(payload);

      if (!res.ok) {
        this.submitError.set('contact.form.errorRetry');
        return;
      }

      this.submittedOk.set(true);

      this.form.reset({
        fullName: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {
      this.submitError.set('contact.form.errorGeneric');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
