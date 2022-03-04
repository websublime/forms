import { ArraySchemaType, BaseSchemaType, ErrorModel, ObjectSchemaType } from '@websublime/schema';
/**
 * Base Control
 */
export declare class BaseControl<T = any> {
    items?: Array<BaseControl<T>> | never[];
    properties?: Record<string, BaseControl<T>>;
    isDirty: boolean;
    isTouch: boolean;
    isFocus: boolean;
    isLoading: boolean;
    isValid: boolean;
    errors: ErrorModel[];
    context: any;
    schema: BaseSchemaType<T> | ArraySchemaType<T> | ObjectSchemaType<T>;
    parent: BaseControl<any> | null;
    weakMap: WeakMap<this, unknown>;
    constructor(schema: BaseSchemaType<T> | ArraySchemaType<T> | ObjectSchemaType<T>, parent?: BaseControl<any> | null, context?: any);
    get isPrestine(): boolean;
    /**
     * Getter has errors
     */
    get hasErrors(): boolean;
    get data(): unknown;
    /**
     * Set control dirty state to true
     */
    setDirty(): void;
    /**
     * Set control touch state to true
     */
    setTouch(): void;
    /**
     * Set control focus state
     * @param focus focus state
     */
    setFocus(focus: boolean): void;
    setData(data: any): void;
    validate(data?: any, drill?: boolean): Promise<void>;
    notifyParent(): Promise<void>;
    onChange(child: BaseControl<T>): void;
}
