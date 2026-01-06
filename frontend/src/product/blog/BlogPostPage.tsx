// frontend/src/product/blog/BlogPostPage.tsx
import { Link, useParams } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import Card from "../../components/ui/Card";
import { getPostBySlug } from "./posts";

function renderContent(text: string) {
  const lines = text.split("\n");

  return lines.map((line, idx) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-2xl font-black text-gray-900 mt-6">
          {line.replace("## ", "")}
        </h2>
      );
    }

    if (!line.trim()) return <div key={idx} className="h-3" />;

    return (
      <p key={idx} className="text-gray-700 leading-7">
        {line}
      </p>
    );
  });
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : null;

  const siteUrl = import.meta.env.VITE_SITE_URL;
  const canonical = slug ? `${siteUrl}/blog/${slug}` : `${siteUrl}/blog`;
  const ogImage = `${siteUrl}/logo.png`;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 max-w-xl w-full">
          <h1 className="text-2xl font-black text-gray-900">Post not found</h1>
          <p className="text-gray-600 mt-2">
            This article doesn’t exist. Go back to the blog.
          </p>

          <Link
            to="/blog"
            className="text-blue-700 font-semibold hover:underline mt-4 inline-block"
          >
            ← Back to Blog
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Article JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            mainEntityOfPage: canonical,
            author: {
              "@type": "Organization",
              name: "Job Incubateur",
            },
            publisher: {
              "@type": "Organization",
              name: "Job Incubateur",
              logo: {
                "@type": "ImageObject",
                url: ogImage,
              },
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              to="/blog"
              className="text-blue-700 font-semibold hover:underline"
            >
              ← Back to Blog
            </Link>
          </div>

          <Card className="p-8 rounded-3xl shadow-lg">
            <p className="text-sm text-gray-500">{post.date}</p>

            <h1 className="text-4xl font-black text-gray-900 mt-2">
              {post.title}
            </h1>

            <p className="text-gray-600 mt-3">{post.description}</p>

            <div className="mt-8 space-y-3">
              {renderContent(post.content)}
            </div>

            <div className="mt-10 border-t pt-6">
              <p className="text-gray-700 font-semibold">
                Want a tailored document fast?
              </p>

              <div className="mt-2 flex flex-wrap gap-3">
                <Link
                  to="/ai-cv-generator"
                  className="text-blue-700 font-semibold hover:underline"
                >
                  AI CV Generator →
                </Link>

                <Link
                  to="/cover-letter-generator"
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Cover Letter Generator →
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
