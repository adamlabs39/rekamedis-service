export default function successResponse(message, data, property) {
  if (!data && !property) {
    return {
      message: message,
    };
  }
  
  if (!property) {
    return {
      message: message,
      payload: data,
    };
  }

  if (property) {
    return {
      message: message,
      properties: property,
      payload: data,
    };
  }
}
