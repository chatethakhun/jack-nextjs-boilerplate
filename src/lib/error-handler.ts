export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    console.error(`Error ${error.statusCode}: ${error.message}`)
    return {
      message: error.message,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    console.error(`Unexpected error: ${error.message}`)
    return {
      message: "Something went wrong",
      statusCode: 500,
    }
  }

  console.error("Unknown error:", error)
  return {
    message: "Something went wrong",
    statusCode: 500,
  }
}