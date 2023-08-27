// webShare.ts

/**
 * Function to share content using the navigator.share method.
 * 
 * @param title - The title of the content to be shared.
 * @param text - The text content to be shared.
 * @param url - The URL of the content to be shared.
 * 
 * @example
 * shareContent("Example Title", "Example Text", "https://example.com");
 */
export const shareContent = async (title: string, text: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };