import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTabsModule
} from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TransferState } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { DialogComponent, FormComponent } from './components';
import { FC_SERVICE_CONFIG, FC_SERVICE_GUID, FCServiceConfigInterface, FormConstructorService } from './services/form-constructor.service';
import { DATE_FORMATS, Guid } from './utils';

const FC_COMPONENTS = [
  FormComponent
];

const FC_ENTRY_COMPONENTS = [
  DialogComponent
];

const FC_SERVICES = [
  FormConstructorService
];

export function guid(create) {
  return new create();
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [
    ...FC_COMPONENTS,
    ...FC_ENTRY_COMPONENTS
  ],
  exports: [
    ...FC_COMPONENTS
  ],
  entryComponents: [
    ...FC_ENTRY_COMPONENTS
  ]
})
export class FormConstructorModule {
  public static forRoot(config: FCServiceConfigInterface): ModuleWithProviders {
    if (!config.language) {
      config.language = 'en';
    }

    return {
      ngModule: FormConstructorModule,
      providers: [
        ...FC_SERVICES,
        TransferState,
        {
          provide: FC_SERVICE_CONFIG,
          useValue: config
        },
        {
          provide: FC_SERVICE_GUID,
          useFactory: (typeof config.guid === 'function' ? config.guid : Guid.v4)
        },
        {provide: MAT_DATE_LOCALE, useValue: config.language},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS}
      ]
    };
  }
}

