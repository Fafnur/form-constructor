import * as moment_ from 'moment';

const moment = moment_;

import { AbstractType } from './form-type';

/**
 * DatepickerType
 */
export class DatepickerType extends AbstractType {
  public type: string = 'datepicker';

  public transform(value: any): any {
    return value ? moment(new Date(value)) : moment();
  }

  public reverseTransform(value: any): any {
    const date = moment(new Date(value));
    return date.format();
  }
}
