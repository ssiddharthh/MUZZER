/**
 * Auto-Play Error Handling and Recovery
 * Handles errors gracefully and provides user-friendly feedback
 */

export enum AutoPlayErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  VIDEO_NOT_FOUND = "VIDEO_NOT_FOUND",
  PLAYBACK_ERROR = "PLAYBACK_ERROR",
  QUEUE_EMPTY = "QUEUE_EMPTY",
  UNAUTHORIZED = "UNAUTHORIZED",
  PARSE_ERROR = "PARSE_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface AutoPlayError {
  type: AutoPlayErrorType;
  message: string;
  timestamp: Date;
  retryable: boolean;
  originalError?: Error;
}

export class AutoPlayErrorHandler {
  private errors: AutoPlayError[] = [];
  private maxErrors: number = 50;
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries: number = 3;

  /**
   * Log an error and track retry attempts
   */
  logError(
    type: AutoPlayErrorType,
    message: string,
    originalError?: Error
  ): AutoPlayError {
    const error: AutoPlayError = {
      type,
      message,
      timestamp: new Date(),
      retryable: this.isRetryable(type),
      originalError,
    };

    this.errors.push(error);

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(`[AutoPlay ${type}]`, message, originalError);
    }

    return error;
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(type: AutoPlayErrorType): string {
    const messages: Record<AutoPlayErrorType, string> = {
      [AutoPlayErrorType.NETWORK_ERROR]: "Network connection issue. Please check your internet.",
      [AutoPlayErrorType.VIDEO_NOT_FOUND]: "Video not found. It may have been removed.",
      [AutoPlayErrorType.PLAYBACK_ERROR]: "Unable to play video. Try refreshing.",
      [AutoPlayErrorType.QUEUE_EMPTY]: "Queue is empty. Add a track to get started.",
      [AutoPlayErrorType.UNAUTHORIZED]: "Please sign in to continue.",
      [AutoPlayErrorType.PARSE_ERROR]: "Error processing track. Please try again.",
      [AutoPlayErrorType.UNKNOWN_ERROR]: "Something went wrong. Please try again.",
    };

    return messages[type] || "An error occurred";
  }

  /**
   * Check if error is retryable
   */
  private isRetryable(type: AutoPlayErrorType): boolean {
    const retryableErrors = [
      AutoPlayErrorType.NETWORK_ERROR,
      AutoPlayErrorType.PLAYBACK_ERROR,
    ];
    return retryableErrors.includes(type);
  }

  /**
   * Can error be retried?
   */
  canRetry(errorId: string): boolean {
    const attempts = this.retryAttempts.get(errorId) ?? 0;
    return attempts < this.maxRetries;
  }

  /**
   * Record a retry attempt
   */
  recordRetry(errorId: string): number {
    const attempts = (this.retryAttempts.get(errorId) ?? 0) + 1;
    this.retryAttempts.set(errorId, attempts);
    return attempts;
  }

  /**
   * Get all logged errors (for debugging)
   */
  getErrors(): AutoPlayError[] {
    return [...this.errors];
  }

  /**
   * Clear all logged errors
   */
  clearErrors(): void {
    this.errors = [];
    this.retryAttempts.clear();
  }

  /**
   * Get error count by type
   */
  getErrorCount(type?: AutoPlayErrorType): number {
    if (!type) {
      return this.errors.length;
    }
    return this.errors.filter((e) => e.type === type).length;
  }
}

/**
 * Global error handler instance
 */
export const autoPlayErrorHandler = new AutoPlayErrorHandler();

/**
 * Exponential backoff for retries
 */
export function calculateBackoffDelay(
  attempt: number,
  baseDelayMs: number = 1000
): number {
  const delay = baseDelayMs * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 1000;
  return Math.min(delay + jitter, 30000); // Cap at 30 seconds
}
