-- Rich sample data for development and demos.
-- Institute profile and admin user are created by: npm run db:setup
-- Re-run anytime: npm run db:seed

-- ─── Courses ───────────────────────────────────────────────────

INSERT INTO courses (id, name, duration, fees, description, status) VALUES
  ('CRS-001', 'Full Stack Web Development', '6 Months', 25000, 'HTML, CSS, JavaScript, React, Node.js, MongoDB', 'Active'),
  ('CRS-002', 'Digital Marketing',          '3 Months', 18000, 'SEO, Social Media, Google Ads, Content Marketing', 'Active'),
  ('CRS-003', 'Data Science & ML',          '9 Months', 35000, 'Python, Statistics, Machine Learning, Deep Learning', 'Active'),
  ('CRS-004', 'Graphic Design',             '4 Months', 20000, 'Photoshop, Illustrator, InDesign, UI/UX fundamentals', 'Active'),
  ('CRS-005', 'Tally & Accounting',         '2 Months', 12000, 'Tally ERP 9, GST filing, financial reporting', 'Inactive'),
  ('CRS-006', 'Mobile App Development',     '5 Months', 28000, 'Flutter, React Native, Firebase, app deployment', 'Active')
ON DUPLICATE KEY UPDATE
  name = VALUES(name), duration = VALUES(duration), fees = VALUES(fees),
  description = VALUES(description), status = VALUES(status);

-- ─── Faculty ─────────────────────────────────────────────────────

INSERT INTO faculty (id, name, subject, phone, email, salary, experience, qualification, photo_url) VALUES
  ('FAC-001', 'Rahul Mehta',    'Full Stack Web Development', '9845012345', 'rahul.mehta@triton.local',  45000, '5 Years', 'B.Tech CSE',       NULL),
  ('FAC-002', 'Priya Nair',     'Digital Marketing',          '9845012346', 'priya.nair@triton.local',   38000, '4 Years', 'MBA Marketing',    NULL),
  ('FAC-003', 'Suresh Kumar',   'Data Science & ML',          '9845012347', 'suresh.kumar@triton.local', 55000, '7 Years', 'M.Sc Statistics',  NULL),
  ('FAC-004', 'Anita Joshi',    'Tally & Accounting',         '9845012348', 'anita.joshi@triton.local',  32000, '6 Years', 'CA Inter',         NULL),
  ('FAC-005', 'Vikram Desai',   'Graphic Design',             '9845012349', 'vikram.desai@triton.local', 35000, '3 Years', 'B.Des',            NULL),
  ('FAC-006', 'Kavitha Iyer',   'Mobile App Development',     '9845012350', 'kavitha@triton.local',      48000, '4 Years', 'B.Tech IT',        NULL),
  ('FAC-007', 'Deepak Malhotra','Data Science & ML',          '9845012351', 'deepak@triton.local',       52000, '6 Years', 'Ph.D Data Science',NULL)
ON DUPLICATE KEY UPDATE
  name = VALUES(name), subject = VALUES(subject), phone = VALUES(phone),
  email = VALUES(email), salary = VALUES(salary), experience = VALUES(experience),
  qualification = VALUES(qualification);

-- ─── Batches ─────────────────────────────────────────────────────

INSERT INTO batches (id, course_id, name, timing, faculty_id, status, start_date, end_date) VALUES
  ('BAT-001', 'CRS-001', 'Batch A – Morning',   'Mon–Sat 9:00 AM – 12:00 PM',   'FAC-001', 'Ongoing',  '2024-01-15', '2024-07-15'),
  ('BAT-002', 'CRS-001', 'Batch E – Evening',   'Mon–Fri 5:00 PM – 8:00 PM',    'FAC-001', 'Upcoming', '2024-04-01', '2024-10-01'),
  ('BAT-003', 'CRS-002', 'Batch B – Evening',   'Mon–Fri 6:00 PM – 8:00 PM',    'FAC-002', 'Ongoing',  '2024-02-01', '2024-05-01'),
  ('BAT-004', 'CRS-002', 'Batch F – Morning',   'Mon–Sat 10:00 AM – 12:00 PM',  'FAC-002', 'Upcoming', '2024-04-15', '2024-07-15'),
  ('BAT-005', 'CRS-003', 'Batch C – Weekend',   'Sat–Sun 10:00 AM – 4:00 PM',   'FAC-003', 'Ongoing',  '2024-01-20', '2024-10-20'),
  ('BAT-006', 'CRS-005', 'Batch D – Afternoon', 'Mon–Sat 2:00 PM – 4:00 PM',    'FAC-004', 'Ongoing',  '2024-03-01', '2024-05-01'),
  ('BAT-007', 'CRS-004', 'Batch G – Morning',   'Mon–Wed–Fri 11:00 AM – 1:00 PM','FAC-005', 'Ongoing', '2024-02-01', '2024-06-01'),
  ('BAT-008', 'CRS-006', 'Batch H – Evening',   'Tue–Thu 6:00 PM – 9:00 PM',    'FAC-006', 'Ongoing',  '2024-03-15', '2024-08-15')
ON DUPLICATE KEY UPDATE
  name = VALUES(name), timing = VALUES(timing), faculty_id = VALUES(faculty_id),
  status = VALUES(status), start_date = VALUES(start_date), end_date = VALUES(end_date);

-- ─── Students ────────────────────────────────────────────────────

INSERT INTO students (id, name, phone, email, course_id, batch_id, guardian, guardian_phone, address, admission_date, fees_total, fees_paid, status, dob, grade) VALUES
  ('STU-001', 'Arjun Sharma',   '9876543210', 'arjun@email.com',   'CRS-001', 'BAT-001', 'Ramesh Sharma',  '9876543200', '123, MG Road, Bangalore',           '2024-01-15', 25000, 20000, 'Active',    '2000-05-12', 'A'),
  ('STU-002', 'Priya Patel',    '9876543211', 'priya@email.com',   'CRS-002', 'BAT-003', 'Suresh Patel',   '9876543201', '45, Ring Road, Ahmedabad',          '2024-02-01', 18000, 18000, 'Active',    '2001-03-22', 'A+'),
  ('STU-003', 'Rohit Kumar',    '9876543212', 'rohit@email.com',   'CRS-003', 'BAT-005', 'Vikram Kumar',   '9876543202', '78, Civil Lines, Delhi',            '2024-02-10', 35000, 17500, 'Active',    '1999-11-08', 'B'),
  ('STU-004', 'Sneha Gupta',    '9876543213', 'sneha@email.com',   'CRS-004', 'BAT-007', 'Anil Gupta',     '9876543203', '22, Park Street, Kolkata',          '2024-01-20', 20000, 20000, 'Active',    '2002-07-15', 'A'),
  ('STU-005', 'Mohammed Ali',   '9876543214', 'mali@email.com',    'CRS-005', 'BAT-006', 'Ahmed Ali',      '9876543204', '56, Banjara Hills, Hyderabad',      '2024-03-01', 12000, 6000,  'Active',    '2001-09-30', 'C'),
  ('STU-006', 'Kavya Reddy',    '9876543215', 'kavya@email.com',   'CRS-001', 'BAT-001', 'Ravi Reddy',     '9876543205', '89, Jubilee Hills, Hyderabad',      '2024-03-05', 25000, 12500, 'Active',    '2000-12-01', 'A+'),
  ('STU-007', 'Aditya Singh',   '9876543216', 'aditya@email.com',  'CRS-003', 'BAT-005', 'Rajesh Singh',   '9876543206', '34, Gomti Nagar, Lucknow',          '2024-01-08', 35000, 35000, 'Completed', '1998-04-18', 'A'),
  ('STU-008', 'Meera Nair',     '9876543217', 'meera@email.com',   'CRS-002', 'BAT-003', 'Suresh Nair',    '9876543207', '12, MG Road, Kochi',                 '2024-03-10', 18000, 9000,  'Active',    '2001-06-25', 'B'),
  ('STU-009', 'Rahul Verma',    '9876543218', 'rahul@email.com',   'CRS-004', 'BAT-007', 'Manoj Verma',    '9876543208', '67, Sector 22, Chandigarh',         '2024-02-20', 20000, 10000, 'Active',    '2000-08-14', 'B+'),
  ('STU-010', 'Anita Sharma',   '9876543219', 'anita@email.com',   'CRS-005', 'BAT-006', 'Mohan Sharma',   '9876543209', '90, Ashok Nagar, Bhopal',           '2024-03-12', 12000, 12000, 'Active',    '2002-01-10', 'A'),
  ('STU-011', 'Ishaan Mehta',   '9876543220', 'ishaan@email.com',  'CRS-001', 'BAT-002', 'Amit Mehta',     '9876543210', '14, Salt Lake, Kolkata',            '2024-04-02', 25000, 5000,  'Active',    '2001-02-14', 'B'),
  ('STU-012', 'Divya Krishnan', '9876543221', 'divya@email.com',   'CRS-002', 'BAT-004', 'Krishnan Nair',  '9876543211', '8, Anna Nagar, Chennai',            '2024-04-10', 18000, 0,     'Active',    '2000-10-05', '-'),
  ('STU-013', 'Vikram Shah',    '9876543222', 'vikram@email.com',  'CRS-006', 'BAT-008', 'Rajesh Shah',    '9876543212', '101, FC Road, Pune',                '2024-03-20', 28000, 14000, 'Active',    '1999-07-22', 'A'),
  ('STU-014', 'Neha Kapoor',    '9876543223', 'neha@email.com',    'CRS-003', 'BAT-005', 'Sunil Kapoor',   '9876543213', '55, Model Town, Delhi',             '2024-02-28', 35000, 28000, 'Active',    '2000-01-30', 'A-'),
  ('STU-015', 'Sanjay Pillai',  '9876543224', 'sanjay@email.com',  'CRS-006', 'BAT-008', 'Ravi Pillai',    '9876543214', '3, Marine Drive, Mumbai',           '2024-04-05', 28000, 7000,  'Active',    '2001-11-19', 'B+'),
  ('STU-016', 'Aarav Saxena', '9876500016', 'aaravsaxena@email.com', 'CRS-001', 'BAT-001', 'Shah Chirag', '9876500516', '160, Mumbai', '2024-02-17', 25000, 6250, 'Active', '1998-02-17', 'A+'),
  ('STU-017', 'Aisha Desai', '9876500017', 'aishadesai@email.com', 'CRS-001', 'BAT-001', 'Gowda Eshan', '9876500517', '170, Delhi', '2024-03-18', 25000, 12500, 'Active', '1999-03-18', 'A'),
  ('STU-018', 'Karan Kapoor', '9876500018', 'karankapoor@email.com', 'CRS-001', 'BAT-001', 'Nair Gaurav', '9876500518', '180, Hyderabad', '2024-04-19', 25000, 18750, 'Active', '2000-04-19', 'A-'),
  ('STU-019', 'Lakshmi Fernandes', '9876500019', 'lakshmifernandes@email.com', 'CRS-001', 'BAT-001', 'Chopra Imran', '9876500519', '190, Chennai', '2024-05-20', 25000, 25000, 'Completed', '2001-05-20', 'B+'),
  ('STU-020', 'Nikhil Sharma', '9876500020', 'nikhilsharma@email.com', 'CRS-001', 'BAT-001', 'Kulkarni Kunal', '9876500520', '200, Pune', '2024-01-21', 25000, 0, 'Inactive', '2002-01-21', 'B'),
  ('STU-021', 'Pooja Gupta', '9876500021', 'poojagupta@email.com', 'CRS-001', 'BAT-001', 'Fernandes Mitesh', '9876500521', '210, Kolkata', '2024-02-22', 25000, 6250, 'Active', '2003-02-22', 'B-'),
  ('STU-022', 'Rohan Nair', '9876500022', 'rohannair@email.com', 'CRS-001', 'BAT-002', 'Reddy Olivia', '9876500522', '220, Ahmedabad', '2024-03-23', 25000, 12500, 'Active', '2004-03-23', 'C'),
  ('STU-023', 'Sanya Iyer', '9876500023', 'sanyaiyer@email.com', 'CRS-001', 'BAT-002', 'Das Aisha', '9876500523', '230, Jaipur', '2024-04-24', 25000, 18750, 'Active', '2005-04-24', '-'),
  ('STU-024', 'Tarun Bose', '9876500024', 'tarunbose@email.com', 'CRS-001', 'BAT-002', 'Saxena Lakshmi', '9876500524', '240, Lucknow', '2024-05-25', 25000, 25000, 'Active', '1998-05-25', 'A+'),
  ('STU-025', 'Uma Agarwal', '9876500025', 'umaagarwal@email.com', 'CRS-001', 'BAT-002', 'Banerjee Pooja', '9876500525', '250, Kochi', '2024-01-01', 25000, 0, 'Active', '1999-01-01', 'A'),
  ('STU-026', 'Varun Saxena', '9876500026', 'varunsaxena@email.com', 'CRS-001', 'BAT-002', 'Kumar Sanya', '9876500526', '260, Indore', '2024-02-02', 25000, 6250, 'Completed', '2000-02-02', 'A-'),
  ('STU-027', 'Yash Desai', '9876500027', 'yashdesai@email.com', 'CRS-001', 'BAT-002', 'Iyer Uma', '9876500527', '270, Nagpur', '2024-03-03', 25000, 12500, 'Inactive', '2001-03-03', 'B+'),
  ('STU-028', 'Zara Kapoor', '9876500028', 'zarakapoor@email.com', 'CRS-001', 'BAT-002', 'Pillai Yash', '9876500528', '280, Surat', '2024-04-04', 25000, 18750, 'Active', '2002-04-04', 'B'),
  ('STU-029', 'Harsh Fernandes', '9876500029', 'harshfernandes@email.com', 'CRS-002', 'BAT-003', 'Mehta Harsh', '9876500529', '290, Bhopal', '2024-05-05', 18000, 18000, 'Active', '2003-05-05', 'B-'),
  ('STU-030', 'Ira Sharma', '9876500030', 'irasharma@email.com', 'CRS-002', 'BAT-003', 'Sharma Jatin', '9876500530', '300, Bangalore', '2024-01-06', 18000, 0, 'Active', '2004-01-06', 'C'),
  ('STU-031', 'Jatin Gupta', '9876500031', 'jatingupta@email.com', 'CRS-002', 'BAT-003', 'Verma Lata', '9876500531', '310, Mumbai', '2024-02-07', 18000, 4500, 'Active', '2005-02-07', '-'),
  ('STU-032', 'Kiran Nair', '9876500032', 'kirannair@email.com', 'CRS-002', 'BAT-003', 'Malhotra Nandini', '9876500532', '320, Delhi', '2024-03-08', 18000, 9000, 'Active', '1998-03-08', 'A+'),
  ('STU-033', 'Lata Iyer', '9876500033', 'lataiyer@email.com', 'CRS-002', 'BAT-003', 'Desai Pallavi', '9876500533', '330, Hyderabad', '2024-04-09', 18000, 13500, 'Completed', '1999-04-09', 'A'),
  ('STU-034', 'Manish Bose', '9876500034', 'manishbose@email.com', 'CRS-002', 'BAT-003', 'Dutta Siddharth', '9876500534', '340, Chennai', '2024-05-10', 18000, 18000, 'Inactive', '2000-05-10', 'A-'),
  ('STU-035', 'Nandini Agarwal', '9876500035', 'nandiniagarwal@email.com', 'CRS-002', 'BAT-004', 'Singh Uday', '9876500535', '350, Pune', '2024-01-11', 18000, 0, 'Active', '2001-01-11', 'B+'),
  ('STU-036', 'Omkar Saxena', '9876500036', 'omkarsaxena@email.com', 'CRS-002', 'BAT-004', 'Bose Wasim', '9876500536', '360, Kolkata', '2024-02-12', 18000, 4500, 'Active', '2002-02-12', 'B'),
  ('STU-037', 'Pallavi Desai', '9876500037', 'pallavidesai@email.com', 'CRS-002', 'BAT-004', 'Mishra Zubin', '9876500537', '370, Ahmedabad', '2024-03-13', 18000, 9000, 'Active', '2003-03-13', 'B-'),
  ('STU-038', 'Riya Kapoor', '9876500038', 'riyakapoor@email.com', 'CRS-002', 'BAT-004', 'Chatterjee Bhavna', '9876500538', '380, Jaipur', '2024-04-14', 18000, 13500, 'Active', '2004-04-14', 'C'),
  ('STU-039', 'Siddharth Fernandes', '9876500039', 'siddharthfernandes@email.com', 'CRS-002', 'BAT-004', 'Gupta Deepa', '9876500539', '390, Lucknow', '2024-05-15', 18000, 18000, 'Active', '2005-05-15', '-'),
  ('STU-040', 'Tanvi Sharma', '9876500040', 'tanvisharma@email.com', 'CRS-002', 'BAT-004', 'Menon Farah', '9876500540', '400, Kochi', '2024-01-16', 18000, 0, 'Completed', '1998-01-16', 'A+'),
  ('STU-041', 'Uday Gupta', '9876500041', 'udaygupta@email.com', 'CRS-002', 'BAT-004', 'Rao Hema', '9876500541', '410, Indore', '2024-02-17', 18000, 4500, 'Inactive', '1999-02-17', 'A'),
  ('STU-042', 'Vidya Nair', '9876500042', 'vidyanair@email.com', 'CRS-003', 'BAT-005', 'Kapoor Juhi', '9876500542', '420, Nagpur', '2024-03-18', 35000, 17500, 'Active', '2000-03-18', 'A-'),
  ('STU-043', 'Wasim Iyer', '9876500043', 'wasimiyer@email.com', 'CRS-003', 'BAT-005', 'Patel Lavanya', '9876500543', '430, Surat', '2024-04-19', 35000, 26250, 'Active', '2001-04-19', 'B+'),
  ('STU-044', 'Yamini Bose', '9876500044', 'yaminibose@email.com', 'CRS-003', 'BAT-005', 'Joshi Naveen', '9876500544', '440, Bhopal', '2024-05-20', 35000, 35000, 'Active', '2002-05-20', 'B'),
  ('STU-045', 'Zubin Agarwal', '9876500045', 'zubinagarwal@email.com', 'CRS-003', 'BAT-005', 'Agarwal Aarav', '9876500545', '450, Bangalore', '2024-01-21', 35000, 0, 'Active', '2003-01-21', 'B-'),
  ('STU-046', 'Abhishek Saxena', '9876500046', 'abhisheksaxena@email.com', 'CRS-003', 'BAT-005', 'Shah Karan', '9876500546', '460, Mumbai', '2024-02-22', 35000, 8750, 'Active', '2004-02-22', 'C'),
  ('STU-047', 'Bhavna Desai', '9876500047', 'bhavnadesai@email.com', 'CRS-005', 'BAT-006', 'Gowda Nikhil', '9876500547', '470, Delhi', '2024-03-23', 12000, 6000, 'Completed', '2005-03-23', '-'),
  ('STU-048', 'Chirag Kapoor', '9876500048', 'chiragkapoor@email.com', 'CRS-005', 'BAT-006', 'Nair Rohan', '9876500548', '480, Hyderabad', '2024-04-24', 12000, 9000, 'Inactive', '1998-04-24', 'A+'),
  ('STU-049', 'Deepa Fernandes', '9876500049', 'deepafernandes@email.com', 'CRS-005', 'BAT-006', 'Chopra Tarun', '9876500549', '490, Chennai', '2024-05-25', 12000, 12000, 'Active', '1999-05-25', 'A'),
  ('STU-050', 'Eshan Sharma', '9876500050', 'eshansharma@email.com', 'CRS-005', 'BAT-006', 'Kulkarni Varun', '9876500550', '500, Pune', '2024-01-01', 12000, 0, 'Active', '2000-01-01', 'A-'),
  ('STU-051', 'Farah Gupta', '9876500051', 'farahgupta@email.com', 'CRS-005', 'BAT-006', 'Fernandes Zara', '9876500551', '510, Kolkata', '2024-02-02', 12000, 3000, 'Active', '2001-02-02', 'B+'),
  ('STU-052', 'Gaurav Nair', '9876500052', 'gauravnair@email.com', 'CRS-005', 'BAT-006', 'Reddy Ira', '9876500552', '520, Ahmedabad', '2024-03-03', 12000, 6000, 'Active', '2002-03-03', 'B'),
  ('STU-053', 'Hema Iyer', '9876500053', 'hemaiyer@email.com', 'CRS-004', 'BAT-007', 'Das Kiran', '9876500553', '530, Jaipur', '2024-04-04', 20000, 15000, 'Active', '2003-04-04', 'B-'),
  ('STU-054', 'Imran Bose', '9876500054', 'imranbose@email.com', 'CRS-004', 'BAT-007', 'Saxena Manish', '9876500554', '540, Lucknow', '2024-05-05', 20000, 20000, 'Completed', '2004-05-05', 'C'),
  ('STU-055', 'Juhi Agarwal', '9876500055', 'juhiagarwal@email.com', 'CRS-004', 'BAT-007', 'Banerjee Omkar', '9876500555', '550, Kochi', '2024-01-06', 20000, 0, 'Inactive', '2005-01-06', '-'),
  ('STU-056', 'Kunal Saxena', '9876500056', 'kunalsaxena@email.com', 'CRS-004', 'BAT-007', 'Kumar Riya', '9876500556', '560, Indore', '2024-02-07', 20000, 5000, 'Active', '1998-02-07', 'A+'),
  ('STU-057', 'Lavanya Desai', '9876500057', 'lavanyadesai@email.com', 'CRS-004', 'BAT-007', 'Iyer Tanvi', '9876500557', '570, Nagpur', '2024-03-08', 20000, 10000, 'Active', '1999-03-08', 'A'),
  ('STU-058', 'Mitesh Kapoor', '9876500058', 'miteshkapoor@email.com', 'CRS-004', 'BAT-007', 'Pillai Vidya', '9876500558', '580, Surat', '2024-04-09', 20000, 15000, 'Active', '2000-04-09', 'A-'),
  ('STU-059', 'Naveen Fernandes', '9876500059', 'naveenfernandes@email.com', 'CRS-006', 'BAT-008', 'Mehta Yamini', '9876500559', '590, Bhopal', '2024-05-10', 28000, 28000, 'Active', '2001-05-10', 'B+'),
  ('STU-060', 'Olivia Sharma', '9876500060', 'oliviasharma@email.com', 'CRS-006', 'BAT-008', 'Sharma Abhishek', '9876500560', '600, Bangalore', '2024-01-11', 28000, 0, 'Active', '2002-01-11', 'B')
