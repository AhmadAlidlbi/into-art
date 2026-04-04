import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.scss'],
})
export class NotFoundPage {
  constructor(private router: Router) {}

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    this.router.navigateByUrl('/');
  }
}
