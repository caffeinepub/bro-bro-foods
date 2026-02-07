/**
 * Ad Utility Module
 * 
 * Provides safe, controlled snippet mounting for third-party ad scripts.
 * Ensures provider scripts are injected only once and ad slots are mounted correctly.
 */

// Track if provider script has been injected to prevent duplicates
let providerScriptInjected = false;
const PROVIDER_SCRIPT_MARKER = 'data-ad-provider-injected';

/**
 * Injects the ad provider script into the document head (one-time only)
 * @param snippet - HTML snippet containing the provider script
 */
export function injectProviderScript(snippet: string): void {
  // Check if already injected
  if (providerScriptInjected || document.querySelector(`[${PROVIDER_SCRIPT_MARKER}]`)) {
    return;
  }

  // Create a temporary container to parse the snippet
  const temp = document.createElement('div');
  temp.innerHTML = snippet.trim();

  // Extract and inject script elements
  const scripts = temp.querySelectorAll('script');
  scripts.forEach((script) => {
    const newScript = document.createElement('script');
    
    // Copy attributes
    Array.from(script.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value);
    });
    
    // Copy inline script content
    if (script.textContent) {
      newScript.textContent = script.textContent;
    }
    
    // Mark as injected
    newScript.setAttribute(PROVIDER_SCRIPT_MARKER, 'true');
    
    // Inject into head
    document.head.appendChild(newScript);
  });

  providerScriptInjected = true;
}

/**
 * Mounts an ad slot snippet into a container element
 * @param container - DOM element to mount the ad into
 * @param snippet - HTML snippet for the ad slot
 */
export function mountAdSlot(container: HTMLElement, snippet: string): void {
  if (!container || !snippet) return;

  // Clear existing content
  container.innerHTML = '';

  // Create a temporary container to parse the snippet
  const temp = document.createElement('div');
  temp.innerHTML = snippet.trim();

  // Move all nodes (including scripts) to the container
  while (temp.firstChild) {
    const node = temp.firstChild;
    
    // If it's a script, we need to create a new script element for it to execute
    if (node.nodeName === 'SCRIPT') {
      const script = node as HTMLScriptElement;
      const newScript = document.createElement('script');
      
      // Copy attributes
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy inline script content
      if (script.textContent) {
        newScript.textContent = script.textContent;
      }
      
      container.appendChild(newScript);
      temp.removeChild(node);
    } else {
      container.appendChild(node);
    }
  }
}

/**
 * Unmounts an ad slot by clearing its container
 * @param container - DOM element to clear
 */
export function unmountAdSlot(container: HTMLElement): void {
  if (!container) return;
  container.innerHTML = '';
}
