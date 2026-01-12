import Link from "next/link";

export default function NewsBlogsPage() {
  const items = [
    {
      title: "Blogs",
      href: "/news-blogs/blogs",
    },
    {
      title: "Interactive & Engaging",
      href: "/news-blogs/interactive",
    },
    {
      title: "Gallery",
      href: "/news-blogs/gallery",
    },
  ];

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h1 className="text-3xl font-semibold mb-12">
          News & Blogs
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white border rounded-2xl shadow hover:shadow-lg transition p-10 flex items-center justify-center text-xl font-semibold text-gray-800"
            >
              {item.title}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
