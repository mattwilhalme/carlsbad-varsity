import Image from "next/image";

export function StoryImage({ alt, height = 1024, priority = false, sizes, src, width = 1800 }: {
  alt: string;
  height?: number;
  priority?: boolean;
  sizes: string;
  src: string;
  width?: number;
}) {
  if (/^https?:\/\//.test(src)) {
    // The public contract owns this URL. Plain img supports local CMS media now and R2/CDN URLs later.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} loading={priority ? "eager" : "lazy"} />;
  }

  return <Image src={src} alt={alt} width={width} height={height} priority={priority} sizes={sizes} />;
}
