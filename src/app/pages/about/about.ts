import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage implements AfterViewInit, OnDestroy {
  @Input() consultationPath = '/book-consultation';

  ctaEnter = signal(false);

  @ViewChild('ctaSection', { read: ElementRef })
  ctaSection?: ElementRef<HTMLElement>;

  private ctaIO?: IntersectionObserver;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    const ctaEl = this.ctaSection?.nativeElement;
    if (!ctaEl) return;

    this.ctaIO = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        this.ctaEnter.set(true);
        this.ctaIO?.disconnect();
        this.ctaIO = undefined;
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );

    this.ctaIO.observe(ctaEl);
  }

  ngOnDestroy(): void {
    this.ctaIO?.disconnect();
  }

  goBook(): void {
    this.router.navigateByUrl(this.consultationPath);
  }
}
