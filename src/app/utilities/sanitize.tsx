import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document, INLINES, MARKS } from "@contentful/rich-text-types";

export function sanitizeContentfulRichText(content: Document): React.ReactNode {
  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
      [BLOCKS.HEADING_1]: (node, children) => <h1>{children}</h1>,
      [BLOCKS.HEADING_2]: (node, children) => <h2>{children}</h2>,
      [BLOCKS.HEADING_3]: (node, children) => <h3>{children}</h3>,
      [BLOCKS.UL_LIST]: (node, children) => <ul>{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol>{children}</ol>,
      [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
      [INLINES.HYPERLINK]: (node, children) => {
        const url = node.data.uri;
        if (isValidUrl(url)) {
          return (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        }
        console.warn("Invalid URL in hyperlink:", url);
        return <span>{children}</span>;
      },
      // Default handler for unhandled nodes
      default: (node, children) => {
        console.warn("Unhandled content type:", node.nodeType);
        return <>{children}</>;
      },
    },
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
    },
    renderText: (text) => {
      return text
        .split("\n")
        .reduce<React.ReactNode[]>((children, textSegment, index) => {
          if (index === 0) {
            return [textSegment];
          } else {
            return [...children, <br key={index} />, textSegment];
          }
        }, []);
    },
  };

  return documentToReactComponents(content, options);
}

export const sanitizeUrlForDisplay = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Only allow http/https protocols for display
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "Invalid URL";
    }
    return parsed.hostname + parsed.pathname; // Display only safe parts
  } catch {
    console.warn("Failed to parse URL for display:", url);
    return "Invalid URL"; // Safe default instead of original URL
  }
};

export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    // Explicitly check protocol
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    // Prevent javascript: protocol even if parsing succeeds
    if (url.toLowerCase().trim().startsWith("javascript:")) {
      return false;
    }
    // Limit URL length
    if (url.length > 2048) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};
export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

export const sanitizeImageUrl = (url: string): string => {
  // Ensure URL is from Contentful CDN or is a relative path
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Validate it's from Contentful CDN
    if (!url.includes("contentful.com") && !url.includes("ctfassets.net")) {
      throw new Error("Invalid image source");
    }
    return url;
  }
  // Relative path from Contentful
  return `https:${url}`;
};
