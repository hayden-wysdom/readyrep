-- =============================================
-- Industry Professional Module - Database Schema
-- Run this in your Supabase SQL Editor
-- NOTE: If you already ran the previous version,
-- run supabase-migration.sql instead.
-- =============================================

-- 1. Companies table
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  color TEXT DEFAULT '#475569',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Devices table
CREATE TABLE devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  category TEXT,
  description TEXT,
  image_url TEXT,
  product_demo_url TEXT,
  specs_url TEXT,
  specifications TEXT[] DEFAULT '{}',
  video_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Device Videos table
CREATE TABLE device_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  thumbnail_url TEXT,
  author TEXT,
  author_title TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Representatives table
CREATE TABLE representatives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  coverage_areas TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  products_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Indexes for performance
CREATE INDEX idx_devices_company ON devices(company_id);
CREATE INDEX idx_devices_category ON devices(category);
CREATE INDEX idx_videos_device ON device_videos(device_id);
CREATE INDEX idx_reps_company ON representatives(company_id);
CREATE INDEX idx_reps_state ON representatives(state);

-- 6. Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE representatives ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies - authenticated users can read all data
CREATE POLICY "Authenticated users can view companies"
  ON companies FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view devices"
  ON devices FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view device_videos"
  ON device_videos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view representatives"
  ON representatives FOR SELECT TO authenticated USING (true);

-- =============================================
-- SEED DATA
-- =============================================

-- Insert companies
INSERT INTO companies (name) VALUES
  ('Boston Scientific'),
  ('Gore Medical'),
  ('Cook Medical'),
  ('Becton Dickinson'),
  ('Okami Medical'),
  ('Medtronic');

