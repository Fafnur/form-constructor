import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorIntl,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TransferState } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';

import { DialogComponent } from './components/dialog/dialog.component';
import { FiltersComponent } from './components/filters/filters.component';
import { FormComponent } from './components/form/form.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { FC_SERVICE_CONFIG, FC_SERVICE_GUID, FCServiceConfigInterface, FormConstructorService } from './services/form-constructor.service';
import { PaginatorIntlService } from './services/paginator-intl.service';
import { DATE_FORMATS } from './utils/date-formats';

const FC_COMPONENTS = [
  FiltersComponent,
  FormComponent,
  ListComponent,
  ViewComponent
];

const FC_ENTRY_COMPONENTS = [
  DialogComponent
];

const FC_SERVICES = [
  FormConstructorService,
  PaginatorIntlService
];

export function getMatPaginatorIntlService(translateService: TranslateService) {
  const service = new PaginatorIntlService();
  service.injectTranslateService(translateService);

  return service;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    RouterModule,
    NgxMaskModule,
    TranslateModule.forChild({})
  ],
  declarations: [
    ...FC_COMPONENTS,
    ...FC_ENTRY_COMPONENTS,
  ],
  exports: [
    ...FC_COMPONENTS
  ],
  entryComponents: [
    ...FC_ENTRY_COMPONENTS
  ]
})
export class FormConstructorModule {
  public static forRoot(config: FCServiceConfigInterface = {}): ModuleWithProviders {
    return {
      ngModule: FormConstructorModule,
      providers: [
        ...FC_SERVICES,
        TransferState,
        {
          provide: FC_SERVICE_CONFIG,
          useValue: {
            ...{
              language: 'en',
              languages: ['en']
            }, config
          }
        },
        {
          provide: MatPaginatorIntl,
          useFactory: (getMatPaginatorIntlService),
          deps: [TranslateService]
        },
        {provide: MAT_DATE_LOCALE, useValue: config.language ? config.language : 'en'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS}
      ]
    };
  }
}

