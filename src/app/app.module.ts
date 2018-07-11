import { BrowserModule, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { FormConstructorModule } from 'ftm-pm/form-constructor';
import { AppComponent } from './app.component';
import { TranslateBrowserLoader } from './translate-browser-loader.service';

export function exportTranslateStaticLoader(http: HttpClient, transferState: TransferState) {
  return new TranslateBrowserLoader('/assets/i18n/', '.json', transferState, http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormConstructorModule.forRoot({
      languages: ['ru', 'en'],
      language: 'en'
    }),
    TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (exportTranslateStaticLoader),
          deps: [HttpClient, TransferState]
        }
      }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
