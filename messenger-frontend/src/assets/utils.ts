import AppError from "../components/Errors/appError";

export const URL = 'http://127.0.0.1:3000/';
export function truncateString(str: string) {
    const maxLength = 20; // Maximum length allowed
    const ellipsis = '...'; // Ellipsis character
  
    if (str.length <= maxLength) {
      return str; // Return the original string if it's within the limit
    }
  
    // Truncate the string to the maximum length
    const truncatedStr = str.substring(0, maxLength - ellipsis.length);
  
    // Append the ellipsis to indicate truncation
    return truncatedStr + ellipsis;
  }
export const NikodemToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjgzYTNkYmQ4NmY2M2UyOTI4ZWUzYSIsImlhdCI6MTcxODI2ODI1MiwiZXhwIjoxNzI2MDQ0MjUyfQ.5fsX0mY8_Igglsleyp22OvuvrwMSzSFP24NBeDKhqwA'
export const mikolajToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjlhY2IyN2I0MjhiNTYyNTlmZTVlYSIsImlhdCI6MTcxODIyMDYzNiwiZXhwIjoxNzI1OTk2NjM2fQ.2SRL_lFJv80Wj79dza_kFZ8ZaTWzUX3TlRKgEj-YuDM`;
export const months: string[]  = [
    'styczeń',
    'luty',
    'marzec',
    'kwiecień',
    'maj',
    'czerwiec',
    'lipiec',
    'sierpień',
    'wrzesień',
    'październik',
    'listopad',
    'grudzień'
];
type IFetchError = {
  message: string;
  status: number;
}
export async function sendApiRequest(url: string, method: 'PATCH' | 'POST' | 'DELETE', token: string, potentialErrorMessage?: string, data?: any):
 Promise<{data?: any, error: IFetchError}> {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: data ? JSON.stringify(data) : undefined
    });
    if(!response.ok) throw new AppError(potentialErrorMessage || 'Request failed', response.status);
    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    return {
      error: {
        status: error?.statusCode || 500,
        message: error?.message || 'Request failed',
      }
    }
  }
}

// async function sendApiRequest(url: string, method: 'PATCH' | 'POST' | 'DELETE', data?: any): Promise<{ data?: any, error?: string }> {
//   try {
//     const response = await fetch(url, {
//       method: method,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: data ? JSON.stringify(data) : undefined,
//     });

//     if (!response.ok) {
//       throw new Error('Request failed');
//     }

//     const responseData = await response.json();
//     return { data: responseData };
//   } catch (err) {
//     return { error: err.message };
//   }
// }