ON DUPLICATE KEY UPDATE
  name = VALUES(name), phone = VALUES(phone), email = VALUES(email),
  course_id = VALUES(course_id), batch_id = VALUES(batch_id),
  guardian = VALUES(guardian), guardian_phone = VALUES(guardian_phone),
  address = VALUES(address), fees_total = VALUES(fees_total), fees_paid = VALUES(fees_paid),
  status = VALUES(status), dob = VALUES(dob), grade = VALUES(grade);

-- ─── Payments ────────────────────────────────────────────────────

INSERT INTO payments (receipt, student_id, amount, mode, pay_date, remarks) VALUES
  ('RCP-2024-0892', 'STU-001', 5000,  'UPI',           '2024-03-10', 'Installment 2'),
  ('RCP-2024-0891', 'STU-002', 18000, 'Bank Transfer', '2024-03-08', 'Full payment'),
  ('RCP-2024-0890', 'STU-006', 6250,  'Cash',          '2024-03-05', 'Installment 1'),
  ('RCP-2024-0889', 'STU-008', 9000,  'UPI',           '2024-03-03', 'Installment 1'),
  ('RCP-2024-0888', 'STU-010', 12000, 'Cheque',        '2024-03-01', 'Full payment'),
  ('RCP-2024-0887', 'STU-003', 8750,  'UPI',           '2024-02-28', 'Installment 1'),
  ('RCP-2024-0886', 'STU-004', 20000, 'Card',          '2024-02-25', 'Full payment'),
  ('RCP-2024-0885', 'STU-007', 35000, 'Bank Transfer', '2024-02-20', 'Course completion fees'),
  ('RCP-2024-0884', 'STU-009', 10000, 'UPI',           '2024-03-15', 'Installment 1'),
  ('RCP-2024-0883', 'STU-005', 6000,  'Cash',          '2024-03-18', 'Installment 1'),
  ('RCP-2024-0882', 'STU-013', 14000, 'UPI',           '2024-04-01', 'Installment 1'),
  ('RCP-2024-0881', 'STU-014', 28000, 'Online',        '2024-04-08', 'Installment 2'),
  ('RCP-2024-0880', 'STU-011', 5000,  'UPI',           '2024-04-12', 'Admission advance'),
  ('RCP-2024-0879', 'STU-015', 7000,  'Cash',          '2024-04-15', 'Installment 1')
