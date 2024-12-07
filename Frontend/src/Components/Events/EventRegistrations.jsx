import React from 'react';
import * as XLSX from 'xlsx';

const EventRegistrations = ({ event, onClose }) => {
  const exportToExcel = () => {
    // Prepare the data for export
    const exportData = event.registeredStudents.map((student) => ({
      "Full Name": student.fullName,
      Email: student.email,
      College: student.college,
      "College ID": student.collegeId,
      Event: event.title,
      Category: event.category?.categoryName || "N/A",
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");

    // Generate filename with event title and date
    const fileName = `${event.title}_registrations_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl my-8 mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-purple-400">
              Registrations for {event.title}
            </h3>

            {event.registeredStudents?.length > 0 && (
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Export to Excel
              </button>
            )}
          </div>

          {event.registeredStudents?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-200">
                <thead className="text-sm text-purple-400 uppercase bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">College</th>
                    <th className="px-6 py-3">College ID</th>
                  </tr>
                </thead>
                <tbody>
                  {event.registeredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">{student.fullName}</td>
                      <td className="px-6 py-4">{student.email}</td>
                      <td className="px-6 py-4">{student.college}</td>
                      <td className="px-6 py-4">{student.collegeId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              No registrations yet for this event.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistrations; 