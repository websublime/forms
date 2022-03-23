# Schema types

Schema package, have all types needed to describe a javascript object:

- [Properties](#Properties)

  - [StringType](#StringType)
  - [NumberType](#number)
  - [BooleanType](#boolean)
  - [DateType](#date)

- [Object](/guide/object-type)

- [Array](/guide/array-type)

## Properties

Schema package have 4 properties types, each one with it own built in validation rules:

- StringType
- NumberType
- BooleanType
- DateType

### StringType

The code below creates a validation schema for a property of type string that should have a minLength of 5.

```typescript
const schema = StringType().minLength(5);

let validation = await schema.check('abcde');

expect(validation.hasError).toBeFalsy();
expect(validation.isValid).toBeTruthy();

validation = await schema.check('abcd');

expect(validation.hasError).toBeTruthy();
expect(validation.isValid).toBeFalsy();

const [error] = validation.errors;

console.log(error.i18n); // ERRORS.STRING.MIN_LENGTH
```

Now let see what's happens if we add more than one validation. The string must have min length of 5, and must contains numbers.

Next code also show how to add a custom message to a validation rule.

And show what happens if we pass diferent type from what is expected.

```typescript
const schema = StringType()
  .minLength(5, 'CUSTOM_MESSAGE')
  .containsNumber();

let validation = await schema.check('abc');

expect(validation.hasError).toBeTruthy();
const [minLengthError, containsNumberError] = validation.errors;

console.log(minLengthError.i18n); // CUSTOM_MESSAGE
console.log(containsNumberError.i18n); // ERRORS.STRING.CONTAINS_NUMBER

validation = await schema.check(55 as any);

expect(validation.hasError).toBeTruthy();

let [error] = validation.errors;

console.log(error.i18n); // ERRORS.STRING.INVALID_TYPE

validation = await schema.check('a5b');

expect(validation.hasError).toBeTruthy();
[error] = validation.errors;

console.log(error.i18n); // CUSTOM_MESSAGE
```

::: info Note
The order in which validation rules are defined is the order they are executed, and the order in which they appers in the `validation.errors` array.
:::

Schema validation will not execute any validation rules if the value is empty (null or undefined) unless the property schema is marked as required.

```typescript
const schema = StringType()
  .minLength(5)
  .containsNumber();

let validation = await schema.check(null);

expect(validation.hasError).toBeFalsy();

validation = await schema.check(undefined);

expect(validation.hasError).toBeFalsy();

const requiredSchema = StringType()
  .minLength(5)
  .isRequired()
  .containsNumber();

validation = await requiredSchema.check(null);

expect(validation.hasError).toBeTruthy();

validation = await requiredSchema.check(undefined);

expect(validation.hasError).toBeTruthy();

expect(validation.errors.length).toBe(1);

const [error] = validation.errors;

console.log(error.i18n); // ERRORS.IS_REQUIRED
```

::: warning Note
The required rule is always the first to run. If an type is required, and that condition is not met, it will not execute next validation rules.
:::

### NumberType

The code below creates a validation schema for a property of type `number` that should have a min value of 5.

```typescript
const schema = NumberType().min(5);

let validation = await schema.check(5);

expect(validation.hasError).toBeFalsy();
expect(validation.isValid).toBeTruthy();

validation = await schema.check(4);

expect(validation.hasError).toBeTruthy();
expect(validation.isValid).toBeFalsy();

const [error] = validation.errors;

console.log(error.i18n); // ERRORS.NUMBER.MIN
```

Now let see what's happens if we add more than one validation. The `number` must have min value of 5, and must be an integer.

Next code also show how to add a custom message to a validation rule.

And show what happens if we pass diferent type from what is expected.

```typescript
const schema = NumberType()
  .min(5, 'CUSTOM_MESSAGE')
  .isInteger();

let validation = await schema.check(2.5);

expect(validation.hasError).toBeTruthy();
const [minError, isIntegerError] = validation.errors;

console.log(minError.i18n); // CUSTOM_MESSAGE
console.log(isIntegerError.i18n); // ERRORS.NUMBER.IS_INTEGER

validation = await schema.check('6' as any);

expect(validation.hasError).toBeTruthy();

let [error] = validation.errors;

console.log(error.i18n); // ERRORS.NUMBER.INVALID_TYPE

validation = await schema.check(4);

expect(validation.hasError).toBeTruthy();
[error] = validation.errors;

console.log(error.i18n); // CUSTOM_MESSAGE
```

Required vs non required property `NumberType`

```typescript
const schema = NumberType()
  .min(5)
  .isInteger();

let validation = await schema.check(null);

expect(validation.hasError).toBeFalsy();

validation = await schema.check(undefined);

expect(validation.hasError).toBeFalsy();

const requiredSchema = NumberType()
  .min(5)
  .isInteger()
  .isRequired();

validation = await requiredSchema.check(null);

expect(validation.hasError).toBeTruthy();

validation = await requiredSchema.check(undefined);

expect(validation.hasError).toBeTruthy();

expect(validation.errors.length).toBe(1);

const [error] = validation.errors;

console.log(error.i18n); // ERRORS.IS_REQUIRED
```

### BooleanType

BooleanType do not have any built in validation besides isRequired and `boolean` type validation.

```typescript
const schema = BooleanType();

let validation = await schema.check(null);
expect(validation.hasError).toBeFalsy();
expect(validation.isValid).toBeTruthy();

const requiredSchema = BooleanType().isRequired();

validation = await requiredSchema.check(null);

expect(validation.hasError).toBeTruthy();
expect(validation.isValid).toBeFalsy();

validation = await requiredSchema.check(false);

expect(validation.hasError).toBeFalsy();
expect(validation.isValid).toBeTruthy();

validation = await requiredSchema.check('true' as any);

expect(validation.hasError).toBeTruthy();
expect(validation.isValid).toBeFalsy();

const [error] = validation.errors;

console.log(error.i18n); // ERRORS.BOOLEAN.INVALID_TYPE
```

### DateType

DateType validation is a validation schema for `new Date` object. It as some built in validation, but you can extend it and add more using `date-fns` package.

```typescript
const schema = DateType();

let validation = await schema.check(null);
expect(validation.hasError).toBeFalsy();
expect(validation.isValid).toBeTruthy();

const requiredSchema = DateType().isRequired();

validation = await requiredSchema.check(null);

expect(validation.hasError).toBeTruthy();
expect(validation.isValid).toBeFalsy();

// Can be a valid iso string
validation = await requiredSchema.check('2022-01-01');

expect(validation.hasError).toBeFalsy();
expect(validation.isValid).toBeTruthy();

validation = await requiredSchema.check('true' as any);

expect(validation.hasError).toBeTruthy();
expect(validation.isValid).toBeFalsy();

const [error] = validation.errors;

console.log(error.i18n); //ERRORS.DATE.INVALID_TYPE
```

::: info Note
DateType property can be a `Date` object, a valid ISO date `string`, or a `number`. Any valid value we can pass to the constructor `new Date()`
:::