ON DUPLICATE KEY UPDATE amount = VALUES(amount), mode = VALUES(mode), pay_date = VALUES(pay_date);

-- ─── Exams ───────────────────────────────────────────────────────

INSERT INTO exams (id, title, course_id, batch_id, exam_date, max_marks, status) VALUES
  ('EXM-001', 'Module 1 Assessment',         'CRS-001', 'BAT-001', '2024-02-10', 100, 'Completed'),
  ('EXM-002', 'Module 2 Mid-Term',            'CRS-001', 'BAT-001', '2024-03-05', 100, 'Completed'),
  ('EXM-003', 'Module 3 Project Review',      'CRS-001', 'BAT-001', '2024-03-20', 100, 'Upcoming'),
  ('EXM-004', 'Final Examination',            'CRS-002', 'BAT-003', '2024-04-15', 150, 'Upcoming'),
  ('EXM-005', 'Practical Assessment',         'CRS-003', 'BAT-005', '2024-03-18', 100, 'Completed'),
  ('EXM-006', 'Portfolio Review',             'CRS-004', 'BAT-007', '2024-03-22', 100, 'Completed'),
  ('EXM-007', 'Tally Practical Exam',         'CRS-005', 'BAT-006', '2024-04-01', 100, 'Completed'),
  ('EXM-008', 'React & Node.js Assessment',   'CRS-001', 'BAT-001', '2024-04-10', 100, 'Completed'),
  ('EXM-009', 'Flutter Basics Test',          'CRS-006', 'BAT-008', '2024-04-20', 100, 'Completed'),
  ('EXM-010', 'SEO & Analytics Final',        'CRS-002', 'BAT-003', '2024-05-01', 150, 'Upcoming')
