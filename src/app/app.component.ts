import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'app';

  public constructor(private translateService: TranslateService) {
    this.init();
  }

  private init(): void {
    // Init langs
    this.translateService.addLangs(environment.languages);
    this.translateService.setDefaultLang(environment.language);
  }
}
