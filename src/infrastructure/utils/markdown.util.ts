import { Marked } from "marked";
import { codeToHtml } from "shiki";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function extractToc(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const text = match[2].replace(/\*\*|__|\*|_|`/g, "").trim();
    items.push({ id: slugifyHeading(text), text, level: match[1].length });
  }

  return items;
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const marked = new Marked();

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = tokens.map((t) => ("text" in t ? t.text : "")).join("");
        const id = slugifyHeading(text);
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>`;
      },

      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const isExternal = href.startsWith("http");
        const attrs = isExternal
          ? ` target="_blank" rel="noopener noreferrer"`
          : "";
        const titleAttr = title ? ` title="${title}"` : "";
        return `<a href="${href}"${titleAttr}${attrs}>${text}</a>`;
      },

      image({ href, title, text }) {
        const titleAttr = title ? ` title="${title}"` : "";
        return `<img src="${href}" alt="${text}"${titleAttr} loading="lazy" />`;
      },

      code({ text, lang }) {
        if (!lang) {
          return `<pre><code>${escapeHtml(text)}</code></pre>`;
        }
        return `<!--shiki:${lang}--><pre><code class="language-${lang}">${escapeHtml(text)}</code></pre>`;
      },
    },
  });

  let html = await marked.parse(markdown);

  html = html.replace(/<table>/g, '<div class="table-wrapper"><table>');
  html = html.replace(/<\/table>/g, "</table></div>");

  const shikiRegex =
    /<!--shiki:(\w+)--><pre><code class="language-\w+">([\s\S]*?)<\/code><\/pre>/g;
  const replacements: { original: string; highlighted: string }[] = [];

  let shikiMatch;
  while ((shikiMatch = shikiRegex.exec(html)) !== null) {
    try {
      const code = decodeHtmlEntities(shikiMatch[2]);
      const highlighted = await codeToHtml(code, {
        lang: shikiMatch[1],
        theme: "github-dark",
      });
      replacements.push({ original: shikiMatch[0], highlighted });
    } catch {
      replacements.push({
        original: shikiMatch[0],
        highlighted: shikiMatch[0].replace(/<!--shiki:\w+-->/, ""),
      });
    }
  }

  for (const { original, highlighted } of replacements) {
    html = html.replace(original, highlighted);
  }

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export interface FAQItem {
  question: string;
  answer: string;
}

const MARKDOWN_CODE_BLOCK = /```[\s\S]*?```/g;
const MARKDOWN_INLINE_CODE = /`([^`]+)`/g;
const MARKDOWN_BOLD = /\*\*([^*]+)\*\*/g;
const MARKDOWN_ITALIC_ASTERISK = /\*([^*]+)\*/g;
const MARKDOWN_ITALIC_UNDERSCORE = /_([^_]+)_/g;
const MARKDOWN_LINK = /\[([^\]]+)\]\([^)]+\)/g;
const MARKDOWN_HEADING = /^#+\s+/gm;

function stripMarkdown(text: string): string {
  return text
    .replace(MARKDOWN_CODE_BLOCK, "")
    .replace(MARKDOWN_INLINE_CODE, "$1")
    .replace(MARKDOWN_BOLD, "$1")
    .replace(MARKDOWN_ITALIC_ASTERISK, "$1")
    .replace(MARKDOWN_ITALIC_UNDERSCORE, "$1")
    .replace(MARKDOWN_LINK, "$1")
    .replace(MARKDOWN_HEADING, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractFAQs(markdown: string): FAQItem[] {
  if (!markdown) return [];

  const faqs: FAQItem[] = [];
  const regex =
    /^###\s+Q:\s+(.+?)\n+([\s\S]+?)(?=\n###\s+Q:|\n##\s|\n---\s*\n|\s*$)/gm;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    const question = match[1].trim();
    const answer = stripMarkdown(match[2]);
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }
  return faqs;
}
