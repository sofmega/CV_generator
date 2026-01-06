// frontend/src/product/blog/BlogIndexPage.tsx
import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import Card from "../../components/ui/Card";
import { BLOG_POSTS } from "./posts";

export default function BlogIndexPage() {
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const canonical = `${siteUrl}/blog`;
  const ogImage = `${siteUrl}/logo.png`;

  return (
    <>
      <Helmet>
        <title>Blog – CV & Cover Letter Tips (ATS, Templates, Examples)</title>
        <meta
          name="description"
          content="Practical guides to write better CVs and cover letters: ATS tips, examples, templates, and job search strategies."
        />

        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:title" content="Blog – CV & Cover Letter Tips" />
        <meta
          property="og:description"
          content="Practical guides to write better CVs and cover letters: ATS tips, examples, templates."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900">Blog</h1>
            <p className="text-gray-600 mt-3">
              Guides to improve your CV, cover letter, and interview chances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post) => (
              <Card key={post.slug} className="p-6 rounded-3xl shadow-lg">
                <p className="text-sm text-gray-500">{post.date}</p>

                <h2 className="text-2xl font-black text-gray-900 mt-2">
                  {post.title}
                </h2>

                <p className="text-gray-600 mt-2">{post.description}</p>

                <div className="mt-5">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-blue-700 font-semibold hover:underline"
                  >
                    Read article →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
