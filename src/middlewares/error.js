import response from '../utils/response.js';
import ClientError  from '../exceptions/client-error.js';
import NotFoundError from '../exceptions/not-found-error.js';

const ErrorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return response(res, err.statusCode, err.message, null);
  }

  if (['ECONNREFUSED', 'ETIMEDOUT', 'ENETUNREACH'].includes(err.code)) {
    console.error('Database connection error:', err);
    return response(res, 503, 'Database tidak dapat diakses. Periksa koneksi Neon dan DATABASE_URL.', null);
  }
  
  if (err.isJoi || err.name === 'ValidationError') return response(res, 400, err.details[0].message, null); 

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Unhandled error: ', err);
  return response(res, status, message, null);
}; 

export default ErrorHandler;