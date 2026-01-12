export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-16">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-12">
          Contact Azroute Chess Institute
        </h1>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT – CONTACT DETAILS */}
          <div className="space-y-6 bg-gray-50 border rounded-xl p-8">
            <p className="text-gray-600">
              Be part of a dynamic team dedicated to excellence.
            </p>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Location
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Azroute Chess Institute,<br />
                Sathy Road, Amman Kovil,<br />
                Chitra Nagar, Saravanampatti,<br />
                Coimbatore – 641035
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Phone
              </h3>
              <p className="text-gray-600">
                +91 91503 41391 <br />
                +91 97406 44693
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Email
              </h3>
              <p className="text-gray-600">
                azroutechessinstitute@gmail.com
              </p>
            </div>
          </div>

          {/* RIGHT – GOOGLE MAP */}
          <div className="w-full h-[420px] rounded-xl overflow-hidden border">
            <iframe
              title="Azroute Chess Institute Location"
              src="https://www.google.com/maps?q=Azroute%20Chess%20Institute%20Saravanampatti%20Coimbatore&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
