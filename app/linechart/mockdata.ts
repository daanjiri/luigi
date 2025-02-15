// Define the type for the mock data entries
export interface MockDataEntry {
  date: Date;
  level: number;
}

// Explicitly type the mockData array
// export const mockData: MockDataEntry[] = [
//   // January 2024 (31 days)
//   { date: new Date(2024, 0, 1), level: 3 },
//   { date: new Date(2024, 0, 2), level: 7 },
//   { date: new Date(2024, 0, 3), level: 5 },
//   { date: new Date(2024, 0, 4), level: 8 },
//   { date: new Date(2024, 0, 5), level: 2 },
//   { date: new Date(2024, 0, 6), level: 6 },
//   { date: new Date(2024, 0, 7), level: 4 },
//   { date: new Date(2024, 0, 8), level: 9 },
//   { date: new Date(2024, 0, 9), level: 3 },
//   { date: new Date(2024, 0, 10), level: 7 },
//   { date: new Date(2024, 0, 11), level: 5 },
//   { date: new Date(2024, 0, 12), level: 8 },
//   { date: new Date(2024, 0, 13), level: 2 },
//   { date: new Date(2024, 0, 14), level: 6 },
//   { date: new Date(2024, 0, 15), level: 4 },
//   { date: new Date(2024, 0, 16), level: 9 },
//   { date: new Date(2024, 0, 17), level: 3 },
//   { date: new Date(2024, 0, 18), level: 7 },
//   { date: new Date(2024, 0, 19), level: 5 },
//   { date: new Date(2024, 0, 20), level: 8 },
//   { date: new Date(2024, 0, 21), level: 2 },
//   { date: new Date(2024, 0, 22), level: 6 },
//   { date: new Date(2024, 0, 23), level: 4 },
//   { date: new Date(2024, 0, 24), level: 9 },
//   { date: new Date(2024, 0, 25), level: 3 },
//   { date: new Date(2024, 0, 26), level: 7 },
//   { date: new Date(2024, 0, 27), level: 5 },
//   { date: new Date(2024, 0, 28), level: 8 },
//   { date: new Date(2024, 0, 29), level: 2 },
//   { date: new Date(2024, 0, 30), level: 6 },
//   { date: new Date(2024, 0, 31), level: 4 },

//   // February 2024 (29 days - leap year)
//   { date: new Date(2024, 1, 1), level: 6 },
//   { date: new Date(2024, 1, 2), level: 9 },
//   { date: new Date(2024, 1, 3), level: 1 },
//   { date: new Date(2024, 1, 4), level: 5 },
//   { date: new Date(2024, 1, 5), level: 8 },
//   { date: new Date(2024, 1, 6), level: 3 },
//   { date: new Date(2024, 1, 7), level: 7 },
//   { date: new Date(2024, 1, 8), level: 4 },
//   { date: new Date(2024, 1, 9), level: 6 },
//   { date: new Date(2024, 1, 10), level: 2 },
//   { date: new Date(2024, 1, 11), level: 9 },
//   { date: new Date(2024, 1, 12), level: 5 },
//   { date: new Date(2024, 1, 13), level: 7 },
//   { date: new Date(2024, 1, 14), level: 3 },
//   { date: new Date(2024, 1, 15), level: 8 },
//   { date: new Date(2024, 1, 16), level: 4 },
//   { date: new Date(2024, 1, 17), level: 6 },
//   { date: new Date(2024, 1, 18), level: 1 },
//   { date: new Date(2024, 1, 19), level: 5 },
//   { date: new Date(2024, 1, 20), level: 9 },
//   { date: new Date(2024, 1, 21), level: 2 },
//   { date: new Date(2024, 1, 22), level: 7 },
//   { date: new Date(2024, 1, 23), level: 4 },
//   { date: new Date(2024, 1, 24), level: 8 },
//   { date: new Date(2024, 1, 25), level: 3 },
//   { date: new Date(2024, 1, 26), level: 6 },
//   { date: new Date(2024, 1, 27), level: 9 },
//   { date: new Date(2024, 1, 28), level: 5 },
//   { date: new Date(2024, 1, 29), level: 7 },
// ];

// // Generate mock data for each day from 2023 to 2025
// for (let year = 2023; year <= 2025; year++) {
//   for (let month = 0; month < 12; month++) {
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     for (let day = 1; day <= daysInMonth; day++) {
//       mockData.push({
//         date: new Date(year, month, day),
//         level: Math.floor(Math.random() * 10) + 1, // Random level between 1 and 10
//       });
//     }
//   }
// }

export function generateMockDataTwoYears(): MockDataEntry[] {
  const mockData: MockDataEntry[] = [];
  const today = new Date();
  const startDate = new Date();
  // Set start date to two years ago from today
  startDate.setFullYear(today.getFullYear() - 2);

  // Use a copy of startDate to iterate day-by-day until today
  const currentDate = new Date(startDate);
  while (currentDate <= today) {
    mockData.push({
      date: new Date(currentDate),
      level: Math.floor(Math.random() * 10) + 1, // Random level between 1 and 10
    });
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return mockData;
}

export const mockData = generateMockDataTwoYears();
