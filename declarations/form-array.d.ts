import type { ArraySchemaType } from '@websublime/schema';
import { BaseControl } from './base-control';
/**
 * Form Array
 */
export declare class FormArray<T = any> extends BaseControl<T> {
    items: Array<BaseControl<T>> | never[];
    schema: ArraySchemaType<T>;
    constructor(schema: ArraySchemaType<T>, parent?: BaseControl<any> | null, context?: any);
    validate(data?: any, drill?: boolean): Promise<void>;
    setData(data: any): void;
    onChange(child: BaseControl<any>): Promise<void>;
}
