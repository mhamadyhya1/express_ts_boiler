import mongoose from 'mongoose';

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export function listTextValidation(isDefaultString?: boolean) {
  return [
    {
      type: String,
      default: isDefaultString ? '' : [],
    },
  ];
}

export function listNumberValidation() {
  return [
    {
      type: Number,
      default: [],
    },
  ];
}

export function listObjectValidation() {
  return [
    {
      type: Object,
      default: [],
    },
  ];
}

export function listMongoIdValidation(collectionName?: string) {
  return [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionName,
      default: [],
    },
  ];
}

export function textValidationNullable() {
  return {
    type: String,
    trim: true,
  };
}
export function ObjectValidationNullable() {
  return {
    type: Object,
    trim: true,
  };
}
export function textValidationNullableRequired() {
  return {
    type: String,
    require: true,
    trim: true,
  };
}

export function textValidation(text?: string) {
  return {
    type: String,
    default: text == null ? '' : text,
    trim: true,
  };
}
export function textValidationUnique(text?: string) {
  return {
    type: String,
    default: text == null ? '' : text,
    trim: true,
    unique: true,
  };
}
export function textValidationRequired(text?: string) {
  return {
    type: String,
    default: text == null ? '' : text,
    trim: true,
    required: true,
  };
}
export function textValidationUniqueRequired(text?: string) {
  return {
    type: String,
    default: text == null ? '' : text,
    unique: true,
    required: true,
  };
}
export function textValidationUniqueRequiredNullable() {
  return {
    type: String,
    unique: true,
    required: true,
  };
}

export function numberValidation(num?: Number) {
  return {
    type: Number,
    default: num == null ? 0 : num, // 0 not verified , 1 verified
  };
}

export function mongoIdValidation(collectionName?: string) {
  return {
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionName,
  };
}
export function mongoIdValidationOptional(collectionName?: string) {
  return {
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionName,
    required: false,
  };
}

export function dateValidation() {
  return {
    type: Date, //todo: fix this validation to Date
    default: Date.now,
  };
}
export function dateValidationArray() {
  return [
    {
      type: Date, //todo: fix this validation to Date
      default: Date.now,
    },
  ];
}
export function dateValidationArrayNullable() {
  return [
    {
      type: Date, //todo: fix this validation to Date
    },
  ];
}
export function dateValidationRequired() {
  return {
    type: Date, //todo: fix this validation to Date
    default: Date.now,
    // required: true
  };
}

export function booleanValidation(status: boolean) {
  return {
    type: Boolean,
    default: status,
  };
}

export function booleanValidationNullable() {
  return {
    type: Boolean,
  };
}

export function emailValidation() {
  return {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [emailRegex, 'Please fill a valid email address'],
  };
}

export const validateEmail = function (email: any) {
  const re = emailRegex;
  return re.test(email);
};