-- Insert devices with placeholder images and specifications
INSERT INTO devices (name, company_id, category, description, image_url, product_demo_url, specs_url, specifications, video_count)
VALUES
  ('Viatorr TIPS Endoprosthesis',
    (SELECT id FROM companies WHERE name = 'Gore Medical'),
    'TIPS',
    'The GORE VIATORR TIPS Endoprosthesis is designed to create a portosystemic shunt to treat portal hypertension complications including variceal bleeding and refractory ascites.',
    'https://images.unsplash.com/photo-1583912267550-d974311a9a6e?w=400&h=300&fit=crop',
    'https://www.goremedical.com/products/viatorr',
    'https://www.goremedical.com/products/viatorr/specifications',
    ARRAY['ePTFE-lined nitinol self-expanding stent-graft', 'Available in 8mm and 10mm diameters', 'Covered and uncovered sections for optimal placement', 'Radiopaque markers for precise positioning'],
    1),

  ('GORE VIABAHN Endoprosthesis',
    (SELECT id FROM companies WHERE name = 'Gore Medical'),
    'Stents',
    'A flexible, expanded PTFE-lined nitinol stent graft for treating peripheral arterial disease in the superficial femoral artery (SFA) and iliac arteries.',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=300&fit=crop',
    'https://www.goremedical.com/products/viabahn',
    'https://www.goremedical.com/products/viabahn/specifications',
    ARRAY['Heparin Bioactive Surface for thromboresistance', 'Contoured edge for smooth transition', 'Available in 5-13mm diameters, 25-250mm lengths', 'Flexible nitinol exoskeleton'],
    2),

  ('GORE Viabahn Fortegra',
    (SELECT id FROM companies WHERE name = 'Gore Medical'),
    'Stents',
    'Next-generation endoprosthesis combining the proven GORE VIABAHN technology with enhanced radial strength and flexibility for complex lesion treatment.',
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=300&fit=crop',
    'https://www.goremedical.com/products/viabahn-fortegra',
    NULL,
    ARRAY['Enhanced radial strength vs standard Viabahn', 'Dual-layer nitinol construction', 'Heparin Bioactive Surface', 'Designed for complex SFA lesions'],
    1),

  ('Obsidio',
    (SELECT id FROM companies WHERE name = 'Boston Scientific'),
    'Embolics',
    'Conformable embolic technology designed for peripheral embolization procedures, providing controlled and predictable vessel occlusion.',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop',
    'https://www.bostonscientific.com/en-US/products/embolization.html',
    NULL,
    ARRAY['Conformable hydrogel technology', 'Controlled, predictable vessel occlusion', 'Radiopaque for fluoroscopic visualization', 'Multiple sizes for various vessel diameters'],
    1),

  ('Mustang Balloon Dilation Catheter',
    (SELECT id FROM companies WHERE name = 'Boston Scientific'),
    'Balloons',
    'High-performance balloon dilation catheter designed for peripheral vascular interventions with excellent crossability and rated burst pressures.',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop',
    'https://www.bostonscientific.com/en-US/products/catheters-balloon.html',
    'https://www.bostonscientific.com/en-US/products/catheters-balloon/mustang.html',
    ARRAY['Powerful dilation up to 26 atmosphere rated burst pressure', 'Low profile - 7x200mm through 5F with tip only 4% larger than an 0.035" wire', 'Broadest size matrix - 203 codes', 'Semi-compliant balloon material'],
    1),

  ('Liverify TIPS Set',
    (SELECT id FROM companies WHERE name = 'Becton Dickinson'),
    'TIPS',
    'A comprehensive transjugular intrahepatic portosystemic shunt access set designed to facilitate the TIPS procedure with precision and control.',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=300&fit=crop',
    'https://www.bd.com/en-us/offerings/capabilities/interventional-specialties',
    NULL,
    ARRAY['Complete TIPS access kit in one package', 'Graduated stiffness transition zone', '10F working sheath', 'Designed for transjugular hepatic vein access'],
    1),

  ('Venovo Stent',
    (SELECT id FROM companies WHERE name = 'Becton Dickinson'),
    'Stents',
    'Purpose-built venous stent designed specifically to treat iliofemoral venous outflow obstruction with optimal radial force and flexibility.',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop',
    'https://www.bd.com/en-us/offerings/capabilities/interventional-specialties/venous',
    NULL,
    ARRAY['Open-cell design for flexibility at hip and inguinal ligament', 'High radial force to resist external compression', 'Available in 12-20mm diameters, 40-160mm lengths', 'Crush-resistant nitinol construction'],
    1),

  ('Protege GPS Stent',
    (SELECT id FROM companies WHERE name = 'Medtronic'),
    'Stents',
    'Self-expanding peripheral stent system with GPS (great precision and support) for the treatment of atherosclerotic disease in the iliac and femoral arteries.',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&h=300&fit=crop',
    'https://www.medtronic.com/us-en/healthcare-professionals/products/cardiovascular/stents.html',
    NULL,
    ARRAY['GPS delivery system for precise deployment', 'Integrated tantalum radiopaque markers', 'Consistent cell geometry for uniform coverage', 'Available in 6-10mm diameters'],
    1),

  ('Gore Cardioform Septal Occluder',
    (SELECT id FROM companies WHERE name = 'Gore Medical'),
    'Septal',
    'Soft, conformable device for transcatheter closure of patent foramen ovale (PFO) to reduce the risk of recurrent ischemic stroke.',
    'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=300&fit=crop',
    'https://www.goremedical.com/products/cardioform-septal-occluder',
    NULL,
    ARRAY['Soft, conformable wireform design', 'Platinum-filled markers for echo and fluoro visibility', 'Low profile delivery catheter', 'Designed specifically for PFO closure'],
    1),

  ('Abre Stent',
    (SELECT id FROM companies WHERE name = 'Medtronic'),
    'Stents',
    'Venous self-expanding stent system designed to restore blood flow in patients with symptomatic iliofemoral venous outflow obstruction.',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    NULL, NULL,
    ARRAY['Three-zone design adapts to venous anatomy', 'High radial force in body zone', 'Flexible landing zones at each end', 'Available in 12-16mm diameters'],
    0),

  ('MReye Embolization Coils',
    (SELECT id FROM companies WHERE name = 'Cook Medical'),
    'Embolics',
    'Controlled-release detachable embolization coils designed for precise vessel occlusion in peripheral embolization procedures.',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    'https://www.cookmedical.com/products/interventional-radiology/embolization/',
    NULL,
    ARRAY['MReye technology for MRI visibility', 'Controlled detachment mechanism', 'Synthetic fiber tufts for enhanced thrombogenicity', 'Wide range of sizes and configurations'],
    1),

  ('Micropuncture Access Set',
    (SELECT id FROM companies WHERE name = 'Cook Medical'),
    'Vascular Access',
    'Designed for initial vascular access, the Micropuncture set allows precise, atraumatic entry using a 21-gauge needle and coaxial dilator system.',
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=300&fit=crop',
    'https://www.cookmedical.com/products/interventional-radiology/vascular-access/',
    NULL,
    ARRAY['21-gauge needle for initial access', 'Coaxial transitional dilator from 3F to 5F', '0.018" guidewire for initial entry', 'Reduces risk of access-site complications'],
    1),

  ('Lobo Vascular Occluder',
    (SELECT id FROM companies WHERE name = 'Okami Medical'),
    'Occlusion',
    'Next-generation vascular occlusion device designed for precise and complete vessel occlusion in peripheral embolization procedures.',
    'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=400&h=300&fit=crop',
    'https://www.okamimedical.com/lobo',
    NULL,
    ARRAY['Lobed design for complete vessel fill', 'Controlled mechanical detachment', 'Single device for complete occlusion', 'Available in multiple sizes for various vessel diameters'],
    1);

