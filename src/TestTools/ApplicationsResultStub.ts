export function ApplicationsResultStub() {
  return {
    success: true,
    result: {
      message: "Applications returned successfully",
      status: 200,
      data: [
        {
          userId: 1,
          id: 123,
          jobTitle: "Software Developer",
          company: "TechCorp",
          location: "New York, NY",
          appliedDate: "2024-01-10",
          contactPerson: "Jane Doe",
          contactEmail: "jane.doe@techcorp.com",
          notes: "Met at a tech conference.",
          resumeLink: "http://example.com/resume/123.pdf",
          jobDescriptionLink: "http://example.com/job/456",
          statuses: [
            {
              statusId: 1,
              applicationId: 123,
              status: "applied",
              statusDate: "2024-01-10",
              notes: "Application submitted through company website.",
            },
            {
              statusId: 2,
              applicationId: 123,
              status: "interview",
              statusDate: "2024-01-20",
              notes: "Received call for interview.",
            },
          ],
        },
      ],
    },
  };
}
