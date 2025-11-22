import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";

interface City {
  name: string;
  code: string;
  region: string;
  stations: string[];
}

interface Trip {
  id: string;
  from: City;
  to: City;
  departure: string;
  arrival: string;
  operator: string;
  price: number;
  fromStation: string;
  toStation: string;
  durationHours: number;
}

const saudiCities: City[] = [
  {
    name: "Riyadh",
    code: "RUH",
    region: "Riyadh",
    stations: [
      "Riyadh Central Coach Station",
      "King Khalid International Airport",
    ],
  },
  {
    name: "Jeddah",
    code: "JED",
    region: "Makkah",
    stations: ["Jeddah Station - Al Marwah", "King Abdulaziz Airport"],
  },
  {
    name: "Makkah",
    code: "MKH",
    region: "Makkah",
    stations: ["Haramein Station", "Al Aziziyah"],
  },
  {
    name: "Medina",
    code: "MED",
    region: "Al Madinah",
    stations: ["Prince Mohammed bin Abdulaziz Airport", "Quba Station"],
  },
  {
    name: "Dammam",
    code: "DMM",
    region: "Eastern Province",
    stations: ["Dammam Railway Station", "King Fahd Airport"],
  },
  {
    name: "Khobar",
    code: "KHB",
    region: "Eastern Province",
    stations: ["Al Khobar Bus Station", "Seafront Terminal"],
  },
  {
    name: "Abha",
    code: "AHB",
    region: "Asir",
    stations: ["Abha Regional Airport", "King Abdullah Road Station"],
  },
  {
    name: "Jazan",
    code: "GIZ",
    region: "Jazan",
    stations: ["Jazan Airport", "Corniche Terminal"],
  },
  {
    name: "Tabuk",
    code: "TUU",
    region: "Tabuk",
    stations: ["Prince Sultan Airport", "Northern Gateway Station"],
  },
  {
    name: "Hail",
    code: "HAS",
    region: "Hail",
    stations: ["Hail Airport", "Al Salam Station"],
  },
  {
    name: "Najran",
    code: "EAM",
    region: "Najran",
    stations: ["Najran Airport", "South Terminal"],
  },
  {
    name: "Taif",
    code: "TIF",
    region: "Makkah",
    stations: ["Taif Airport", "Al Hawiyah Station"],
  },
  {
    name: "Al Baha",
    code: "ABT",
    region: "Al Bahah",
    stations: ["Al Aqiq Airport", "King Fahd Road Station"],
  },
  {
    name: "AlUla",
    code: "ULH",
    region: "Al Madinah",
    stations: ["Prince Abdul Majeed Airport", "Old Town Terminal"],
  },
];

const baseDurations: Record<string, number> = {
  "RUH-JED": 12,
  "RUH-MED": 10,
  "RUH-DMM": 5,
  "RUH-AHB": 13,
  "RUH-GIZ": 15,
  "RUH-TUU": 16,
  "RUH-HAS": 9,
  "RUH-EAM": 14,
  "RUH-TIF": 10,
  "RUH-ABT": 11,
  "RUH-ULH": 13,
  "JED-MED": 6,
  "JED-DMM": 12,
  "JED-AHB": 9,
  "JED-GIZ": 12,
  "JED-TUU": 14,
  "JED-HAS": 12,
  "JED-EAM": 15,
  "JED-TIF": 4,
  "JED-ABT": 6,
  "JED-ULH": 9,
  "DMM-KHB": 1.5,
  "DMM-AHB": 14,
  "DMM-GIZ": 16,
  "DMM-TUU": 18,
  "DMM-HAS": 10,
  "DMM-EAM": 15,
  "DMM-TIF": 12,
  "DMM-ABT": 13,
  "DMM-ULH": 15,
};

const operators = [
  "Saudi Lines",
  "Haramain Express",
  "Najm Coaches",
  "Najd Travel",
  "Gulf Connect",
];

const departures = ["06:00", "09:30", "14:00", "20:15"];

const getDurationHours = (from: City, to: City) => {
  const key = `${from.code}-${to.code}`;
  const reverseKey = `${to.code}-${from.code}`;
  const duration =
    baseDurations[key] ?? baseDurations[reverseKey] ?? 5 + ((from.code.charCodeAt(0) + to.code.charCodeAt(0)) % 4);

  return Number(duration);
};

const addHours = (time: string, hours: number) => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  date.setHours(date.getHours() + hours);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

const generateTrips = (cities: City[]): Trip[] =>
  cities.flatMap((from) =>
    cities
      .filter((to) => to.code !== from.code)
      .flatMap((to) =>
        departures.map((departureTime, index) => {
          const durationHours = getDurationHours(from, to);
          const operator = operators[(index + from.code.length + to.code.length) % operators.length];
          const price = Math.max(95, Math.round(durationHours * 18 + (index + 1) * 7));
          return {
            id: `${from.code}-${to.code}-${departureTime.replace(":", "")}`,
            from,
            to,
            departure: departureTime,
            arrival: addHours(departureTime, durationHours),
            operator,
            price,
            fromStation: from.stations[index % from.stations.length],
            toStation: to.stations[(index + 1) % to.stations.length],
            durationHours,
          };
        }),
      ),
  );

