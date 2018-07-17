import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  BoolType,
  DialogType,
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public formNode: FormNode;

  public constructor(private fc: FormConstructorService) {
    this.init();
  }

  public ngOnInit(): void {
  }

  private init(): void {
    // // Create and set data
    // // Data
    // const myEntity: any = {
    //   id: 'eeeee',
    //   site: 'https://tets.ru',
    //   description: 'About...',
    //   birthday: '12.06.1992',
    //   sex: true,
    //   name: {
    //     firstname: 'Petr',
    //     lastname: 'Ivanov'
    //   },
    //   agent: {
    //     id: 1,
    //     name: 'Ivan'
    //   },
    //   interests: [
    //     {
    //       label: 'IT',
    //       value: 1
    //     },
    //     {
    //       label: 'Math',
    //       value: 3
    //     }
    //   ],
    //   translations: {
    //     ru: {
    //       ali: '111'
    //     },
    //     en: {
    //       ali: '222'
    //     }
    //   }
    // };
    //
    // // Models
    // const nameModel: FormModel = {
    //   firstname: {
    //     type: TextType,
    //     options: {
    //       validators: [Validators.required]
    //     }
    //   },
    //   lastname: {
    //     type: TextType,
    //     options: {
    //       validators: [Validators.required]
    //     }
    //   }
    // };
    // const agentModel: FormModel = {
    //   id: {
    //     type: TextType,
    //     options: {
    //       validators: [Validators.required]
    //     }
    //   },
    //   name: {
    //     type: TextType,
    //     options: {
    //       validators: [Validators.required]
    //     }
    //   }
    // };
    // const myEntityModel: FormModel = {
    //   ali: {
    //     type: TextType,
    //     options: {
    //       multiLanguage: true,
    //       setDefaultLanguage: false,
    //       validators: [Validators.required]
    //     }
    //   },
    //   name: {
    //     type: DialogType,
    //     options: {
    //       validators: [],
    //       button: {
    //         label: 'Select name from dialog',
    //         color: 'primary'
    //       },
    //       model: nameModel
    //     }
    //   },
    //   site: {
    //     type: TextType,
    //     options: {
    //       validators: [Validators.required]
    //     }
    //   },
    //   agent: {
    //     type: SelectType,
    //     options: {
    //       required: true,
    //       validators: [Validators.required],
    //       mapped: 'name',
    //       mappedId: 'id',
    //       choices: [
    //         {
    //           id: 1,
    //           name: 'Ivan'
    //         },
    //         {
    //           id: 2,
    //           name: 'Alex'
    //         }
    //       ],
    //       dialog: {
    //         type: DialogType,
    //         options: {
    //           validators: [],
    //           button: {
    //             label: 'actions.create',
    //             color: 'primary'
    //           },
    //           model: agentModel
    //         }
    //       }
    //     }
    //   },
    //   birthday: {
    //     type: DatepickerType,
    //     options: {
    //       validators: [Validators.required]
    //     }
    //   },
    //   verify: {
    //     type: BoolType,
    //     options: {
    //       validators: [Validators.required],
    //       label: 'Is verify?'
    //     }
    //   },
    //   sex: {
    //     type: RadioType,
    //     options: {
    //       validators: [Validators.required],
    //       title: {
    //         value: 'Gender'
    //       },
    //       choices: [
    //         {
    //           label: 'Man',
    //           value: true
    //         },
    //         {
    //           label: 'Woman',
    //           value: false
    //         }
    //       ]
    //     }
    //   },
    //   interests: {
    //     type: CheckboxType,
    //     options: {
    //       // multiLanguage: true,
    //       // setDefaultLanguage: false,
    //       validators: [Validators.required],
    //       title: {
    //         value: 'Interests'
    //       },
    //       mapped: 'label',
    //       choices: [
    //         {
    //           label: 'IT',
    //           value: 1
    //         },
    //         {
    //           label: 'Woman',
    //           value: 2
    //         },
    //         {
    //           label: 'Math',
    //           value: 3
    //         }
    //       ]
    //     }
    //   },
    //   description: {
    //     type: TextareaType,
    //     options: {
    //       validators: [Validators.required]
    //     }
    //   }
    // };
    //
    // this.formNode = this.fc.create(myEntityModel, {});
    // this.formNode.setData(myEntity);
  }

  public onSubmit(event): void {
    console.log(this.formNode.form.value);
    console.log(this.formNode.getData());
  }
}
