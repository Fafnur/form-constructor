import { FormTypeOptions } from '../types/form-type';
import { FormNodeConfig } from './form-node';

/**
 * FormField
 */
export interface FormField {
  type: any;
  options ?: FormTypeOptions|Object;
}

/**
 * FormModel
 */
export interface FormModel {
  [key: string]: (FormField | FormNodeConfig);
}
