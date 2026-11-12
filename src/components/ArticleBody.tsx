import type { ReactNode } from "react";

import type { PublicArticleBlock, PublicArticleInline, PublicTextFormat } from "@/data/article-contract";

function formattedText(text: string, formats: PublicTextFormat[]) {
  return formats.reduce<ReactNode>((content, format) => {
    if (format === "bold") return <strong>{content}</strong>;
    if (format === "italic") return <em>{content}</em>;
    if (format === "underline") return <u>{content}</u>;
    if (format === "strikethrough") return <s>{content}</s>;
    if (format === "code") return <code>{content}</code>;
    return content;
  }, text);
}

function InlineContent({ nodes }: { nodes: PublicArticleInline[] }) {
  return nodes.map((node, index) => {
    if (node.type === "text") return <span key={index}>{formattedText(node.text, node.formats)}</span>;
    const external = /^https?:\/\//.test(node.url);
    return <a href={node.url} key={index} {...(external ? { rel: "noreferrer", target: "_blank" } : {})}>
      <InlineContent nodes={node.children} />
    </a>;
  });
}

export function ArticleBody({ body }: { body: string[] | PublicArticleBlock[] }) {
  if (!body.length) return null;
  if (typeof body[0] === "string") return body.map((paragraph) => <p key={paragraph as string}>{paragraph as string}</p>);

  return (body as PublicArticleBlock[]).map((block, index) => {
    if (block.type === "paragraph") return <p key={index}><InlineContent nodes={block.children} /></p>;
    if (block.type === "quote") return <blockquote key={index}><InlineContent nodes={block.children} /></blockquote>;
    if (block.type === "heading") {
      if (block.level === 3) return <h3 key={index}><InlineContent nodes={block.children} /></h3>;
      if (block.level === 4) return <h4 key={index}><InlineContent nodes={block.children} /></h4>;
      return <h2 key={index}><InlineContent nodes={block.children} /></h2>;
    }
    const List = block.style === "ordered" ? "ol" : "ul";
    return <List key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineContent nodes={item} /></li>)}</List>;
  });
}