-- Insert device videos
INSERT INTO device_videos (device_id, title, url, thumbnail_url, author, author_title)
VALUES
  ((SELECT id FROM devices WHERE name = 'Mustang Balloon Dilation Catheter'),
    'Balloon Angioplasty (semi-compliant) Box Explained',
    'https://wysdom.ai/videos/balloon-angioplasty',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=320&h=180&fit=crop',
    'Rusty Hofmann, MD',
    'Professor of Interventional Radiology at Stanford'),

  ((SELECT id FROM devices WHERE name = 'Mustang Balloon Dilation Catheter'),
    'Balloon Expansion',
    'https://wysdom.ai/videos/balloon-expansion',
    'https://images.unsplash.com/photo-1551190822-a9ce113d0d15?w=320&h=180&fit=crop',
    'Luke R Wilkins, MD',
    'Professor of Interventional Radiology at University of Virginia'),

  ((SELECT id FROM devices WHERE name = 'Viatorr TIPS Endoprosthesis'),
    'TIPS Procedure Overview',
    'https://wysdom.ai/videos/tips-overview',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=320&h=180&fit=crop',
    'Rusty Hofmann, MD',
    'Professor of Interventional Radiology at Stanford'),

  ((SELECT id FROM devices WHERE name = 'GORE VIABAHN Endoprosthesis'),
    'Covered Stent Placement Technique',
    'https://wysdom.ai/videos/covered-stent-placement',
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=320&h=180&fit=crop',
    'Charles Martin, MD',
    'Professor of Vascular Surgery at Johns Hopkins'),

  ((SELECT id FROM devices WHERE name = 'GORE VIABAHN Endoprosthesis'),
    'SFA Disease Management',
    'https://wysdom.ai/videos/sfa-disease',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=320&h=180&fit=crop',
    'Sarah Kim, MD',
    'Associate Professor at UCLA Interventional Radiology'),

  ((SELECT id FROM devices WHERE name = 'Obsidio'),
    'Embolization Techniques: Conformable Agents',
    'https://wysdom.ai/videos/embolization-conformable',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=320&h=180&fit=crop',
    'James Patel, MD',
    'Director of IR at Massachusetts General Hospital'),

  ((SELECT id FROM devices WHERE name = 'Venovo Stent'),
    'Iliofemoral Venous Stenting',
    'https://wysdom.ai/videos/venous-stenting',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?w=320&h=180&fit=crop',
    'Emily Rodriguez, MD',
    'Vascular Surgeon at Cleveland Clinic'),

  ((SELECT id FROM devices WHERE name = 'Gore Cardioform Septal Occluder'),
    'PFO Closure Technique',
    'https://wysdom.ai/videos/pfo-closure',
    'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=320&h=180&fit=crop',
    'David Chen, MD',
    'Structural Heart Specialist at Mayo Clinic'),

  ((SELECT id FROM devices WHERE name = 'MReye Embolization Coils'),
    'Coil Embolization Principles',
    'https://wysdom.ai/videos/coil-embolization',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=320&h=180&fit=crop',
    'Lisa Thompson, MD',
    'Associate Professor of IR at Duke University'),

  ((SELECT id FROM devices WHERE name = 'Micropuncture Access Set'),
    'Micropuncture Technique for Safe Vascular Access',
    'https://wysdom.ai/videos/micropuncture-technique',
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=320&h=180&fit=crop',
    'Rusty Hofmann, MD',
    'Professor of Interventional Radiology at Stanford'),

  ((SELECT id FROM devices WHERE name = 'Lobo Vascular Occluder'),
    'Mechanical Occlusion Devices Overview',
    'https://wysdom.ai/videos/mechanical-occlusion',
    'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=320&h=180&fit=crop',
    'Michael Wang, MD',
    'Interventional Radiologist at UCSF'),

  ((SELECT id FROM devices WHERE name = 'GORE Viabahn Fortegra'),
    'Complex SFA Lesion Management',
    'https://wysdom.ai/videos/complex-sfa',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=320&h=180&fit=crop',
    'Robert Kim, MD',
    'Vascular Surgeon at Northwestern'),

  ((SELECT id FROM devices WHERE name = 'Protege GPS Stent'),
    'Self-Expanding Stent Deployment',
    'https://wysdom.ai/videos/self-expanding-stent',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=320&h=180&fit=crop',
    'Anna Park, MD',
    'Interventional Cardiologist at Cedars-Sinai'),

  ((SELECT id FROM devices WHERE name = 'Liverify TIPS Set'),
    'TIPS Access: Step by Step',
    'https://wysdom.ai/videos/tips-access',
    'https://images.unsplash.com/photo-1551190822-a9ce113d0d15?w=320&h=180&fit=crop',
    'Rusty Hofmann, MD',
    'Professor of Interventional Radiology at Stanford');

