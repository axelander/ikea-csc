export const postReq = <T>(url: string, data: T) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

export const getReq = (url: string) => fetch(url).then((r) => r.json());
