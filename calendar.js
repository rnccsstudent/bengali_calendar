// Bengali months
const BENGALI_MONTHS = [
  "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
  "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
];

// Example festivals (Add more as needed)
const FESTIVALS = {
  "১-১": "নববর্ষ",        // ১ বৈশাখ
  "১৫-২": "পহেলা ফাল্গুন", // ১৫ ফাল্গুন
  "১৪-৩": "শহীদ দিবস",     // ১৪ ফাল্গুন (approx)
  // Format: "date-monthIndex": "Festival Name"
};

// Conversion logic (simplified & approximate for demonstration)
// Bengali year roughly Gregorian year - 593 or 594 depending on month/day
// Bengali month roughly starts mid-April
function gregorianToBengali(gDate) {
  // Calculate Bengali Year
  let year = gDate.getFullYear() - 593;
  
  // Bengali month calculation based on Gregorian month and date
  // Bengali month starts approx 14th-15th April each year
  const gMonth = gDate.getMonth();
  const gDateNum = gDate.getDate();

  // Bengali month index: if before April 14, last year’s last month range
  // Approximation: Bengali month shifts about mid of Gregorian month
  let bMonthIndex;

  if ((gMonth === 3 && gDateNum >= 14) || (gMonth > 3 && gMonth < 12) || (gMonth === 11 && gDateNum < 14)) {
    bMonthIndex = (gMonth + 8) % 12; 
  } else {
    bMonthIndex = (gMonth + 7) % 12;
    if (gMonth < 3 || (gMonth === 3 && gDateNum < 14)) {
      year--;
    }
  }

  // Calculate Bengali date approx by difference
  // Bengali months start mid-April, so adjust dates accordingly
  let bengaliDate;
  const bengaliMonthStart = new Date(gDate.getFullYear(), (bMonthIndex + 3) % 12, 14);

  if (gDate >= bengaliMonthStart) {
    bengaliDate = gDate.getDate() - 13; // Bengali month starts approx 14th
  } else {
    const prevMonthIndex = (bMonthIndex + 11) % 12;
    const prevMonthStart = new Date(gDate.getFullYear(), (prevMonthIndex + 3) % 12, 14);
    bengaliDate = Math.floor((gDate - prevMonthStart) / (1000 * 3600 * 24)) + 1;
  }

  // Handle date overflow
  if (bengaliDate < 1) bengaliDate = 1;
  if (bengaliDate > 31) bengaliDate = 31;

  return {
    year,
    monthIndex: bMonthIndex,
    monthName: BENGALI_MONTHS[bMonthIndex],
    date: bengaliDate
  };
}

// Display today's date
function displayTodayDate() {
  const today = new Date();
  const bDate = gregorianToBengali(today);
  const text = `আজকের তারিখ: ${bDate.date} ${bDate.monthName}, ${bDate.year} বাংলা বছর | ${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
  document.getElementById("today-date").innerText = text;
}

// Render month calendar
function renderCalendar(year, month) {
  const calendarBody = document.getElementById("calendar-body");
  calendarBody.innerHTML = "";

  // Set month-year header in Bengali
  document.getElementById("month-year").innerText = `${BENGALI_MONTHS[month]} ${year}`;

  // Find first day of Bengali month in Gregorian calendar
  // Bengali month starts approx 14th of Gregorian month
  const startDate = new Date(year + 593, (month + 3) % 12, 14);
  
  // Find weekday of startDate
  let startDay = startDate.getDay();

  // Number of days in Bengali month (approx 31 or 30)
  // For simplicity, let's say all months have 30 days except Boishakh(বৈশাখ) and Falgun(ফাল্গুন) 31 days
  let daysInMonth = 30;
  if (month === 0 || month === 10) daysInMonth = 31;

  // Create rows for calendar dates
  let date = 1 - startDay;
  for (let week = 0; week < 6; week++) {
    const row = document.createElement("tr");

    for (let day = 0; day < 7; day++, date++) {
      const cell = document.createElement("td");

      if (date > 0 && date <= daysInMonth) {
        // Get Gregorian date for this Bengali date
        const gregDate = new Date(year + 593, (month + 3) % 12, 14 + date - 1);

        // Bengali date number
        const bDateNum = date;

        // Gregorian date number
        const gDateNum = gregDate.getDate();

        // Check festivals
        const festKey = `${bDateNum}-${month}`;
        const festivalName = FESTIVALS[festKey];

        // Mark today
        const today = new Date();
        const isToday = today.toDateString() === gregDate.toDateString();

        if (festivalName) {
          cell.classList.add("festival");
          cell.title = festivalName;
          cell.innerHTML = `<span class="bengali-date">${bDateNum}</span><span class="gregorian-date">${gDateNum}</span><br><small>${festivalName}</small>`;
        } else {
          cell.innerHTML = `<span class="bengali-date">${bDateNum}</span><span class="gregorian-date">${gDateNum}</span>`;
        }

        if (isToday) {
          cell.classList.add("today");
        }
      } else {
        cell.innerHTML = "";
      }

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
}

let current = new Date();
let currentBengali = gregorianToBengali(current);

// Show initial calendar
displayTodayDate();
renderCalendar(currentBengali.year, currentBengali.monthIndex);

// Navigation buttons
document.getElementById("prev-month").addEventListener("click", () => {
  currentBengali.monthIndex--;
  if (currentBengali.monthIndex < 0) {
    currentBengali.monthIndex = 11;
    currentBengali.year--;
  }
  renderCalendar(currentBengali.year, currentBengali.monthIndex);
});

document.getElementById("next-month").addEventListener("click", () => {
  currentBengali.monthIndex++;
  if (currentBengali.monthIndex > 11) {
    currentBengali.monthIndex = 0;
    currentBengali.year++;
  }
  renderCalendar(currentBengali.year, currentBengali.monthIndex);
});
