"""
CSV에서 30명(드라이버 24 + 워커 6) 추려서 mock 데이터 TS 코드 생성.

실행:
  python3 docs/data/generate_mocks.py > /tmp/mocks.ts

생성:
  /tmp/mocks.ts — MOCK_DRIVERS, MOCK_WORKERS 두 블럭
"""
import random

# ── 깔끔한 데이터만 추린 raw list (요금 정상, consent 있음, 이름 중복 없음) ──
# Format: (이름, DOB, city, license_class, vehicles, services, exp_text, rate, owns_vehicle)
# vehicles: comma-separated codes from {sedan, suv, mpv, van}
# services: comma-separated from {designated, daily, hourly, airport, commute, intercity, event}
DRIVERS = [
    ("Imam Wahyudi",      1996, "Bekasi",    "SIM A",     "sedan,suv,mpv,van",     "designated,daily,intercity",         "5+",   30000, True),
    ("Aji Permana",       2004, "Other",     "SIM A",     "suv,mpv,van",           "daily",                              "3-5",  50000, False),
    ("Nurhasan",          1990, "Bekasi",    "SIM A",     "sedan,suv,mpv,van",     "designated",                         "5+",   26000, True),
    ("Masrur",            1984, "Other",     "SIM A",     "sedan,suv,mpv",         "designated,intercity,event,daily",   "5+",   30000, False),
    ("Febry",             1980, "Tangerang", "SIM A",     "mpv",                   "designated,daily,hourly,intercity,event", "3-5", 30000, False),
    ("Galih Nurgalih",    1987, "Other",     "SIM B I",   "sedan,suv,mpv",         "daily,intercity",                    "1-3",  25000, False),
    ("Taufik Hidayat",    2004, "Tangerang", "SIM A",     "sedan,suv,mpv",         "designated,daily,intercity",         "1-3",  25000, False),
    ("Nandang Ahmad Yani",1992, "Other",     "SIM B I",   "sedan,suv,mpv",         "daily,intercity,designated",         "5+",   30000, False),
    ("Fazri",             1990, "Tangerang", "SIM A",     "sedan,suv",             "designated,daily,hourly,intercity",  "3-5",  25000, False),
    ("Andreas Noto Nugroho",1983,"Other",    "SIM A",     "sedan",                 "designated,daily,hourly,airport,commute,intercity,event", "5+", 30000, False),
    ("Ilham Faiz Pratama",2000, "Tangerang", "SIM A",     "sedan,suv,mpv",         "designated,daily,hourly,intercity",  "3-5",  25000, False),
    ("M. Iqbal",          1991, "Bekasi",    "SIM A",     "sedan,suv,mpv,van",     "designated,daily,hourly,airport,commute,intercity,event", "3-5", 30000, False),
    ("Rizki Fauzi",       1987, "Tangerang", "SIM A",     "sedan,suv,mpv,van",     "designated,daily,hourly,airport,commute,intercity,event", "5+", 30000, False),
    ("Zaenal Arifin",     1982, "Tangerang", "SIM A",     "sedan,mpv",             "designated,daily,hourly,airport,commute,intercity,event", "1-3", 25000, False),
    ("Achmad Rozali",     1993, "Tangerang", "SIM A",     "sedan,suv,mpv",         "designated,daily,hourly,airport,intercity,event", "5+", 30000, False),
    ("Adi Doris Siswanto",1982, "Other",     "SIM A",     "sedan,suv,mpv,van",     "designated,daily,hourly,airport,commute,intercity,event", "5+", 25000, False),
    ("Ade Irmawan",       1995, "Bogor",     "SIM A",     "sedan",                 "designated,daily,hourly,airport,intercity", "5+", 25000, False),
    ("Raihan Lutfiansyah",2003, "Tangerang", "SIM A",     "sedan,suv,mpv,van",     "designated,daily,hourly,airport,commute,intercity,event", "5+", 30000, False),
    ("Endang Setiawan",   1991, "Tangerang", "SIM A",     "sedan,suv,mpv",         "designated,daily,hourly,airport,commute,intercity,event", "3-5", 25000, False),
    ("Lukman Nur Hakim",  1986, "Other",     "SIM A",     "sedan",                 "designated,daily,hourly,intercity",  "1-3",  25000, False),
    ("Mardiansyah",       1988, "Other",     "SIM A",     "sedan,suv,mpv",         "designated,daily,hourly,airport,commute,intercity,event", "3-5", 25000, False),
    ("Epen Boy",          1980, "Tangerang", "SIM A",     "mpv,sedan,suv,van",     "designated,daily,hourly,airport,commute,intercity,event", "5+", 70000, False),
    ("Sholeh Amin",       1978, "Tangerang", "SIM A",     "van",                   "designated,daily,hourly,airport,commute,intercity,event", "1-3", 25000, False),
    ("Asep Mulyana",      1991, "Other",     "SIM A",     "van",                   "designated,daily,hourly,airport,commute,intercity,event", "5+", 25000, False),
]

