import { GoogleGenAI } from "@google/genai";

// Mock data for news articles
export const MOCK_NEWS = [
  {
    id: "1",
    title: "தமிழகத்தில் புதிய தொழில் கொள்கை வெளியீடு: முதல்வர் ஸ்டாலின் அறிவிப்பு",
    titleEn: "New Industrial Policy Released in Tamil Nadu: CM Stalin Announces",
    category: "Tamil Nadu",
    image: "https://picsum.photos/seed/tn-business/800/450",
    date: new Date().toISOString(),
    author: "Vannatamil Desk",
    summary: "தமிழகத்தின் பொருளாதார வளர்ச்சியை மேம்படுத்தும் வகையில் புதிய தொழில் கொள்கையை முதல்வர் மு.க.ஸ்டாலின் இன்று வெளியிட்டார்.",
    content: "தமிழக முதல்வர் மு.க.ஸ்டாலின் இன்று சென்னையில் நடைபெற்ற விழாவில் புதிய தொழில் கொள்கை 2024-ஐ வெளியிட்டார். இக்கொள்கை அடுத்த ஐந்து ஆண்டுகளில் தமிழகத்திற்கு 10 லட்சம் கோடி ரூபாய் முதலீடுகளை ஈர்க்கவும், 20 லட்சம் பேருக்கு வேலைவாய்ப்புகளை உருவாக்கவும் இலக்கு நிர்ணயித்துள்ளது. குறிப்பாக செமி-கண்டக்டர் மற்றும் எலக்ட்ரானிக்ஸ் துறைகளில் அதிக கவனம் செலுத்தப்படும் என்று முதல்வர் தெரிவித்தார்.",
    trending: true,
  },
  {
    id: "2",
    title: "ஐபிஎல் 2024: சென்னை சூப்பர் கிங்ஸ் அபார வெற்றி",
    titleEn: "IPL 2024: Chennai Super Kings' Spectacular Victory",
    category: "Sports",
    image: "https://picsum.photos/seed/csk-win/800/450",
    date: new Date().toISOString(),
    author: "Sports Reporter",
    summary: "பரபரப்பான ஆட்டத்தில் மும்பை இந்தியன்ஸ் அணியை வீழ்த்தி சென்னை சூப்பர் கிங்ஸ் அணி வெற்றி பெற்றது.",
    content: "வான்கடே மைதானத்தில் நடைபெற்ற ஐபிஎல் லீக் ஆட்டத்தில் சென்னை சூப்பர் கிங்ஸ் மற்றும் மும்பை இந்தியன்ஸ் அணிகள் மோதின. முதலில் பேட்டிங் செய்த சிஎஸ்கே அணி 20 ஓவர்களில் 206 ரன்கள் எடுத்தது. பின்னர் ஆடிய மும்பை அணி 186 ரன்கள் மட்டுமே எடுத்து தோல்வியடைந்தது. சிஎஸ்கே தரப்பில் பதிரானா 4 விக்கெட்டுகளை வீழ்த்தி ஆட்டநாயகன் விருது பெற்றார்.",
    trending: true,
  },
  {
    id: "3",
    title: "புதிய ஐபோன் 16 வெளியீடு: தொழில்நுட்ப உலகில் பெரும் எதிர்பார்ப்பு",
    titleEn: "iPhone 16 Launch: High Expectations in Tech World",
    category: "Technology",
    image: "https://picsum.photos/seed/iphone16/800/450",
    date: new Date().toISOString(),
    author: "Tech Desk",
    summary: "ஆப்பிள் நிறுவனம் தனது புதிய ஐபோன் 16 சீரிஸை அறிமுகப்படுத்தியுள்ளது. இதில் பல்வேறு புதிய அம்சங்கள் சேர்க்கப்பட்டுள்ளன.",
    content: "ஆப்பிள் நிறுவனம் தனது வருடாந்திர நிகழ்வில் ஐபோன் 16 சீரிஸை அதிகாரப்பூர்வமாக அறிமுகப்படுத்தியது. இதில் புதிய ஏ18 சிப், மேம்படுத்தப்பட்ட கேமரா சிஸ்டம் மற்றும் ஆப்பிள் இன்டெலிஜென்ஸ் எனப்படும் ஏஐ அம்சங்கள் இடம் பெற்றுள்ளன. இதன் விலை முந்தைய மாடல்களை விட சற்று அதிகமாக இருக்கும் என்று எதிர்பார்க்கப்படுகிறது.",
    trending: false,
  },
  {
    id: "4",
    title: "திரையுலகில் அதிர்வு: பிரபல நடிகரின் புதிய பட அறிவிப்பு",
    titleEn: "Cinema Buzz: Popular Actor's New Movie Announcement",
    category: "Entertainment",
    image: "https://picsum.photos/seed/cinema/800/450",
    date: new Date().toISOString(),
    author: "Cinema Desk",
    summary: "முன்னணி இயக்குனர் இயக்கத்தில் பிரம்மாண்டமாக உருவாகும் புதிய படத்தின் அறிவிப்பு இன்று வெளியானது.",
    content: "தமிழ் திரையுலகின் முன்னணி நடிகர் மற்றும் இயக்குனர் கூட்டணியில் புதிய படம் ஒன்று உருவாக உள்ளது. இப்படத்திற்கு ஏ.ஆர்.ரஹ்மான் இசையமைக்கிறார். இப்படத்தின் படப்பிடிப்பு அடுத்த மாதம் தொடங்க உள்ளதாக தயாரிப்பு நிறுவனம் அறிவித்துள்ளது. இது ஒரு வரலாற்று பின்னணி கொண்ட ஆக்ஷன் படமாக இருக்கும் என்று கூறப்படுகிறது.",
    trending: false,
  },
  {
    id: "5",
    title: "இந்திய பொருளாதார வளர்ச்சி 7.5% ஆக உயர்வு: உலக வங்கி கணிப்பு",
    titleEn: "India's GDP Growth to Hit 7.5%: World Bank Forecast",
    category: "Business",
    image: "https://picsum.photos/seed/economy/800/450",
    date: new Date().toISOString(),
    author: "Business Desk",
    summary: "நடப்பு நிதியாண்டில் இந்தியாவின் பொருளாதார வளர்ச்சி 7.5 சதவீதமாக இருக்கும் என்று உலக வங்கி தெரிவித்துள்ளது.",
    content: "உலக வங்கி வெளியிட்டுள்ள சமீபத்திய அறிக்கையில், இந்தியாவின் பொருளாதார வளர்ச்சி வலுவாக இருப்பதாக குறிப்பிட்டுள்ளது. உள்நாட்டு நுகர்வு மற்றும் அரசு முதலீடுகள் அதிகரித்துள்ளதே இதற்கு காரணம் என்று கூறப்படுகிறது. தெற்காசியாவிலேயே மிக வேகமாக வளரும் பொருளாதாரமாக இந்தியா திகழும் என்றும் அந்த அறிக்கையில் கூறப்பட்டுள்ளது.",
    trending: false,
  },
];