-- Insert representatives with avatar placeholders
INSERT INTO representatives (name, company_id, email, phone, city, state, coverage_areas, specialties, products_count, avatar_url)
VALUES
  ('Sarah Mitchell',
    (SELECT id FROM companies WHERE name = 'Boston Scientific'),
    'sarah.mitchell@bsci.com', '(512) 555-0142',
    'Houston', 'Texas',
    ARRAY['Houston Metro', 'Galveston', 'Beaumont'],
    ARRAY['Embolics', 'Balloons'], 2,
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face'),

  ('James Chen',
    (SELECT id FROM companies WHERE name = 'Gore Medical'),
    'james.chen@gore.com', '(415) 555-0198',
    'San Francisco', 'California',
    ARRAY['Bay Area', 'Sacramento', 'San Jose'],
    ARRAY['TIPS', 'Stents', 'Septal'], 4,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face'),

  ('Maria Rodriguez',
    (SELECT id FROM companies WHERE name = 'Cook Medical'),
    'maria.rodriguez@cookmedical.com', '(312) 555-0167',
    'Chicago', 'Illinois',
    ARRAY['Chicago Metro', 'Milwaukee', 'Northwest Indiana'],
    ARRAY['Embolics', 'Vascular Access'], 2,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face'),

  ('David Thompson',
    (SELECT id FROM companies WHERE name = 'Becton Dickinson'),
    'david.thompson@bd.com', '(404) 555-0123',
    'Atlanta', 'Georgia',
    ARRAY['Metro Atlanta', 'Augusta', 'Savannah'],
    ARRAY['TIPS', 'Stents'], 2,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face'),

  ('Emily Watson',
    (SELECT id FROM companies WHERE name = 'Medtronic'),
    'emily.watson@medtronic.com', '(612) 555-0189',
    'Minneapolis', 'Minnesota',
    ARRAY['Twin Cities', 'Rochester', 'Duluth'],
    ARRAY['Stents'], 2,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face'),

  ('Michael Park',
    (SELECT id FROM companies WHERE name = 'Okami Medical'),
    'michael.park@okami.com', '(206) 555-0156',
    'Seattle', 'Washington',
    ARRAY['Seattle Metro', 'Tacoma', 'Olympia'],
    ARRAY['Occlusion'], 1,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'),

  ('Jennifer Adams',
    (SELECT id FROM companies WHERE name = 'Boston Scientific'),
    'jennifer.adams@bsci.com', '(617) 555-0134',
    'Boston', 'Massachusetts',
    ARRAY['Greater Boston', 'Providence', 'Hartford'],
    ARRAY['Embolics', 'Balloons'], 2,
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop&crop=face'),

  ('Robert Kim',
    (SELECT id FROM companies WHERE name = 'Gore Medical'),
    'robert.kim@gore.com', '(212) 555-0178',
    'New York', 'New York',
    ARRAY['Manhattan', 'Brooklyn', 'Long Island'],
    ARRAY['TIPS', 'Stents'], 4,
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=face'),

  ('Lisa Chen',
    (SELECT id FROM companies WHERE name = 'Cook Medical'),
    'lisa.chen@cookmedical.com', '(602) 555-0145',
    'Phoenix', 'Arizona',
    ARRAY['Phoenix Metro', 'Tucson', 'Scottsdale'],
    ARRAY['Embolics', 'Drainage'], 2,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face'),

  ('Andrew Martinez',
    (SELECT id FROM companies WHERE name = 'Becton Dickinson'),
    'andrew.martinez@bd.com', '(214) 555-0112',
    'Dallas', 'Texas',
    ARRAY['DFW Metroplex', 'Fort Worth', 'Arlington'],
    ARRAY['TIPS', 'Stents'], 2,
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=96&h=96&fit=crop&crop=face'),

  ('Rachel Lee',
    (SELECT id FROM companies WHERE name = 'Medtronic'),
    'rachel.lee@medtronic.com', '(303) 555-0167',
    'Denver', 'Colorado',
    ARRAY['Denver Metro', 'Colorado Springs', 'Boulder'],
    ARRAY['Stents'], 2,
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop&crop=face'),

  ('Thomas Brown',
    (SELECT id FROM companies WHERE name = 'Gore Medical'),
    'thomas.brown@gore.com', '(305) 555-0198',
    'Miami', 'Florida',
    ARRAY['Miami-Dade', 'Broward', 'Palm Beach'],
    ARRAY['TIPS', 'Stents', 'Septal'], 4,
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&fit=crop&crop=face'),

  ('Jessica Nguyen',
    (SELECT id FROM companies WHERE name = 'Boston Scientific'),
    'jessica.nguyen@bsci.com', '(503) 555-0189',
    'Portland', 'Oregon',
    ARRAY['Portland Metro', 'Salem', 'Eugene'],
    ARRAY['Embolics', 'Balloons'], 2,
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=96&h=96&fit=crop&crop=face'),

  ('Daniel Foster',
    (SELECT id FROM companies WHERE name = 'Cook Medical'),
    'daniel.foster@cookmedical.com', '(615) 555-0134',
    'Nashville', 'Tennessee',
    ARRAY['Nashville Metro', 'Knoxville', 'Memphis'],
    ARRAY['Vascular Access', 'Embolics'], 2,
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=96&h=96&fit=crop&crop=face'),

  ('Karen Wright',
    (SELECT id FROM companies WHERE name = 'Okami Medical'),
    'karen.wright@okami.com', '(858) 555-0156',
    'San Diego', 'California',
    ARRAY['San Diego County', 'Orange County'],
    ARRAY['Occlusion'], 1,
    'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=96&h=96&fit=crop&crop=face'),

  ('Steven Garcia',
    (SELECT id FROM companies WHERE name = 'Medtronic'),
    'steven.garcia@medtronic.com', '(215) 555-0123',
    'Philadelphia', 'Pennsylvania',
    ARRAY['Philadelphia Metro', 'Camden', 'Wilmington'],
    ARRAY['Stents'], 2,
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=96&h=96&fit=crop&crop=face'),

  ('Amanda Collins',
    (SELECT id FROM companies WHERE name = 'Becton Dickinson'),
    'amanda.collins@bd.com', '(704) 555-0178',
    'Charlotte', 'North Carolina',
    ARRAY['Charlotte Metro', 'Raleigh', 'Greensboro'],
    ARRAY['TIPS', 'Stents'], 2,
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=96&h=96&fit=crop&crop=face'),

  ('Christopher Lee',
    (SELECT id FROM companies WHERE name = 'Gore Medical'),
    'christopher.lee@gore.com', '(480) 555-0145',
    'Scottsdale', 'Arizona',
    ARRAY['Scottsdale', 'Mesa', 'Chandler'],
    ARRAY['TIPS', 'Stents'], 4,
    'https://images.unsplash.com/photo-1542909168-180c6d266ff2?w=96&h=96&fit=crop&crop=face'),

  ('Natalie Cooper',
    (SELECT id FROM companies WHERE name = 'Boston Scientific'),
    'natalie.cooper@bsci.com', '(314) 555-0167',
    'St. Louis', 'Missouri',
    ARRAY['St. Louis Metro', 'Kansas City', 'Springfield'],
    ARRAY['Embolics', 'Balloons'], 2,
    'https://images.unsplash.com/photo-1548142813-c348350df52b?w=96&h=96&fit=crop&crop=face'),

  ('William Harris',
    (SELECT id FROM companies WHERE name = 'Cook Medical'),
    'william.harris@cookmedical.com', '(317) 555-0198',
    'Indianapolis', 'Indiana',
    ARRAY['Indianapolis Metro', 'Fort Wayne', 'Evansville'],
    ARRAY['Embolics', 'Drainage', 'Vascular Access'], 3,
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=96&h=96&fit=crop&crop=face'),

  ('Patricia Simmons',
    (SELECT id FROM companies WHERE name = 'Medtronic'),
    'patricia.simmons@medtronic.com', '(813) 555-0189',
    'Tampa', 'Florida',
    ARRAY['Tampa Bay', 'Orlando', 'Sarasota'],
    ARRAY['Stents'], 2,
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=96&h=96&fit=crop&crop=face'),

  ('Mark Davidson',
    (SELECT id FROM companies WHERE name = 'Okami Medical'),
    'mark.davidson@okami.com', '(702) 555-0134',
    'Las Vegas', 'Nevada',
    ARRAY['Las Vegas Valley', 'Henderson', 'Reno'],
    ARRAY['Occlusion'], 1,
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=96&h=96&fit=crop&crop=face'),

  ('Sandra Patel',
    (SELECT id FROM companies WHERE name = 'Becton Dickinson'),
    'sandra.patel@bd.com', '(410) 555-0112',
    'Baltimore', 'Maryland',
    ARRAY['Baltimore Metro', 'Annapolis', 'Frederick'],
    ARRAY['TIPS', 'Stents'], 2,
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=96&h=96&fit=crop&crop=face'),

  ('Ryan O''Brien',
    (SELECT id FROM companies WHERE name = 'Gore Medical'),
    'ryan.obrien@gore.com', '(720) 555-0156',
    'Boulder', 'Colorado',
    ARRAY['Boulder', 'Fort Collins', 'Loveland'],
    ARRAY['TIPS', 'Stents', 'Septal'], 4,
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=96&h=96&fit=crop&crop=face');