# Worker(ART): (이름, DOB, city, exp_text, rate, skill_codes)
# skill_codes: comma-separated from {cleaning, cooking, washing, childcare, elderly, shopping, deepclean}
WORKERS = [
    ("Renny Ivonnie",         1979, "Tangerang", "1-3", 25000, "cleaning,cooking,washing,shopping,deepclean"),
    ("Brilian Zabrina",       2001, "Other",     "3-5", 15000, "cleaning,cooking,washing,shopping,deepclean"),
    ("Fitri Yatun",           1994, "Other",     "5+",  20000, "cleaning,washing,childcare,shopping,deepclean"),
    ("Sarinah Sohari",        1991, "Tangerang", "1-3", 15000, "cleaning,cooking,washing,childcare,elderly,shopping"),
    ("Yeni",                  1975, "Bekasi",    "1-3", 25000, "cleaning,cooking,washing,childcare,elderly,shopping,deepclean"),
    ("Rani Oktaviani",        2002, "Other",     "5+",  30000, "cleaning,cooking,washing,childcare,elderly,shopping"),
]

# ── Map config ─────────────────────────────────────────────────
# DEMO_REGION center
CENTER_LAT = -6.2488
CENTER_LNG = 106.8052
SPREAD     = 0.005  # ±500m

LOCATIONS = [
    "Kebayoran Baru", "Senopati", "Cilandak", "Pondok Indah", "Kemang",
    "Menteng", "Fatmawati", "Pejaten", "Cipete", "Radio Dalam",
    "Blok M", "Gandaria", "Mampang", "Tebet", "Pancoran",
]

EXP_TO_YEARS = {"<1": 0, "1-3": 2, "3-5": 4, "5+": 7}

SKILL_LABELS = {
    "cleaning":  "Beberes",
    "cooking":   "Masak",
    "washing":   "Cuci",
    "childcare": "Asuh Anak",
    "elderly":   "Lansia",
    "shopping":  "Belanja",
    "deepclean": "Deep Clean",
}


def gen_lat_lng(rng):
    return (
        CENTER_LAT + rng.uniform(-SPREAD, SPREAD),
        CENTER_LNG + rng.uniform(-SPREAD, SPREAD),
    )

def gen_rating(rng):
    # bias high, 4.5–5.0
    return round(4.5 + rng.random() * 0.5, 1)

def gen_temp(rng, exp_years):
    base = 50 + exp_years * 3
    return round(base + rng.uniform(-8, 12), 1)

def gen_jobs(rng, exp_years):
    return int(rng.uniform(30, 80) + exp_years * 25)


def first_name(full):
    return full.split()[0]


def emit_drivers():
    rng = random.Random(42)
    print("export const MOCK_DRIVERS: MockDriver[] = [")
    for idx, (name, dob, city, lic, vehicles, services, exp, rate, owns) in enumerate(DRIVERS, 1):
        photo_idx = ((idx - 1) % 6) + 1
        lat, lng = gen_lat_lng(rng)
        exp_y    = EXP_TO_YEARS[exp]
        loc      = LOCATIONS[(idx - 1) % len(LOCATIONS)]
        avail    = rng.random() > 0.15  # ~85% available
        vehicles_arr = "[" + ", ".join(f"'{v}'" for v in vehicles.split(",")) + "]"
        services_arr = "[" + ", ".join(f"'{s}'" for s in services.split(",")) + "]"
        print(f"  {{")
        print(f"    id: 'd{idx}', name: '{name}', firstName: '{first_name(name)}',")
        print(f"    photo: D{photo_idx}, location: '{loc}',")
        print(f"    lat: {lat:.4f}, lng: {lng:.4f},")
        print(f"    rating: {gen_rating(rng)}, pricePerHour: {rate}, totalJobs: {gen_jobs(rng, exp_y)},")
        print(f"    isAvailable: {'true' if avail else 'false'}, isVerified: true, experienceYears: {exp_y},")
        print(f"    drivableTypes: {vehicles_arr}, transmission: 'both',")
        print(f"    services: {services_arr},")
        print(f"    licenseClass: '{lic}',")
        print(f"    temperature: {gen_temp(rng, exp_y)},")
        print(f"  }},")
    print("];")


def emit_workers():
    rng = random.Random(7)
    print()
    print("const MOCK_WORKERS: MockWorker[] = [")
    for idx, (name, dob, city, exp, rate, skills) in enumerate(WORKERS, 1):
        photo_var = ["W1", "W2", "W3", "W4", "W5", "W6"][((idx - 1) % 6)]
        exp_y     = EXP_TO_YEARS[exp]
        loc       = LOCATIONS[(idx - 1) % len(LOCATIONS)]
        avail     = rng.random() > 0.15
        # display: 2-3 skills max
        skills_keys = skills.split(",")
        random.Random(idx).shuffle(skills_keys)
        skills_keys = skills_keys[:3]
        skills_arr  = "[" + ", ".join(f"'{SKILL_LABELS[s]}'" for s in skills_keys) + "]"
        print(f"  {{ id:'w{idx}', name:'{name}', photo:{photo_var}, location:'{loc}', "
              f"rating:{gen_rating(rng)}, pricePerHour:{rate}, totalJobs:{gen_jobs(rng, exp_y)}, "
              f"isAvailable:{'true' if avail else 'false'}, "
              f"skills:{skills_arr}, "
              f"isVerified:true, temperature:{gen_temp(rng, exp_y)} }},")
    print("];")


if __name__ == "__main__":
    emit_drivers()
    emit_workers()