ON DUPLICATE KEY UPDATE
  title = VALUES(title), exam_date = VALUES(exam_date),
  max_marks = VALUES(max_marks), status = VALUES(status);

-- ─── Exam marks ──────────────────────────────────────────────────

INSERT INTO exam_marks (id, exam_id, student_id, marks) VALUES
  -- Full Stack BAT-001 — Module 1 (EXM-001)
  ('11111111-1111-4111-8111-111111111101', 'EXM-001', 'STU-001', 85),
  ('11111111-1111-4111-8111-111111111102', 'EXM-001', 'STU-006', 90),
  -- Module 2 (EXM-002)
  ('11111111-1111-4111-8111-111111111201', 'EXM-002', 'STU-001', 78),
  ('11111111-1111-4111-8111-111111111202', 'EXM-002', 'STU-006', 88),
  -- React assessment (EXM-008)
  ('11111111-1111-4111-8111-111111111801', 'EXM-008', 'STU-001', 92),
  ('11111111-1111-4111-8111-111111111802', 'EXM-008', 'STU-006', 94),
  -- Data Science (EXM-005)
  ('11111111-1111-4111-8111-111111111501', 'EXM-005', 'STU-003', 72),
  ('11111111-1111-4111-8111-111111111502', 'EXM-005', 'STU-007', 88),
  ('11111111-1111-4111-8111-111111111503', 'EXM-005', 'STU-014', 81),
  -- Graphic Design (EXM-006)
  ('11111111-1111-4111-8111-111111111601', 'EXM-006', 'STU-004', 80),
  ('11111111-1111-4111-8111-111111111602', 'EXM-006', 'STU-009', 76),
  -- Tally (EXM-007)
  ('11111111-1111-4111-8111-111111111701', 'EXM-007', 'STU-005', 55),
  ('11111111-1111-4111-8111-111111111702', 'EXM-007', 'STU-010', 82),
  -- Digital Marketing partial (STU-008)
  ('11111111-1111-4111-8111-111111111401', 'EXM-004', 'STU-002', 0),
  ('11111111-1111-4111-8111-111111111402', 'EXM-004', 'STU-008', 0),
  -- Mobile dev (EXM-009)
  ('11111111-1111-4111-8111-111111111901', 'EXM-009', 'STU-013', 79),
  ('11111111-1111-4111-8111-111111111902', 'EXM-009', 'STU-015', 71)
