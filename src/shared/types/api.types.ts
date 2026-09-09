export interface MessageResource {
  message: string;
  testScenariosAvailable?: string[];
  entities?: Record<string, unknown>;
}

export interface RuleViolationError {
  rule: string;
  message: string;
}

export interface AssignmentValidationErrorResponse {
  code: string;
  message: string;
  errors: RuleViolationError[];
}

export interface ApiErrorResponse {
  code?: string;
  message: string;
  errors?: RuleViolationError[];
}
