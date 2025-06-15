/**
 * Utility functions for the extension
 */

/**
 * Debounces a function to prevent too frequent calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Waits for an element to be present in the DOM
 * @param {string} selector - The CSS selector to wait for
 * @param {number} timeout - Maximum time to wait in milliseconds
 * @returns {Promise<Element>} - The found element
 */
export function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for element: ${selector}`));
    }, timeout);
  });
}

/**
 * Safely executes a function with error handling
 * @param {Function} func - The function to execute
 * @param {string} errorMessage - The error message to log if the function fails
 * @returns {Promise<any>} - The result of the function or null if it fails
 */
export async function safeExecute(func, errorMessage) {
  try {
    return await func();
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
}
