import { BaseSchemaType } from '@websublime/schema';
import { BaseControl } from './base-control';
/**
 * Form Control
 */
export declare class FormControl<T = any> extends BaseControl<T> {
    constructor(schema: BaseSchemaType<T>, parent?: BaseControl<any> | null, context?: any);
}
