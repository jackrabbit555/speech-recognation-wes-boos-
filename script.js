// تعریف یک شیء برای استفاده از SpeechRecognition یا webkitSpeechRecognition
// Defining a SpeechRecognition object or its webkit alternative
window.SpeechRecognitionAlternative =
  window.SpeechRecognitionAlternative || window.webkitSpeechRecognition;

// انتخاب المان اصلی برای قرار دادن متن و تعریف پاراگراف و اسپن برای نمایش متن
// Selecting the main container element and defining a paragraph and span for displaying text
let container = document.querySelector(".container");
let p = document.createElement("p");
p.setAttribute("contenteditable", "true"); // قابلیت ویرایش پاراگراف
let span = document.createElement("span");

// ایجاد نمونه‌ای از SpeechRecognition و تنظیم زبان به فارسی
// Creating an instance of SpeechRecognition and setting the language to Persian
const recognition = new SpeechRecognitionAlternative();
recognition.lang = "fa-IR";
recognition.interimResults = true; // فعال کردن نتایج موقت

// شروع شنیدن گفتار
// Starting speech recognition
recognition.start();

// اجرای مجدد پس از پایان هر سیکل شنیدن
// Restarting recognition after each session ends
recognition.addEventListener("end", recognition.start);

// اضافه کردن لیسنر برای دریافت نتایج گفتار
// Adding an event listener to handle speech recognition results
recognition.addEventListener("result", (event) => {
  // افزودن پاراگراف به کانتینر
  // Adding the paragraph to the container
  container.appendChild(p);

  // پردازش نتایج گفتار به متن
  // Processing speech-to-text results
  let transcript = Array.from(event.results)
    .map((result) => result[0]) // انتخاب اولین نتیجه
    .map((result) => result.transcript) // تبدیل نتیجه به متن
    .join(" "); // اتصال متن‌ها

  // تبدیل کلمه "علامت سوال" به علامت سوال (؟)
  // Replacing the phrase "علامت سوال" with the actual question mark (?)
  if (transcript.includes("علامت سوال")) {
    transcript = transcript.replace("علامت سوال", "?");
  }

  // شناسایی فرمان "خط بعدی" و افزودن پاراگراف جدید
  // Handling the "خط بعدی" command to create a new paragraph
  if (transcript.includes("خط بعدی") && event.results[0].isFinal) {
    transcript = ""; // پاک کردن متن فعلی
    p.setAttribute("contenteditable", "true"); // قابل ویرایش کردن متن جدید

    p = document.createElement("p"); // ایجاد پاراگراف جدید
    container.appendChild(p); // افزودن به کانتینر
  }

  // شناسایی فرمان "صفحه پاک شود" و پاک کردن محتوا
  // Handling "صفحه پاک شود" command to clear the content
  if (transcript.includes("صفحه پاک شود") && event.results[0].isFinal) {
    container.innerHTML = ""; // پاک کردن کانتینر
    p.innerHTML = ""; // پاک کردن پاراگراف
  }

  // افزودن اسپن جدید پس از اتمام نتیجه نهایی
  // Adding a new span when the result is final
  if (event.results[0].isFinal) {
    span = document.createElement("span");
    p.appendChild(span);
  }

  // تغییر رنگ صفحه به نارنجی در صورت تشخیص فرمان "صفحه نارنجی"
  // Changing page color to orange on "صفحه نارنجی" command
  if (transcript.includes("صفحه نارنجی")) {
    transcript = ""; // پاک کردن متن فعلی
    document.body.classList.add("orange"); // اضافه کردن کلاس نارنجی
  }

  // تغییر رنگ صفحه به آبی در صورت تشخیص فرمان "صفحه آبی"
  // Changing page color to blue on "صفحه آبی" command
  if (transcript.includes("صفحه آبی")) {
    transcript = ""; // پاک کردن متن فعلی
    document.body.classList.add("blue"); // اضافه کردن کلاس آبی
  }

  // تغییر رنگ صفحه به خاکستری در صورت تشخیص فرمان "صفحه خاکستری"
  // Changing page color to gray on "صفحه خاکستری" command
  if (transcript.includes("صفحه خاکستری")) {
    transcript = ""; // پاک کردن متن فعلی
    document.body.classList.add("gray"); // اضافه کردن کلاس خاکستری
  }

  // تغییر زبان به انگلیسی با فرمان "انگلیسی تایپ کن"
  // Switching to English language on "انگلیسی تایپ کن" command
  if (transcript.includes("انگلیسی تایپ کن") && event.results[0].isFinal) {
    recognition.stop(); // متوقف کردن تشخیص گفتار
    recognition.lang = "en-US"; // تغییر زبان به انگلیسی
    transcript = ""; // پاک کردن متن
    p.setAttribute("contenteditable", "true"); // قابلیت ویرایش متن جدید

    p = document.createElement("p"); // ایجاد پاراگراف جدید
    p.setAttribute("dir", "ltr"); // تنظیم جهت چپ به راست
    container.appendChild(p); // افزودن به کانتینر
  }

  // تغییر زبان به فارسی با فرمان "type in Persian"
  // Switching back to Persian language on "type in Persian" command
  if (transcript.includes("type in Persian") && event.results[0].isFinal) {
    recognition.stop(); // متوقف کردن تشخیص گفتار
    recognition.lang = "fa-IR"; // تغییر زبان به فارسی
    transcript = ""; // پاک کردن متن
    p.setAttribute("contenteditable", "true"); // قابلیت ویرایش متن جدید

    p = document.createElement("p"); // ایجاد پاراگراف جدید
    p.setAttribute("dir", "rtl"); // تنظیم جهت راست به چپ
    container.appendChild(p); // افزودن به کانتینر
  }

  // اضافه کردن متن به اسپن و پاراگراف
  // Adding the transcript to the span and paragraph
  span.textContent = transcript + " ";
  p.appendChild(span);

  // نمایش متن در کنسول برای تست و دیباگ
  // Logging the transcript in the console for debugging
  console.log(transcript);
});
