export interface MockEntity {
  id: string;
  templeId: string;
  [key: string]: unknown;
}

const STORAGE_KEY = "temple_erp_mock_data_v4";

interface MockDataState {
  devotees: MockEntity[];
  donations: MockEntity[];
  poojaSevas: MockEntity[];
  assets: MockEntity[];
  campaigns: MockEntity[];
  rentalVenues: MockEntity[];
  events: MockEntity[];
  temples: { id: string; name: string; [key: string]: unknown }[];
  users: any[];
  admins: any[];
}

// ═══════════════════════════════════════════════════════════════════════════════
//  COMPREHENSIVE MOCK DATA — One module, all data
// ═══════════════════════════════════════════════════════════════════════════════

const INITIAL_STATE: MockDataState = {

  // ─────────────────────────────────────────────────────────────────────────────
  //  TEMPLES (used by Dashboard, TempleOnboard, Enrollments, temple selector)
  // ─────────────────────────────────────────────────────────────────────────────
  temples: [
    {
      id: "t1",
      name: "Sri Krishna Temple",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      address: "123 Temple Road, Jayanagar 4th Block, Bangalore 560041",
      description: "A historic temple dedicated to Lord Krishna, serving devotees since 1952.",
      historicalContext: "Built during the cultural renaissance of South India, this temple has been a centre for Bhagavata traditions.",
      bio: "Sri Krishna Temple is a vibrant centre for spiritual learning, daily rituals, community services, and cultural events.",
      status: "active",
      logo: "/temple1.png",
      history: [
        { period: "Founding Era (1952)", description: "Established by the Shri Vaishnava community", logo: "/temple1.png", banner: "/temple1.png" },
        { period: "Expansion (1985)", description: "New Rajagopuram and Kalyana Mandapam added" },
      ],
      superadmin: {
        firstName: "Rajesh",
        lastName: "Sharma",
        email: "rajesh.sharma@srikrishna.org",
        bio: "Head Priest & Administrator with 20 years of temple management experience",
        role: { name: "superadmin" },
      },
      users: [
        { firstName: "Rajesh", lastName: "Sharma", email: "rajesh.sharma@srikrishna.org", role: { name: "superadmin" }, bio: "Head Administrator" },
        { firstName: "Priya", lastName: "Devi", email: "priya.devi@srikrishna.org", role: { name: "temple-admin" }, bio: "Operations Manager" },
      ],
    },
    {
      id: "t2",
      name: "Kasi Viswanathar Temple",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      address: "45 East Mada Street, Mylapore, Chennai 600004",
      description: "An ancient Shiva temple renowned for its Dravidian architecture and daily Rudrabhishekam.",
      historicalContext: "Dating back to the 7th century Pallava dynasty, this temple is an architectural marvel.",
      bio: "Kasi Viswanathar Temple is one of the oldest Shiva temples in South India.",
      status: "active",
      logo: "/temple2.png",
      history: [
        { period: "Ancient Origins (7th Century)", description: "Pallava dynasty construction with classical Dravidian gopuram" },
      ],
      superadmin: {
        firstName: "Venkat",
        lastName: "Raman",
        email: "venkat.raman@kasiviswa.org",
        bio: "Temple Trustee & Senior Administrator",
        role: { name: "superadmin" },
      },
      users: [
        { firstName: "Venkat", lastName: "Raman", email: "venkat.raman@kasiviswa.org", role: { name: "superadmin" }, bio: "Temple Trustee" },
      ],
    },
    {
      id: "t3",
      name: "Sri Meenakshi Amman Temple",
      city: "Madurai",
      state: "Tamil Nadu",
      country: "India",
      address: "1 Temple Tower Street, Madurai 625001",
      description: "World-famous temple dedicated to Goddess Meenakshi and Lord Sundareswarar.",
      historicalContext: "A UNESCO Heritage nominee dating back to 6th century BCE with 14 magnificent gopurams.",
      bio: "This historic temple complex spans 14 acres and hosts over 15,000 visitors daily.",
      status: "active",
      logo: "/temple3.png",
      history: [
        { period: "Origins (6th Century BCE)", description: "Ancient Pandya dynasty temple" },
        { period: "Renaissance (17th Century)", description: "Major reconstruction by Thirumalai Nayak" },
      ],
      superadmin: {
        firstName: "Lakshmi",
        lastName: "Narayanan",
        email: "lakshmi.n@meenakshi.org",
        bio: "Chief Executive Officer of the Temple Trust",
        role: { name: "superadmin" },
      },
      users: [
        { firstName: "Lakshmi", lastName: "Narayanan", email: "lakshmi.n@meenakshi.org", role: { name: "superadmin" }, bio: "CEO" },
        { firstName: "Ganesh", lastName: "Subramanian", email: "ganesh.s@meenakshi.org", role: { name: "temple-admin" }, bio: "Operations Head" },
        { firstName: "Kavitha", lastName: "Devi", email: "kavitha.d@meenakshi.org", role: { name: "manager" }, bio: "Events Manager" },
      ],
    },
    {
      id: "t4",
      name: "Sri Venkateswara Swamy Temple",
      city: "Tirupati",
      state: "Andhra Pradesh",
      country: "India",
      address: "S Mada St, Tirumala, Tirupati 517504",
      description: "One of the most visited and wealthiest Hindu temples in the world, dedicated to Lord Venkateswara.",
      historicalContext: "Constructed over a period of time starting from 300 AD, patronized by various dynasties including Pallavas, Cholas, and Vijayanagara.",
      bio: "Tirumala Tirupati Devasthanams (TTD) manages the operations, seeing over 50,000 to 100,000 pilgrims daily.",
      status: "active",
      logo: "/temple1.png",
      history: [
        { period: "Early History (300 AD)", description: "Initial construction by the Pallavas" },
        { period: "Golden Era (15th Century)", description: "Major expansion under Sri Krishnadevaraya" },
      ],
      superadmin: {
        firstName: "Ananda",
        lastName: "Rao",
        email: "ananda.rao@ttd.org",
        bio: "Executive Officer of TTD",
        role: { name: "superadmin" },
      },
      users: [
        { firstName: "Ananda", lastName: "Rao", email: "ananda.rao@ttd.org", role: { name: "superadmin" }, bio: "Executive Officer" },
        { firstName: "Srinivasa", lastName: "Reddy", email: "srinivasa.reddy@ttd.org", role: { name: "temple-admin" }, bio: "Joint Executive Officer" },
      ],
    },
    {
      id: "t5",
      name: "Jagannath Temple",
      city: "Puri",
      state: "Odisha",
      country: "India",
      address: "Grand Road, Puri 752001",
      description: "A major Hindu temple dedicated to Lord Jagannath, famous for its annual Ratha Yatra.",
      historicalContext: "Built in the 12th century by King Anantavarman Chodaganga Deva, it is one of the Char Dham pilgrimage sites.",
      bio: "The temple is renowned for its colossal wooden deities and the grand chariots built anew every year.",
      status: "active",
      logo: "/temple2.png",
      history: [
        { period: "Foundation (12th Century)", description: "Built by the Eastern Ganga dynasty" },
      ],
      superadmin: {
        firstName: "Dilip",
        lastName: "Mohapatra",
        email: "dilip.m@jagannathpuri.org",
        bio: "Chief Administrator of Shree Jagannath Temple Administration",
        role: { name: "superadmin" },
      },
      users: [
        { firstName: "Dilip", lastName: "Mohapatra", email: "dilip.m@jagannathpuri.org", role: { name: "superadmin" }, bio: "Chief Administrator" },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  //  USERS (used by Dashboard, AdminOnboard)
  // ─────────────────────────────────────────────────────────────────────────────
  users: [
    {
      id: "u1",
      email: "company-admin@gwcdata.ai",
      password: "Company_Admin@123",
      firstName: "Company",
      lastName: "Admin",
      role: { name: "company-admin" },
      roleId: 1,
      accountStatus: "active",
      isFirstLogin: false,
    },
    {
      id: "u2",
      email: "rajesh.sharma@srikrishna.org",
      password: "Admin@123",
      firstName: "Rajesh",
      lastName: "Sharma",
      role: { name: "superadmin" },
      roleId: 2,
      templeId: "t1",
      accountStatus: "active",
      isFirstLogin: false,
    },
    {
      id: "u3",
      email: "priya.devi@srikrishna.org",
      password: "Admin@123",
      firstName: "Priya",
      lastName: "Devi",
      role: { name: "temple-admin" },
      roleId: 3,
      templeId: "t1",
      accountStatus: "active",
      isFirstLogin: false,
    },
    {
      id: "u4",
      email: "venkat.raman@kasiviswa.org",
      password: "Admin@123",
      firstName: "Venkat",
      lastName: "Raman",
      role: { name: "superadmin" },
      roleId: 2,
      templeId: "t2",
      accountStatus: "active",
      isFirstLogin: false,
    },
    {
      id: "u5",
      email: "lakshmi.n@meenakshi.org",
      password: "Admin@123",
      firstName: "Lakshmi",
      lastName: "Narayanan",
      role: { name: "superadmin" },
      roleId: 2,
      templeId: "t3",
      accountStatus: "active",
      isFirstLogin: false,
    },
    {
      id: "u6",
      email: "ganesh.s@meenakshi.org",
      password: "Admin@123",
      firstName: "Ganesh",
      lastName: "Subramanian",
      role: { name: "temple-admin" },
      roleId: 3,
      templeId: "t3",
      accountStatus: "active",
      isFirstLogin: true,
    },
    {
      id: "u7",
      email: "kavitha.d@meenakshi.org",
      password: "Admin@123",
      firstName: "Kavitha",
      lastName: "Devi",
      role: { name: "manager" },
      roleId: 4,
      templeId: "t3",
      accountStatus: "suspended",
      isFirstLogin: true,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  //  ADMINS (used by AdminOnboard)
  // ─────────────────────────────────────────────────────────────────────────────
  admins: [
    { id: "ADM-001", name: "Company Admin", email: "company-admin@gwcdata.ai", role: "Company Admin", status: "Active", templeId: "all", templeName: "All Temples" },
    { id: "ADM-002", name: "Rajesh Sharma", email: "rajesh.sharma@srikrishna.org", role: "Super Admin", status: "Active", templeId: "t1", templeName: "Sri Krishna Temple" },
    { id: "ADM-003", name: "Priya Devi", email: "priya.devi@srikrishna.org", role: "Temple Admin", status: "Active", templeId: "t1", templeName: "Sri Krishna Temple" },
    { id: "ADM-004", name: "Venkat Raman", email: "venkat.raman@kasiviswa.org", role: "Super Admin", status: "Active", templeId: "t2", templeName: "Kasi Viswanathar Temple" },
    { id: "ADM-005", name: "Lakshmi Narayanan", email: "lakshmi.n@meenakshi.org", role: "Super Admin", status: "Active", templeId: "t3", templeName: "Sri Meenakshi Amman Temple" },
    { id: "ADM-006", name: "Kavitha Devi", email: "kavitha.d@meenakshi.org", role: "Manager", status: "Pending", templeId: "t3", templeName: "Sri Meenakshi Amman Temple" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  //  DEVOTEES (used by Devotees page, DevoteeForm, PoojaSevas dropdown)
  // ─────────────────────────────────────────────────────────────────────────────
  devotees: [
    {
      id: "DEV-001", name: "Ravi Kumar", first_name: "Ravi", last_name: "Kumar",
      phone: "+91 98765 43210", email: "ravi@example.com",
      status: "Active", type: "Life Member", location: "Bangalore",
      gothram: "Bharadwaja", bloodGroup: "O+",
      templeId: "t1", templeName: "Sri Krishna Temple",
      membershipType: "Life Member", joinDate: "2024-01-15",
      address: "123 Temple Street, Jayanagar",
      family: [{ name: "Anjali Kumar", relation: "Spouse" }, { name: "Arjun Kumar", relation: "Son" }],
      communication: { whatsapp: true, sms: true, email: false },
      emergencyContact: "Anjali Kumar (+91 98765 11111)",
      volunteerRoles: ["Crowd Control", "Prasadam Distribution"],
      engagementScore: 85,
    },
    {
      id: "DEV-002", name: "Meera Reddy", first_name: "Meera", last_name: "Reddy",
      phone: "+91 99887 76655", email: "meera.r@example.com",
      status: "Active", type: "VIP", location: "Hyderabad",
      gothram: "Kashyapa", bloodGroup: "A+",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
      membershipType: "VIP", joinDate: "2023-05-20",
      address: "45 Lotus Lane, Jubilee Hills",
      family: [{ name: "Kiran Reddy", relation: "Spouse" }],
      communication: { whatsapp: true, sms: true, email: true },
      emergencyContact: "Kiran Reddy (+91 99887 22222)",
      volunteerRoles: ["Event Organizer"],
      engagementScore: 92,
    },
    {
      id: "DEV-003", name: "Suresh Iyer", first_name: "Suresh", last_name: "Iyer",
      phone: "+91 91234 56789", email: "suresh.iyer@example.com",
      status: "Inactive", type: "Regular", location: "Chennai",
      gothram: "Vasishta", bloodGroup: "B+",
      templeId: "t1", templeName: "Sri Krishna Temple",
      membershipType: "Regular", joinDate: "2025-11-10",
      address: "89 MG Road, Mylapore",
      family: [{ name: "Priya Iyer", relation: "Spouse" }],
      communication: { whatsapp: false, sms: true, email: false },
      emergencyContact: "Priya Iyer (+91 91234 33333)",
      volunteerRoles: [],
      engagementScore: 40,
    },
    {
      id: "DEV-004", name: "Anand Krishna", first_name: "Anand", last_name: "Krishna",
      phone: "+91 87654 32100", email: "anand.k@example.com",
      status: "Active", type: "Life Member", location: "Coimbatore",
      gothram: "Atri", bloodGroup: "AB+",
      templeId: "t1", templeName: "Sri Krishna Temple",
      membershipType: "Life Member", joinDate: "2022-03-15",
      address: "12 Race Course Road, Coimbatore",
      family: [{ name: "Devika Krishna", relation: "Spouse" }, { name: "Karthik Krishna", relation: "Son" }, { name: "Divya Krishna", relation: "Daughter" }],
      communication: { whatsapp: true, sms: true, email: true },
      emergencyContact: "Devika Krishna (+91 87654 44444)",
      volunteerRoles: ["Hundi Collection", "Security"],
      engagementScore: 78,
    },
    {
      id: "DEV-005", name: "Lakshmi Narayanan", first_name: "Lakshmi", last_name: "Narayanan",
      phone: "+91 99001 12233", email: "lakshmi.n.devotee@example.com",
      status: "Active", type: "VIP", location: "Madurai",
      gothram: "Srivatsa", bloodGroup: "O-",
      templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
      membershipType: "VIP", joinDate: "2021-08-22",
      address: "7 Alagar Koil Road, Madurai",
      family: [],
      communication: { whatsapp: true, sms: false, email: true },
      emergencyContact: "Sundari Lakshmi (+91 99001 55555)",
      volunteerRoles: ["Cultural Programme Coordinator"],
      engagementScore: 95,
    },
    {
      id: "DEV-006", name: "Indhumathi Perumal", first_name: "Indhumathi", last_name: "Perumal",
      phone: "+91 94567 89012", email: "indhumathi.p@example.com",
      status: "Active", type: "Regular", location: "Trichy",
      gothram: "Bharadwaja", bloodGroup: "B-",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
      membershipType: "Regular", joinDate: "2025-02-14",
      address: "23 Srirangam Main Road, Trichy",
      family: [{ name: "Perumal Samy", relation: "Spouse" }],
      communication: { whatsapp: true, sms: true, email: false },
      emergencyContact: "Perumal Samy (+91 94567 66666)",
      volunteerRoles: ["Flower Arrangement"],
      engagementScore: 65,
    },
    {
      id: "DEV-007", name: "Ramesh Babu", first_name: "Ramesh", last_name: "Babu",
      phone: "+91 90123 45678", email: "ramesh.b@example.com",
      status: "Active", type: "Life Member", location: "Thanjavur",
      gothram: "Gautama", bloodGroup: "A-",
      templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
      membershipType: "Life Member", joinDate: "2020-12-01",
      address: "56 Big Street, Thanjavur",
      family: [{ name: "Sarada Babu", relation: "Spouse" }, { name: "Vignesh Babu", relation: "Son" }],
      communication: { whatsapp: true, sms: true, email: true },
      emergencyContact: "Sarada Babu (+91 90123 77777)",
      volunteerRoles: ["Kitchen Volunteer", "Maintenance"],
      engagementScore: 88,
    },
    {
      id: "DEV-008", name: "Padma Sundaram", first_name: "Padma", last_name: "Sundaram",
      phone: "+91 88990 11223", email: "padma.s@example.com",
      status: "Inactive", type: "Regular", location: "Salem",
      gothram: "Angirasa", bloodGroup: "O+",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
      membershipType: "Regular", joinDate: "2024-06-30",
      address: "99 Fort Area, Salem",
      family: [],
      communication: { whatsapp: false, sms: false, email: true },
      emergencyContact: "N/A",
      volunteerRoles: [],
      engagementScore: 22,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  //  DONATIONS (used by Donations page, DonationForm, Dashboard)
  // ─────────────────────────────────────────────────────────────────────────────
  donations: [
    {
      id: "TXN-8901", donation_code: "TXN-8901",
      devotee: "Anand Krishna", devotee_id: "DEV-004",
      amount: "5000", category: "Annadanam", purpose: "Annadanam",
      donation_date: "2026-05-15T09:30:00", date: "15 May, 2026",
      payment_method: "UPI", method: "UPI",
      payment_status: "Success", status: "Success",
      templeId: "t1", templeName: "Sri Krishna Temple",
    },
    {
      id: "TXN-8902", donation_code: "TXN-8902",
      devotee: "Meera Reddy", devotee_id: "DEV-002",
      amount: "2500", category: "Temple Development", purpose: "Temple Dev.",
      donation_date: "2026-05-14T14:20:00", date: "14 May, 2026",
      payment_method: "Card", method: "Card",
      payment_status: "Success", status: "Success",
      templeId: "t1", templeName: "Sri Krishna Temple",
    },
    {
      id: "TXN-8903", donation_code: "TXN-8903",
      devotee: "Anonymous", devotee_id: "",
      amount: "10000", category: "Pooja Fund", purpose: "Pooja Fund",
      donation_date: "2026-05-14T08:00:00", date: "14 May, 2026",
      payment_method: "Cash", method: "Cash",
      payment_status: "Pending", status: "Pending",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
    },
    {
      id: "TXN-8904", donation_code: "TXN-8904",
      devotee: "Ravi Kumar", devotee_id: "DEV-001",
      amount: "25000", category: "Renovation Fund", purpose: "Renovation Fund",
      donation_date: "2026-05-13T11:15:00", date: "13 May, 2026",
      payment_method: "UPI", method: "UPI",
      payment_status: "Success", status: "Success",
      templeId: "t1", templeName: "Sri Krishna Temple",
    },
    {
      id: "TXN-8905", donation_code: "TXN-8905",
      devotee: "Lakshmi Narayanan", devotee_id: "DEV-005",
      amount: "50000", category: "Gold Covering", purpose: "Gold Covering",
      donation_date: "2026-05-12T16:45:00", date: "12 May, 2026",
      payment_method: "UPI", method: "UPI",
      payment_status: "Success", status: "Success",
      templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
    },
    {
      id: "TXN-8906", donation_code: "TXN-8906",
      devotee: "Ramesh Babu", devotee_id: "DEV-007",
      amount: "1000", category: "General", purpose: "General",
      donation_date: "2026-05-11T07:30:00", date: "11 May, 2026",
      payment_method: "Cash", method: "Cash",
      payment_status: "Success", status: "Success",
      templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
    },
    {
      id: "TXN-8907", donation_code: "TXN-8907",
      devotee: "Padma Sundaram", devotee_id: "DEV-008",
      amount: "500", category: "Prasadam", purpose: "Prasadam",
      donation_date: "2026-05-10T10:00:00", date: "10 May, 2026",
      payment_method: "Card", method: "Card",
      payment_status: "Failed", status: "Failed",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
    },
    {
      id: "TXN-8908", donation_code: "TXN-8908",
      devotee: "Indhumathi Perumal", devotee_id: "DEV-006",
      amount: "7500", category: "Annadanam", purpose: "Annadanam",
      donation_date: "2026-05-09T12:00:00", date: "09 May, 2026",
      payment_method: "UPI", method: "UPI",
      payment_status: "Success", status: "Success",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
    },
    {
      id: "TXN-8909", donation_code: "TXN-8909",
      devotee: "Suresh Iyer", devotee_id: "DEV-003",
      amount: "3000", category: "Festival Fund", purpose: "Festival Fund",
      donation_date: "2026-05-08T15:30:00", date: "08 May, 2026",
      payment_method: "Cash", method: "Cash",
      payment_status: "Pending", status: "Pending",
      templeId: "t1", templeName: "Sri Krishna Temple",
    },
    {
      id: "TXN-8910", donation_code: "TXN-8910",
      devotee: "Anonymous", devotee_id: "",
      amount: "100000", category: "Major Donation", purpose: "Gopuram Restoration",
      donation_date: "2026-05-07T09:00:00", date: "07 May, 2026",
      payment_method: "UPI", method: "UPI",
      payment_status: "Success", status: "Success",
      templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  //  POOJA & SEVAS (used by PoojaSevas page, PoojaSevaForm)
  // ─────────────────────────────────────────────────────────────────────────────
  poojaSevas: [
    {
      id: "SV-101", seva_name: "Suprabhata Seva", name: "Suprabhata Seva",
      devotee: "Indhumathi Perumal", devotee_id: "DEV-006",
      seva_date: "2026-05-30T05:00:00", time: "05:00 AM", date: "30 May, 2026",
      priest: "Shastri Ji", seva_amount: "500", amount: "₹500",
      status: "Scheduled", payment_status: "Paid",
      templeId: "t1", templeName: "Sri Krishna Temple",
      notes: "TYPE:Upcoming", type: "Upcoming",
    },
    {
      id: "SV-102", seva_name: "Archana", name: "Archana",
      devotee: "Anand Krishna", devotee_id: "DEV-004",
      seva_date: "2026-05-30T08:30:00", time: "08:30 AM", date: "30 May, 2026",
      priest: "Gopal Swami", seva_amount: "100", amount: "₹100",
      status: "Pending", payment_status: "Unpaid",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
      notes: "TYPE:Upcoming", type: "Upcoming",
    },
    {
      id: "SV-103", seva_name: "Monthly Abhishekam", name: "Monthly Abhishekam",
      devotee: "Ravi Kumar", devotee_id: "DEV-001",
      seva_date: "2026-06-01T06:00:00", time: "06:00 AM", date: "1st of Every Month",
      priest: "Shastri Ji", seva_amount: "5000", amount: "₹5,000",
      status: "Scheduled", payment_status: "Paid",
      templeId: "t1", templeName: "Sri Krishna Temple",
      notes: "TYPE:Recurring", type: "Recurring",
    },
    {
      id: "SV-104", seva_name: "Kalyanotsavam", name: "Kalyanotsavam",
      devotee: "Lakshmi Narayanan", devotee_id: "DEV-005",
      seva_date: "2026-05-10T10:30:00", time: "10:30 AM", date: "10 May, 2026",
      priest: "Ramanuja Acharya", seva_amount: "2500", amount: "₹2,500",
      status: "Completed", payment_status: "Paid",
      templeId: "t1", templeName: "Sri Krishna Temple",
      notes: "TYPE:History", type: "History",
    },
    {
      id: "SV-105", seva_name: "Sahasranama Archana", name: "Sahasranama Archana",
      devotee: "Meera Reddy", devotee_id: "DEV-002",
      seva_date: "2026-05-31T07:00:00", time: "07:00 AM", date: "31 May, 2026",
      priest: "Gopal Swami", seva_amount: "1500", amount: "₹1,500",
      status: "Scheduled", payment_status: "Paid",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
      notes: "TYPE:Upcoming", type: "Upcoming",
    },
    {
      id: "SV-106", seva_name: "Ganapathi Homam", name: "Ganapathi Homam",
      devotee: "Ramesh Babu", devotee_id: "DEV-007",
      seva_date: "2026-06-05T09:00:00", time: "09:00 AM", date: "05 Jun, 2026",
      priest: "Srinivasa Bhatt", seva_amount: "3000", amount: "₹3,000",
      status: "Pending", payment_status: "Unpaid",
      templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
      notes: "TYPE:Upcoming", type: "Upcoming",
    },
    {
      id: "SV-107", seva_name: "Weekly Rudrabhishekam", name: "Weekly Rudrabhishekam",
      devotee: "Suresh Iyer", devotee_id: "DEV-003",
      seva_date: "2026-05-26T06:00:00", time: "06:00 AM", date: "Every Monday",
      priest: "Dikshitar Ji", seva_amount: "2000", amount: "₹2,000",
      status: "Scheduled", payment_status: "Paid",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
      notes: "TYPE:Recurring", type: "Recurring",
    },
    {
      id: "SV-108", seva_name: "Navagraha Pooja", name: "Navagraha Pooja",
      devotee: "Padma Sundaram", devotee_id: "DEV-008",
      seva_date: "2026-05-05T11:00:00", time: "11:00 AM", date: "05 May, 2026",
      priest: "Shastri Ji", seva_amount: "750", amount: "₹750",
      status: "Completed", payment_status: "Paid",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
      notes: "TYPE:History", type: "History",
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  //  ASSETS (used by Assets page, AssetForm)
  // ─────────────────────────────────────────────────────────────────────────────
  assets: [
    {
      id: "AST-901", name: "Silver Chariot", category: "Sacred Item",
      value: "₹25.0L", status: "Active", location: "Main Sanctum",
      lastAudit: "10 May 2026", templeId: "t1", templeName: "Sri Krishna Temple",
      description: "Antique silver chariot used during annual Brahmotsavam procession",
      purchaseDate: "1985-03-15", warrantyEnd: "N/A",
    },
    {
      id: "AST-902", name: "Industrial Oven", category: "Kitchen",
      value: "₹1.2L", status: "Maintenance", location: "Annadanam Kitchen",
      lastAudit: "05 May 2026", templeId: "t2", templeName: "Kasi Viswanathar Temple",
      description: "Heavy-duty oven for mass prasadam preparation (capacity: 500 meals)",
      purchaseDate: "2023-11-20", warrantyEnd: "2026-11-20",
    },
    {
      id: "AST-903", name: "Solar Power Array", category: "Infrastructure",
      value: "₹15.5L", status: "Active", location: "Rooftop Phase 1",
      lastAudit: "12 May 2026", templeId: "t1", templeName: "Sri Krishna Temple",
      description: "50kW solar panel installation providing 60% of temple electricity",
      purchaseDate: "2024-06-01", warrantyEnd: "2034-06-01",
    },
    {
      id: "AST-904", name: "Gold-Plated Dwajasthambam", category: "Sacred Item",
      value: "₹1.5Cr", status: "Active", location: "Temple Entrance",
      lastAudit: "01 May 2026", templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
      description: "42-foot gold-plated flag post at the main entrance",
      purchaseDate: "2018-01-14", warrantyEnd: "N/A",
    },
    {
      id: "AST-905", name: "CCTV Surveillance System", category: "Security",
      value: "₹8.5L", status: "Active", location: "All Zones",
      lastAudit: "08 May 2026", templeId: "t1", templeName: "Sri Krishna Temple",
      description: "128-camera AI-powered surveillance system with cloud recording",
      purchaseDate: "2025-01-10", warrantyEnd: "2028-01-10",
    },
    {
      id: "AST-906", name: "Commercial Dishwasher", category: "Kitchen",
      value: "₹3.5L", status: "Active", location: "Main Kitchen",
      lastAudit: "15 May 2026", templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
      description: "Industrial dishwasher for 2000+ utensils/hour capacity",
      purchaseDate: "2024-09-15", warrantyEnd: "2027-09-15",
    },
    {
      id: "AST-907", name: "PA Sound System", category: "Infrastructure",
      value: "₹4.0L", status: "Active", location: "Temple Complex",
      lastAudit: "20 May 2026", templeId: "t2", templeName: "Kasi Viswanathar Temple",
      description: "Bose professional multi-zone PA system with 24 speakers",
      purchaseDate: "2025-03-20", warrantyEnd: "2028-03-20",
    },
    {
      id: "AST-908", name: "Generator Set (125 KVA)", category: "Infrastructure",
      value: "₹12.0L", status: "Maintenance", location: "Generator Room",
      lastAudit: "03 May 2026", templeId: "t1", templeName: "Sri Krishna Temple",
      description: "Backup power generator - undergoing annual maintenance",
      purchaseDate: "2022-07-01", warrantyEnd: "2027-07-01",
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  //  CAMPAIGNS (used by Campaigns page, CampaignForm)
  // ─────────────────────────────────────────────────────────────────────────────
  campaigns: [
    {
      id: "CMP-401", name: "Annadanam Drive 2026", type: "Donation",
      reach: "12.5k", funds: "₹1.2L", status: "Active", end: "31 Dec 2026",
      templeId: "t1", templeName: "Sri Krishna Temple",
      budget: "150000", spent: "120000",
      metaConnected: true, dailyLimit: "5000", provider: "Meta Ads", commission: "2.5",
      rules: ["Life Members", "Donors"],
      description: "Feed 1000 devotees daily through the Annadanam programme",
    },
    {
      id: "CMP-402", name: "Volunteer Recruitment", type: "Volunteering",
      reach: "5.0k", funds: "₹3.0L", status: "Scheduled", end: "10 Jun 2026",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
      budget: "50000", spent: "0",
      metaConnected: false, dailyLimit: "1000", provider: "Local Agency", commission: "5.0",
      rules: ["Regular"],
      description: "Recruit 200 volunteers for the upcoming Maha Shivaratri festival",
    },
    {
      id: "CMP-403", name: "Temple Renovation Fund", type: "Fundraiser",
      reach: "15.2k", funds: "₹50.0L", status: "Completed", end: "01 Jan 2026",
      templeId: "t1", templeName: "Sri Krishna Temple",
      budget: "5000000", spent: "4950000",
      metaConnected: true, dailyLimit: "100000", provider: "Google Ads", commission: "1.5",
      rules: ["All"],
      description: "Raised ₹50L for the main gopuram restoration project",
    },
    {
      id: "CMP-404", name: "Gopuram Gold Covering", type: "Fundraiser",
      reach: "25.8k", funds: "₹2.5Cr", status: "Active", end: "31 Mar 2027",
      templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
      budget: "25000000", spent: "8500000",
      metaConnected: true, dailyLimit: "500000", provider: "Meta Ads", commission: "1.0",
      rules: ["VIP", "Life Members"],
      description: "Gold covering for the 14 gopurams - phase 1 in progress",
    },
    {
      id: "CMP-405", name: "Digital Archana Booking", type: "Awareness",
      reach: "8.3k", funds: "₹0", status: "Active", end: "30 Jun 2026",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
      budget: "25000", spent: "12000",
      metaConnected: false, dailyLimit: "2000", provider: "WhatsApp Business", commission: "0",
      rules: ["All"],
      description: "Promoting online booking system for archana and special poojas",
    },
    {
      id: "CMP-406", name: "Heritage Walk Programme", type: "Community",
      reach: "3.2k", funds: "₹0.5L", status: "Scheduled", end: "15 Jul 2026",
      templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
      budget: "75000", spent: "15000",
      metaConnected: false, dailyLimit: "3000", provider: "Instagram", commission: "3.0",
      rules: ["All"],
      description: "Weekly heritage walks showcasing the temple's 2000-year history",
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  //  RENTAL VENUES (used by RentalVenue page, RentalVenueForm)
  // ─────────────────────────────────────────────────────────────────────────────
  rentalVenues: [
    {
      id: "BOK-450", venue: "Main Marriage Hall", client: "Vikram Seth",
      date: "20-22 May, 2026", type: "Wedding", guests: "500+",
      status: "Confirmed", templeId: "t1", templeName: "Sri Krishna Temple",
      amount: "75000", phone: "+91 98765 00001",
    },
    {
      id: "BOK-451", venue: "Mini Function Hall", client: "Anand Krishna",
      date: "25 May, 2026", type: "Birthday", guests: "100+",
      status: "Upcoming", templeId: "t1", templeName: "Sri Krishna Temple",
      amount: "15000", phone: "+91 87654 32100",
    },
    {
      id: "BOK-452", venue: "Cultural Center", client: "Meera Nair",
      date: "10 May, 2026", type: "Dance Performance", guests: "200+",
      status: "Completed", templeId: "t1", templeName: "Sri Krishna Temple",
      amount: "25000", phone: "+91 99887 76655",
    },
    {
      id: "BOK-453", venue: "Dining Hall", client: "Temple Trust",
      date: "28-30 May, 2026", type: "Renovation", guests: "N/A",
      status: "Maintenance", templeId: "t2", templeName: "Kasi Viswanathar Temple",
      amount: "0", phone: "N/A",
    },
    {
      id: "BOK-454", venue: "Thousand Pillar Hall", client: "Sundaram Family",
      date: "01-02 Jun, 2026", type: "Wedding", guests: "1000+",
      status: "Confirmed", templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
      amount: "150000", phone: "+91 94567 11111",
    },
    {
      id: "BOK-455", venue: "Nandi Mandapam", client: "Cultural Society of Madurai",
      date: "05 Jun, 2026", type: "Classical Concert", guests: "300+",
      status: "Upcoming", templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
      amount: "35000", phone: "+91 90123 22222",
    },
    {
      id: "BOK-456", venue: "Open Air Stage", client: "Bharathanatyam Academy",
      date: "15 Jun, 2026", type: "Dance Recital", guests: "250+",
      status: "Upcoming", templeId: "t2", templeName: "Kasi Viswanathar Temple",
      amount: "20000", phone: "+91 88990 33333",
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  //  EVENTS CALENDAR (used by EventsCalendar page, EventForm)
  // ─────────────────────────────────────────────────────────────────────────────
  events: [
    {
      id: "EVT-101", title: "Maha Shivaratri Special Pooja",
      date: "2026-05-30", time: "18:00", type: "festival",
      attendees: 5000, status: "Upcoming",
      description: "Grand celebration with all-night Shiva puja, cultural programmes, and special prasadam",
      organizer: "Temple Trust Board", prasadam: "Special Payasam & Laddu", resources: "200 Volunteers, Sound System, Lights",
      templeId: "t1", templeName: "Sri Krishna Temple",
    },
    {
      id: "EVT-102", title: "Trust Board Meeting",
      date: "2026-05-28", time: "10:00", type: "meeting",
      attendees: 15, status: "Upcoming",
      description: "Quarterly review of temple operations, finances, and upcoming festival planning",
      organizer: "Rajesh Sharma", prasadam: "Tea & Snacks", resources: "Conference Room A, Projector",
      templeId: "t1", templeName: "Sri Krishna Temple",
    },
    {
      id: "EVT-103", title: "Anna Dhanam Distribution",
      date: "2026-05-27", time: "12:30", type: "pooja",
      attendees: 500, status: "Upcoming",
      description: "Daily mass feeding programme serving lunch to 500+ devotees",
      organizer: "Kitchen Committee", prasadam: "Full Meal", resources: "Kitchen Staff, Dining Hall",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
    },
    {
      id: "EVT-104", title: "Chittirai Thiruvizha",
      date: "2026-06-01", time: "06:00", type: "festival",
      attendees: 15000, status: "Upcoming",
      description: "10-day grand festival celebrating the divine wedding of Meenakshi and Sundareswarar",
      organizer: "Festival Committee", prasadam: "Special Payasam, Sundal, Vadai", resources: "500 Volunteers, Full Decoration, Chariot",
      templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
    },
    {
      id: "EVT-105", title: "Vedic Chanting Workshop",
      date: "2026-05-29", time: "07:00", type: "pooja",
      attendees: 50, status: "Upcoming",
      description: "3-day workshop on Vishnu Sahasranamam and Lalitha Sahasranamam chanting",
      organizer: "Vedic School", prasadam: "Fruit Salad", resources: "Meditation Hall, Audio System",
      templeId: "t1", templeName: "Sri Krishna Temple",
    },
    {
      id: "EVT-106", title: "Annual Maintenance Day",
      date: "2026-06-10", time: "08:00", type: "maintenance",
      attendees: 30, status: "Planned",
      description: "Complete cleaning and minor repairs of all temple structures",
      organizer: "Maintenance Team", prasadam: "Lunch for Workers", resources: "Cleaning Supplies, Scaffolding",
      templeId: "t2", templeName: "Kasi Viswanathar Temple",
    },
    {
      id: "EVT-107", title: "Bhagavad Gita Discourse",
      date: "2026-05-26", time: "17:00", type: "pooja",
      attendees: 200, status: "In Progress",
      description: "Evening discourse on Chapter 12 - Bhakti Yoga by Swami Anandananda",
      organizer: "Cultural Wing", prasadam: "Laddu", resources: "Main Hall, Stage, Mic System",
      templeId: "t1", templeName: "Sri Krishna Temple",
    },
    {
      id: "EVT-108", title: "Flower Show & Exhibition",
      date: "2026-05-15", time: "09:00", type: "festival",
      attendees: 2000, status: "Completed",
      description: "Annual flower exhibition showcasing temple garden flowers and floral art",
      organizer: "Garden Committee", prasadam: "Rose Milk", resources: "Exhibition Grounds, Stalls, Security",
      templeId: "t3", templeName: "Sri Meenakshi Amman Temple",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
//  CRUD Operations
// ═══════════════════════════════════════════════════════════════════════════════

export const getMockData = (): MockDataState => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : INITIAL_STATE;
};

export const saveMockData = (data: MockDataState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addMockItem = (
  category: keyof MockDataState,
  item: MockEntity,
): MockEntity => {
  const data = getMockData();
  data[category].unshift(item);
  saveMockData(data);
  return item;
};

export const updateMockItem = (
  category: keyof MockDataState,
  id: string,
  updates: Partial<MockEntity>,
) => {
  const data = getMockData();
  const index = data[category].findIndex((i) => i.id === id);
  if (index !== -1) {
    data[category][index] = { ...data[category][index], ...updates };
    saveMockData(data);
  }
};

export const deleteMockItem = (category: keyof MockDataState, id: string) => {
  const data = getMockData();
  data[category] = data[category].filter((i) => i.id !== id);
  saveMockData(data);
};

/**
 * Resets mock data to the initial seed state.
 * Useful for development/testing.
 */
export const resetMockData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
