import Image from "next/image";

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm bg-ivory">
      <Image src={src} alt={alt} fill sizes="(max-width: 640px) 100vw, 240px" className="object-contain p-1" />
    </div>
  );
}