const TripPlanner = () => {
  const [from, setFrom] = useState(saudiCities[0].code);
  const [to, setTo] = useState(saudiCities[1].code);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const trips = useMemo(() => generateTrips(saudiCities), []);

  const filteredTrips = trips.filter((trip) => trip.from.code === from && trip.to.code === to);
  const selectedTrip = filteredTrips.find((trip) => trip.id === selectedTripId) ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-700 via-cyan-800 to-slate-900 text-white">
      <Head>
        <title>Saudi Routes Planner</title>
      </Head>
      <header className="container mx-auto px-5 py-12">
        <p className="uppercase tracking-[0.3em] text-cyan-200 text-sm font-semibold mb-3">شبكة الرحلات</p>
        <h1 className="text-4xl font-bold leading-tight mb-4">اختر وجهتك داخل المملكة</h1>
        <p className="text-cyan-100 max-w-3xl">
          تصفَّح قائمة من المدن ومحطات النقل الرئيسية في السعودية، وحدد مسارك ليتم توليد الرحلات المتاحة تلقائياً في
          كلا الاتجاهين. جرّب المسار من الرياض إلى جدة للتأكد من الانتقال إلى قائمة الرحلات ثم مشاهدة خطوة التأكيد
          الأخيرة مع ملخص الحجز.
        </p>
      </header>

      <main className="container mx-auto px-5 pb-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <section className="bg-white text-slate-900 rounded-3xl shadow-2xl p-6 lg:p-8">
          <h2 className="text-2xl font-bold mb-4">تخطيط الرحلة</h2>
          <p className="text-slate-600 mb-6">اختر نقطة الانطلاق والوصول من القائمة المتاحة أدناه لتوليد مسارات جاهزة للاختبار.</p>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col text-sm font-semibold text-slate-700">
              من (المدينة)
              <select
                className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none"
                value={from}
                onChange={(event) => {
                  setFrom(event.target.value);
                  setSelectedTripId(null);
                }}
              >
                {saudiCities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name} — {city.region}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-sm font-semibold text-slate-700">
              إلى (المدينة)
              <select
                className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none"
                value={to}
                onChange={(event) => {
                  setTo(event.target.value);
                  setSelectedTripId(null);
                }}
              >
                {saudiCities
                  .filter((city) => city.code !== from)
                  .map((city) => (
                    <option key={city.code} value={city.code}>
                      {city.name} — {city.region}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold mb-1">محطات الوجهة المختارة</p>
            <p className="text-slate-600">{saudiCities.find((city) => city.code === from)?.stations.join(" · ")}</p>
            <p className="text-slate-600">{saudiCities.find((city) => city.code === to)?.stations.join(" · ")}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-3">الرحلات المتاحة</h3>
            <div className="grid gap-4">
              {filteredTrips.map((trip) => (
                <article
                  key={trip.id}
                  className={`rounded-2xl border ${
                    selectedTripId === trip.id ? "border-cyan-600 shadow-lg" : "border-slate-200"
                  } bg-white p-4 shadow-sm transition hover:border-cyan-300`}
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-cyan-700 font-semibold">{trip.operator}</p>
                      <h4 className="text-xl font-bold text-slate-900">
                        {trip.from.name} → {trip.to.name}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {trip.fromStation} إلى {trip.toStation}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-900">
                        {trip.departure} — {trip.arrival}
                      </p>
                      <p className="text-sm text-slate-600">مدة الرحلة: {trip.durationHours} ساعة</p>
                      <p className="text-sm font-bold text-cyan-800">{trip.price} ر.س</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-slate-700">
                      يشمل التسعير الأمتعة القياسية وإمكانية تعديل التذاكر قبل 24 ساعة من الانطلاق.
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="rounded-xl border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
                        onClick={() => setSelectedTripId(trip.id)}
                      >
                        اختيار هذه الرحلة
                      </button>
                      <Link
                        href="#booking"
                        className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-cyan-700"
                        onClick={() => setSelectedTripId(trip.id)}
                      >
                        متابعة للحجز
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside id="booking" className="bg-cyan-900/60 border border-cyan-700 rounded-3xl p-6 lg:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">الخطوة الأخيرة</h2>
          <p className="text-cyan-100 mb-6">
            بعد اختيار الرحلة، ستظهر بيانات التأكيد هنا. استخدم هذا الملخص للتأكد من تجربة المسار (مثلاً الرياض → جدة)
            قبل المتابعة مع بوابة الدفع أو نظام التذاكر الخاص بك.
          </p>

          {selectedTrip ? (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-cyan-100">شركة النقل</p>
                <p className="text-lg font-semibold">{selectedTrip.operator}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-cyan-100">المسار</p>
                <p className="text-lg font-semibold">
                  {selectedTrip.from.name} ({selectedTrip.fromStation}) → {selectedTrip.to.name} ({selectedTrip.toStation})
                </p>
                <p className="text-sm text-cyan-100 mt-1">
                  {selectedTrip.departure} — {selectedTrip.arrival} · {selectedTrip.durationHours} ساعة
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-100">التكلفة الإجمالية</p>
                  <p className="text-2xl font-bold">{selectedTrip.price} ر.س</p>
                </div>
                <button className="rounded-xl bg-white text-cyan-800 px-4 py-2 font-semibold shadow hover:bg-cyan-50">
                  تأكيد وحجز الرحلة
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-cyan-500 p-6 text-cyan-100 text-sm">
              اختر رحلة من القائمة على اليسار لتظهر لك تفاصيل الحجز هنا.
            </div>
          )}
        </aside>
      </main>

      <footer className="container mx-auto px-5 pb-10 text-sm text-cyan-100">
        <p>
          يتم توليد الرحلات تلقائياً بين جميع المدن والمحطات المذكورة لتسهيل اختبارات تجربة المستخدم، بما في ذلك المسار من
          الرياض إلى جدة.
        </p>
      </footer>
    </div>
  );
};

export default TripPlanner;