ON DUPLICATE KEY UPDATE marks = VALUES(marks);

-- ─── Certificates ────────────────────────────────────────────────

INSERT INTO certificates (cert_no, student_id, course_id, grade, issue_date, authorised_by) VALUES
  ('CERT-2024-001', 'STU-007', 'CRS-003', 'A',  '2024-03-10', 'Director, Triton'),
  ('CERT-2024-002', 'STU-002', 'CRS-002', 'A+', '2024-03-12', 'Director, Triton'),
  ('CERT-2024-003', 'STU-010', 'CRS-005', 'A',  '2024-03-14', 'Director, Triton'),
  ('CERT-2024-004', 'STU-004', 'CRS-004', 'A',  '2024-03-18', 'Director, Triton'),
  ('CERT-2024-005', 'STU-001', 'CRS-001', 'A',  '2024-04-05', 'Director, Triton')
ON DUPLICATE KEY UPDATE grade = VALUES(grade), issue_date = VALUES(issue_date);

-- ─── Attendance (recent sessions) ───────────────────────────────

INSERT INTO attendance_records (id, student_id, batch_id, record_date, status) VALUES
  -- BAT-001 — 2026-06-16
  ('STU-001_BAT-001_2026-06-16', 'STU-001', 'BAT-001', '2026-06-16', 'present'),
  ('STU-006_BAT-001_2026-06-16', 'STU-006', 'BAT-001', '2026-06-16', 'present'),
  -- BAT-001 — 2026-06-17
  ('STU-001_BAT-001_2026-06-17', 'STU-001', 'BAT-001', '2026-06-17', 'present'),
  ('STU-006_BAT-001_2026-06-17', 'STU-006', 'BAT-001', '2026-06-17', 'absent'),
  -- BAT-003 — 2026-06-17
  ('STU-002_BAT-003_2026-06-17', 'STU-002', 'BAT-003', '2026-06-17', 'present'),
  ('STU-008_BAT-003_2026-06-17', 'STU-008', 'BAT-003', '2026-06-17', 'present'),
  -- BAT-005 — 2026-06-15 (weekend)
  ('STU-003_BAT-005_2026-06-15', 'STU-003', 'BAT-005', '2026-06-15', 'present'),
  ('STU-007_BAT-005_2026-06-15', 'STU-007', 'BAT-005', '2026-06-15', 'present'),
  ('STU-014_BAT-005_2026-06-15', 'STU-014', 'BAT-005', '2026-06-15', 'leave'),
  -- BAT-007 — 2026-06-16
  ('STU-004_BAT-007_2026-06-16', 'STU-004', 'BAT-007', '2026-06-16', 'present'),
  ('STU-009_BAT-007_2026-06-16', 'STU-009', 'BAT-007', '2026-06-16', 'present'),
  -- BAT-006 — 2026-06-17
  ('STU-005_BAT-006_2026-06-17', 'STU-005', 'BAT-006', '2026-06-17', 'absent'),
  ('STU-010_BAT-006_2026-06-17', 'STU-010', 'BAT-006', '2026-06-17', 'present'),
  -- BAT-008 — 2026-06-17
  ('STU-013_BAT-008_2026-06-17', 'STU-013', 'BAT-008', '2026-06-17', 'present'),
  ('STU-015_BAT-008_2026-06-17', 'STU-015', 'BAT-008', '2026-06-17', 'present'),
  -- Historical — March 2024 sample days
  ('STU-001_BAT-001_2024-03-01', 'STU-001', 'BAT-001', '2024-03-01', 'present'),
  ('STU-001_BAT-001_2024-03-02', 'STU-001', 'BAT-001', '2024-03-02', 'present'),
  ('STU-001_BAT-001_2024-03-04', 'STU-001', 'BAT-001', '2024-03-04', 'absent'),
  ('STU-006_BAT-001_2024-03-01', 'STU-006', 'BAT-001', '2024-03-01', 'present'),
  ('STU-006_BAT-001_2024-03-04', 'STU-006', 'BAT-001', '2024-03-04', 'present'),
  ('STU-003_BAT-005_2024-03-02', 'STU-003', 'BAT-005', '2024-03-02', 'present'),
  ('STU-003_BAT-005_2024-03-03', 'STU-003', 'BAT-005', '2024-03-03', 'absent')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- ─── Notifications ───────────────────────────────────────────────

INSERT INTO notifications (type, title, message, is_read) VALUES
  ('fee',        'Fee Due Reminder',        '5 students have fees due this week. Total outstanding: ₹42,500',              0),
  ('admission',  'New Admission Confirmed', 'Ishaan Mehta enrolled in Full Stack Web Dev — Batch E starting April 1st', 0),
  ('completion', 'Course Completion',       'Aditya Singh completed Data Science & ML with grade A.',                    1),
  ('exam',       'Exam Results Published',  'Full Stack Web Dev — Module 2 results are now available for review.',         1),
  ('fee',        'Overdue Fee Alert',       'Mohammed Ali has an outstanding balance of ₹6,000 (overdue 15 days).',      1),
  ('admission',  'Admission Enquiry',       'New enquiry received for Digital Marketing from Vikram Shah.',                1),
  ('exam',       'Exam Scheduled',          'SEO & Analytics Final scheduled for Batch B on 2024-05-01.',                  0),
  ('certificate','Certificate Issued',      'Certificate CERT-2024-005 issued to Arjun Sharma.',                         0)
ON DUPLICATE KEY UPDATE title = VALUES(title), message = VALUES(message);
