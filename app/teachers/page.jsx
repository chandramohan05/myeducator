'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/app/components/ui/card';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to fetch teachers');
        }

        setTeachers(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!teachers.length) {
    return (
      <div className="text-center mt-10">
        <p>No coaches found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Coaches</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <Card
            key={teacher.id}
            className="hover:shadow-lg transition-shadow duration-300 cursor-default"
          >
            <CardHeader>
              <div className="flex items-center space-x-4">
                {teacher.profileImage ? (
                  <img
                    src={teacher.profileImage}
                    alt={teacher.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center" />
                )}
                <div>
                  <h2 className="text-xl font-semibold">{teacher.name}</h2>

                  {teacher.department && (
                    <p className="text-gray-600">{teacher.department}</p>
                  )}

                  {teacher.location && (
                    <p className="text-gray-500 text-sm">{teacher.location}</p>
                  )}
                </div>
              </div>
            </CardHeader>

            {teacher.bio && (
              <CardContent>
                <p className="text-sm text-gray-700 line-clamp-3">{teacher.bio}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeachersPage;
