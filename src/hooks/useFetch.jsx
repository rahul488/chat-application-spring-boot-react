import React from 'react';
import { useRef } from 'react';

function useFetch() {
  const abortRef = useRef(null);

  return async function fetchData(url, options) {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    return fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.ok) {
        abortRef.current = null;
        return response;
      } else {
        throw Error('Network request failed');
      }
    });
  };
}

export default useFetch;
