export default function FeesStructurePage() {
  return (
    <div className="bg-white text-black py-16 px-6 md:px-16">

      {/* PAGE TITLE */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-3">
          Registration & Fee Structure
        </h1>
        <p className="text-gray-700">
          Clear and transparent coaching fees for all levels
        </p>
      </div>

      {/* INDIAN STUDENTS */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold mb-6">
          Fee Structure for Indian Students
        </h2>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm text-center">
            {/* TABLE HEADER - BLUE */}
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="border px-4 py-3">Stage</th>
                <th className="border px-4 py-3">Rating / Level</th>
                <th className="border px-4 py-3">Fees ₹ (1-on-1)</th>
                <th className="border px-4 py-3">Group Fees ₹</th>
              </tr>
            </thead>

            {/* TABLE BODY - BLACK */}
            <tbody>
              {[
                ["Rookie", "New (0)", "1500", "500"],
                ["Dabbler", "Basic (0)", "1500", "500"],
                ["Beginner-1", "0 - 1400", "1500", "500"],
                ["Beginner-2", "1400 - 1500", "1500", "500"],
                ["Competent", "1500 - 1700", "1500", "500"],
                ["Intermediate", "1700 - 2000", "2500", "800"],
                ["Advanced", "2000+", "2500", "1000"],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-blue-50">
                  {row.map((cell, j) => (
                    <td key={j} className="border px-4 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NOTES - BLACK */}
        <div className="mt-6 text-sm text-black space-y-2">
          <p>
            <b>Indian Time Discount:</b> Overseas students attending between
            <b> 9 AM – 9 PM IST</b> can avail Indian fee structure.
          </p>
          <p>
            <b>Class Duration:</b> 1 hour (Intermediate & Advanced 1-on-1:
            90 minutes).
          </p>
          <p>
            <b>Registration Fee:</b> One-time registration fee of <b>$12</b>.
          </p>
        </div>
      </section>

      {/* OVERSEAS STUDENTS */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Fee Structure for Overseas Students
        </h2>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm text-center">
            {/* TABLE HEADER - BLUE */}
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="border px-4 py-3">Stage</th>
                <th className="border px-4 py-3">Rating / Level</th>
                <th className="border px-4 py-3">Fees $ (1-on-1)</th>
                <th className="border px-4 py-3">Group Fees $</th>
              </tr>
            </thead>

            {/* TABLE BODY - BLACK */}
            <tbody>
              {[
                ["Rookie", "New (0)", "30", "12"],
                ["Dabbler", "Basic (0)", "30", "12"],
                ["Beginner-1", "0 - 1400", "30", "12"],
                ["Beginner-2", "1400 - 1500", "30", "12"],
                ["Competent", "1500 - 1700", "30", "12"],
                ["Intermediate", "1700 - 2000", "45", "18"],
                ["Advanced", "2000+", "45", "18"],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-blue-50">
                  {row.map((cell, j) => (
                    <td key={j} className="border px-4 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NOTES - BLACK */}
        <div className="mt-6 text-sm text-black space-y-2">
          <p>
            <b>Indian Time Discount:</b> Overseas students attending between
            <b> 9 AM – 9 PM IST</b> can avail Indian fee structure.
          </p>
          <p>
            <b>Class Duration:</b> 1 hour (Intermediate & Advanced 1-on-1:
            90 minutes).
          </p>
          <p>
            <b>Registration Fee:</b> One-time registration fee of <b>$12</b>.
          </p>
        </div>
      </section>
    </div>
  );
}
