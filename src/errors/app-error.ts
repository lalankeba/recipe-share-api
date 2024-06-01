class AppError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "AppError";
        this.statusCode = 500;
    }
}

export default AppError;