const errors = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

export const HttpErrors = (status, message = message[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
