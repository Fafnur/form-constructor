import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  FormConstructorService,
  FormModel,
  FormNode,
  TextType,
  DatepickerType,
  RadioType,
  CheckboxType,
  SelectType,
  TextareaType
} from 'ftm-pm/form-constructor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'app';
  public formNode: FormNode;

  public constructor(private fc: FormConstructorService,
                     private translateService: TranslateService) {
    this.init();
  }

  private init(): void {
    // Init langs
    this.translateService.addLangs(['ru', 'en']);
    this.translateService.setDefaultLang('en');

    // Create and set data
    const myEntity: any = {
      ali: 'eeeee',
      site: 'https://tets.ru',
      description: 'About...',
      birthday: '12.06.1992',
      birthdayNext: '12.06.1993',
      sex: true,
      agent: {
        id: 1,
        name: 'Ivan'
      },
      interests: [
        {
          label: 'IT',
          value:  1
        },
        {
          label: 'Math',
          value: 3
        }
      ],
      translations: {
        ru: {
          ali: '111'
        },
        en: {
          ali: '222'
        }
      }
    };
    const myEntityModel: FormModel = {
      ali: {
        type: TextType,
        options: {
          multiLanguage: true,
          setDefaultLanguage: false,
          validators: [Validators.required]
        }
      },
      site: {
        type: TextType,
        options: {
          validators: [Validators.required]
        }
      },
      agent: {
        type: SelectType,
        options: {
          required: true,
          validators: [Validators.required],
          mapped: 'name',
          mappedId: 'id',
          choices: [
            {
              id: 1,
              name: 'Ivan'
            },
            {
              id: 2,
              name: 'Alex'
            },
          ]
        }
      },
      birthday: {
        type: DatepickerType,
        options: {
          validators: [Validators.required]
        }
      },
      birthdayNext: {
        type: DatepickerType,
        options: {
          validators: [Validators.required]
        }
      },
      sex: {
        type: RadioType,
        options: {
          validators: [Validators.required],
          title: {
            value: 'Gender'
          },
          choices: [
            {
              label: 'Man',
              value: true
            },
            {
              label: 'Woman',
              value: false
            }
          ]
        }
      },
      interests: {
        type: CheckboxType,
        options: {
          // multiLanguage: true,
          // setDefaultLanguage: false,
          validators: [Validators.required],
          title: {
            value: 'Interests'
          },
          mapped: 'label',
          choices: [
            {
              label: 'IT',
              value:  1
            },
            {
              label: 'Woman',
              value: 2
            },
            {
              label: 'Math',
              value: 3
            }
          ]
        }
      },
      description: {
        type: TextareaType,
        options: {
          validators: [Validators.required]
        }
      }
    };
    this.formNode = this.fc.create(myEntityModel, {});
    this.formNode.setData(myEntity);
    console.log(this.formNode);
  }

  public onSubmit(event): void {
    console.log(this.formNode.form.value);
    console.log(this.formNode.getData());
  }
}
