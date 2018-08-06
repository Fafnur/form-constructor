import { BrowserModule, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatDialogModule, MatExpansionModule, MatMenuModule, MatProgressSpinnerModule, MatTabsModule } from '@angular/material';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormConstructorModule } from 'ftm-pm/form-constructor';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateBrowserLoader } from './translate-browser-loader.service';

// Services
import { UserService } from './services/user.service';

// Layouts
import { LayoutComponent } from './components/layout/layout.component';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { ViewComponent } from './components/view/view.component';
import { ModifiedListComponent } from './components/modified-list/modified-list.component';

export function exportTranslateStaticLoader(http: HttpClient, transferState: TransferState) {
  return new TranslateBrowserLoader('/assets/i18n/', '.json', transferState, http);
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    EditComponent,
    ViewComponent,
    ListComponent,
    NotFoundComponent,
    NotificationComponent,
    DashboardComponent,
    ServerErrorComponent,
    ModifiedListComponent
  ],
  entryComponents: [
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    AppRoutingModule,
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
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