export const MOCK_SOCIAL_POSTS = [
  {
    id: "s1",
    platform: "twitter",
    author: "Vannatamil News",
    handle: "@vannatamil",
    content: "தமிழகத்தில் புதிய தொழில் கொள்கை வெளியீடு! 20 லட்சம் பேருக்கு வேலைவாய்ப்பு இலக்கு. #CMStalin #TamilNadu #News",
    date: "10m ago",
    likes: "1.2K",
    retweets: "450"
  },
  {
    id: "s2",
    platform: "instagram",
    author: "Vannatamil News",
    handle: "vannatamil_news",
    image: "https://picsum.photos/seed/insta1/400/400",
    content: "CSK vs MI: ஆட்டநாயகன் பதிரானா! 🦁🔥 #WhistlePodu #IPL2024",
    date: "1h ago",
    likes: "5.4K",
    comments: "230"
  },
  {
    id: "s3",
    platform: "twitter",
    author: "Vannatamil News",
    handle: "@vannatamil",
    content: "iPhone 16 is here! What do you think about the new AI features? 📱✨ #AppleEvent #iPhone16",
    date: "3h ago",
    likes: "890",
    retweets: "120"
  }
];

export const CATEGORIES = [
  { name: "Tamil Nadu", nameTa: "தமிழ்நாடு", slug: "tamil-nadu", color: "primary" },
  { name: "Business", nameTa: "வணிகம்", slug: "business", color: "accent-business" },
  { name: "Technology", nameTa: "தொழில்நுட்பம்", slug: "technology", color: "accent-tech" },
  { name: "Sports", nameTa: "விளையாட்டு", slug: "sports", color: "accent-sports" },
  { name: "Entertainment", nameTa: "திரைப்படைப்பு", slug: "entertainment", color: "accent-entertainment" },
];

export const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'technology': return 'text-accent-tech border-accent-tech';
    case 'business': return 'text-accent-business border-accent-business';
    case 'sports': return 'text-accent-sports border-accent-sports';
    case 'entertainment': return 'text-accent-entertainment border-accent-entertainment';
    default: return 'text-primary border-primary';
  }
};

export const getCategoryBg = (category: string) => {
  switch (category.toLowerCase()) {
    case 'technology': return 'bg-accent-tech';
    case 'business': return 'bg-accent-business';
    case 'sports': return 'bg-accent-sports';
    case 'entertainment': return 'bg-accent-entertainment';
    default: return 'bg-primary';
  }
};
