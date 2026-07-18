import Image from "next/image";

export type UgcPostData = {
  id: string;
  image: string;
  caption: string;
  authorHandle: string;
};

export function UgcGallery({ posts }: { posts: UgcPostData[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
      {posts.map((post) => (
        <div key={post.id} className="group relative aspect-square overflow-hidden rounded-xl">
          <Image
            src={post.image}
            alt={post.caption}
            fill
            sizes="(min-width: 768px) 16vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-2">
            <p className="truncate text-xs font-medium text-cream">{post.authorHandle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
