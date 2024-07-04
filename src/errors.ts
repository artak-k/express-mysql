export class ApiError extends Error {
    public code: string;
    public data: any;

    constructor(message: string, errorCode: string, data?: any) {
        super(message);
        this.name = this.constructor.name;
        this.code = errorCode;
        if (data) {
            this.data = data;
        }
    }
}

export class NotFoundError extends ApiError {
    constructor() {
        super("Not found", "NOT_FOUND");
    }
}

export class InternalError extends ApiError {
    constructor() {
        super("Internal error", "INTERNAL_ERROR");
    }
}

export class UserUnauthorizedError extends ApiError {
    constructor() {
        super("Not authorized to access this resource", "USER_UNAUTHORIZED");
    }
}

export class InvalidCredentialsError extends ApiError {
    constructor() {
        super("Invalid credentials", "INVALID_CREDENTIALS");
    }
}
export class DuplicateError extends ApiError {
    constructor(message?: string) {
        super(message || "Entity already exists", "DUPLICATE_FOUND");
    }
}

export class CustomError extends ApiError {
    constructor(message?: string, data?: string) {
        super(message ?? "Oops, something went wrong", "CUSTOM", data);
    }
}

export class RequiredFieldError extends ApiError {
    constructor(message?: string) {
        super(message ?? "Field required", "REQUIRED_FIELD");
    }
}

export class InvalidFieldValueError extends ApiError {
    constructor(message?: string) {
        super(message || "Invalid field value", "INVALID_FIELD_VALUE");
    }
}

export class InvalidFileTypeError extends ApiError {
    constructor() {
        super("Invalid file type", "INVALID_FILE_TYPE");
    }
}
