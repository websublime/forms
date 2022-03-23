# What is Forms?

`@websublime/forms` package sue `@websublime/schema` and form validation model based on `angular` forms model, to make form validation easy.

## Motivation

Forms was created to take advantage of a schema validation and apply to form validation.

Is based on `angular` forms model, taking laverage of schema validation and yet very complete.

All validation rules are defined in the schema and are async and run async, in order of it definition.

It also have two ways of validate a model:

- From top to bottom. It will validate all form fields.

- And from bottom to top. It very useful to be used with single form control validation.
  When you fill a form with several fields, we don't all fields to be validation at same time. Only if they are changed.

## Concepts

To create a form we use three concepts:

- Model - A javascript object.

- Validation Schema - A schema object with validation rules, that describes the `Model`.

- Forms Model - A forms model based on the `Validation Schema`.

### Model

```typescript
class User {
  name: string;
  age: number;
  email: string;

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
}
```

### Validation Schema

```typescript
const schema = ObjectType<User>({
  name: StringType().isRequired(),
  age: NumberType().min(18),
  email: StringType().isEmail()
});
```

### Form model

```typescript
const fg = new FormGroup(schema);

expect(control.isFocus).toBeFalsy();
expect(control.isDirty).toBeFalsy();
expect(control.isTouch).toBeFalsy();
expect(control.isPrestine).toBeTruthy();
expect(control.isValid).toBeTruthy();
expect(control.hasErrors).toBeFalsy();
```

### Validate

```typescript
control.setData(
  new User({
    age: 10,
    email: 'teste.com',
    name: 'test'
  })
);

await control.validate();
```
