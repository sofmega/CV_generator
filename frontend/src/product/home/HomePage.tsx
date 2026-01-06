// frontend/src/product/home/HomePage.tsx
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Helmet } from "@dr.pogodin/react-helmet";

export default function HomePage() {
  const canonical = `${window.location.origin}/`;

  return (
    <>
      <Helmet>
        <title>Job Incubateur – Free AI CV & Cover Letter Generator</title>
        <meta
          name="description"
          content="Generate professional CVs and cover letters using AI. Upload your resume and get job-ready documents in minutes."
        />

        <link rel="canonical" href={canonical} />

        <meta property="og:title" content="Job Incubateur – Free AI CV & Cover Letter Generator" />
        <meta
          property="og:description"
          content="Generate professional CVs and cover letters using AI. Upload your resume and get job-ready documents in minutes."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
      </Helmet>

      <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-blue-700 font-semibold tracking-wide">
              AI JOB APPLICATION ASSISTANT
            </p>
            <h1 className="text-4xl font-black text-gray-900 mt-2">
              Choose what you want to generate
            </h1>
            <p className="text-gray-600 mt-3">
              Create a tailored CV or a cover letter optimized for the job offer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 rounded-3xl shadow-lg">
              <h2 className="text-2xl font-black text-gray-900">AI CV Generator</h2>
              <p className="text-gray-600 mt-2">
                Generate a professional CV (PDF) tailored to your job offer.
              </p>

              <div className="mt-6">
                <Link to="/ai-cv-generator">
                  <Button className="w-full">Generate CV</Button>
                </Link>
              </div>
            </Card>

            <Card className="p-8 rounded-3xl shadow-lg">
              <h2 className="text-2xl font-black text-gray-900">
                AI Cover Letter Generator
              </h2>
              <p className="text-gray-600 mt-2">
                Generate a convincing cover letter (PDF) tailored to your job offer.
              </p>

              <div className="mt-6">
                <Link to="/cover-letter-generator">
                  <Button className="w-full">Generate Cover Letter</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
