import { describe, it, expect } from 'vitest';
import { extractToc, renderMarkdown } from './markdown.util';

describe('extractToc', () => {
  it('extracts h2 and h3 headings', () => {
    const markdown = `## First Section\n\nContent\n\n### Sub Section\n\nMore content\n\n## Second Section`;
    const toc = extractToc(markdown);

    expect(toc).toHaveLength(3);
    expect(toc[0]).toEqual({ id: 'first-section', text: 'First Section', level: 2 });
    expect(toc[1]).toEqual({ id: 'sub-section', text: 'Sub Section', level: 3 });
    expect(toc[2]).toEqual({ id: 'second-section', text: 'Second Section', level: 2 });
  });

  it('ignores h1 and h4+ headings', () => {
    const markdown = `# Title\n\n## Included\n\n#### Not Included`;
    const toc = extractToc(markdown);

    expect(toc).toHaveLength(1);
    expect(toc[0].text).toBe('Included');
  });

  it('strips markdown formatting from heading text', () => {
    const markdown = `## **Bold** and *italic* heading`;
    const toc = extractToc(markdown);

    expect(toc[0].text).toBe('Bold and italic heading');
  });

  it('returns empty array for no headings', () => {
    const toc = extractToc('Just a paragraph with no headings.');

    expect(toc).toHaveLength(0);
  });

  it('generates unique slugified ids', () => {
    const markdown = `## Hello World!\n\n## Special Ch@racters`;
    const toc = extractToc(markdown);

    expect(toc[0].id).toBe('hello-world');
    expect(toc[1].id).toBe('special-chracters');
  });
});

describe('renderMarkdown', () => {
  it('renders basic markdown to HTML', async () => {
    const html = await renderMarkdown('## Hello\n\nA paragraph.');

    expect(html).toContain('<h2');
    expect(html).toContain('id="hello"');
    expect(html).toContain('<p>A paragraph.</p>');
  });

  it('adds id attributes to headings', async () => {
    const html = await renderMarkdown('## My Section\n\n### Sub Section');

    expect(html).toContain('id="my-section"');
    expect(html).toContain('id="sub-section"');
  });

  it('adds target blank to external links', async () => {
    const html = await renderMarkdown('[Google](https://google.com)');

    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('does not add target blank to internal links', async () => {
    const html = await renderMarkdown('[About](/about)');

    expect(html).not.toContain('target="_blank"');
  });

  it('adds lazy loading to images', async () => {
    const html = await renderMarkdown('![Alt text](https://frado.vercel.app/img.jpg)');

    expect(html).toContain('loading="lazy"');
  });

  it('renders tables', async () => {
    const markdown = `| Col A | Col B |\n|-------|-------|\n| 1 | 2 |`;
    const html = await renderMarkdown(markdown);

    expect(html).toContain('<table>');
    expect(html).toContain('<th>');
    expect(html).toContain('<td>');
  });

  it('renders bullet lists', async () => {
    const html = await renderMarkdown('* Item 1\n* Item 2');

    expect(html).toContain('<ul>');
    expect(html).toContain('<li>');
  });
});
