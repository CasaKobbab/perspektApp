import { useEffect } from "react";

export default function SEO({ title, description, image, url, type = "website" }) {
  useEffect(() => {
    // Save original values to restore on unmount (optional, but good for SPA)
    const originalTitle = document.title;
    
    // Update Title
    if (title) {
        document.title = `${title} | Perspekt`;
    }

    // Helper to update or create meta tag
    const updateMeta = (identifier, content, attrName = "name") => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${identifier}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, identifier);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper for Link tags (Canonical)
    const updateLink = (rel, href) => {
        if (!href) return;
        let element = document.querySelector(`link[rel="${rel}"]`);
        if (!element) {
            element = document.createElement("link");
            element.setAttribute("rel", rel);
            document.head.appendChild(element);
        }
        element.setAttribute("href", href);
    };

    updateMeta("description", description);
    
    // Open Graph
    updateMeta("og:site_name", "Perspekt", "property");
    updateMeta("og:title", title, "property");
    updateMeta("og:description", description, "property");
    updateMeta("og:image", image, "property");
    updateMeta("og:url", url || window.location.href, "property");
    updateMeta("og:type", type, "property");

    // Twitter
    updateMeta("twitter:card", "summary_large_image", "name");
    updateMeta("twitter:title", title, "name");
    updateMeta("twitter:description", description, "name");
    updateMeta("twitter:image", image, "name");

    // Canonical
    updateLink("canonical", url || window.location.href);

  }, [title, description, image, url, type]);

  return null;
}