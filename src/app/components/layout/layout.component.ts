import { Component, OnInit } from '@angular/core';

import { menu, MenuItem } from './menu';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public menu: MenuItem[];
  public language: string;
  public languages: string[];

  public constructor(private translateService: TranslateService) {
    this.menu = menu;
    this.languages = environment.languages;
    this.language = environment.language;
  }

  public ngOnInit(): void {
  }

  /**
   * On select language
   *
   * @param {string} language
   */
  public onSelectLanguage(language: string): void {
    this.language = language;
    this.translateService.use(language);
  }
}
