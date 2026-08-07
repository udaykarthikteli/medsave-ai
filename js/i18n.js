/* ===================== i18n — language switching ===================== */
/* Covers the static/dynamic text on dashboard.html plus the emergency
   panel's strings. Applies translations by:
   1. Setting textContent on any element with [data-i18n="key"]
   2. Setting the placeholder on any element with [data-i18n-placeholder="key"]
   3. Dispatching 'ms:langchange' so pages can rebuild JS-generated content
      (card grids, the emergency panel, etc.) in the new language.

   Translation note: Hindi and Telugu strings here are a best-effort
   machine translation for a student project, not professionally reviewed.
   Swap in native-speaker-checked copy before using this in production,
   especially for the first-aid / emergency content. */

const MS_I18N = {
  en: {
    lang_name: 'English',
    nav_breather: '🎮 Take a Breather',
    nav_live: 'Live Reading',
    nav_greeting: 'Hi, Guest 👋',
    nav_logout: 'Log out',

    hero_welcome_prefix: 'Welcome to',
    hero_tagline: 'MedSave AI is an AI-powered chatbot built to spread public health awareness — offering disease information, preventive measures, and healthy lifestyle guidance whenever you need it.',

    awareness_eyebrow: 'Disease Awareness',
    awareness_heading: 'Know it, spot it, prevent it',
    awareness_sub: 'Eight essentials every household should understand about staying well.',

    aw1_title:'Common Diseases', aw1_text:'Learn the basics of flu, dengue, diabetes, and other widespread conditions.',
    aw2_title:'Symptoms', aw2_text:'Recognize early warning signs so you can act before conditions worsen.',
    aw3_title:'Prevention Methods', aw3_text:'Simple daily habits that significantly cut your risk of common illnesses.',
    aw4_title:'Hygiene Practices', aw4_text:'Handwashing, sanitation, and clean surroundings remain your first defense.',
    aw5_title:'Vaccination Awareness', aw5_text:'Stay current with recommended immunizations for you and your family.',
    aw6_title:'Healthy Diet', aw6_text:'Balanced nutrition strengthens immunity and long-term wellbeing.',
    aw7_title:'Exercise Benefits', aw7_text:'Regular movement improves heart health, mood, and energy levels.',
    aw8_title:'Mental Health Awareness', aw8_text:'Emotional wellbeing is core health — rest, connect, and seek support.',

    tips_eyebrow: 'Daily Reminder',
    tips_heading: 'Health tip of the moment',

    features_eyebrow: 'Why MedSave AI',
    features_heading: 'Built for clarity, care, and speed',
    feat1_title:'AI Disease Awareness', feat1_text:'Instant, digestible explanations of conditions and risk factors.',
    feat2_title:'24/7 AI Chat Assistant', feat2_text:'Ask health questions anytime — no waiting rooms required.',
    feat3_title:'Preventive Healthcare Tips', feat3_text:'Actionable daily habits that reduce your risk of illness.',
    feat4_title:'Public Health Education', feat4_text:'Clear, reliable information grounded in accepted health guidance.',
    feat5_title:'User-Friendly Interface', feat5_text:'A calm, uncluttered experience designed around your needs.',
    feat6_title:'Fast AI Responses', feat6_text:'Get thoughtful answers in seconds, not minutes.',

    livepromo_badge:'New · Physical AI',
    livepromo_heading:'Connect real devices for live vitals awareness',
    livepromo_text:"Pair a Bluetooth heart-rate or blood-pressure monitor, or turn your laptop's microphone into a digital stethoscope — then chat with MedSave AI about what your live readings mean.",
    livepromo_btn:'Open Live Reading',

    gamespromo_badge:'New · Mental Wellness',
    gamespromo_heading:'Feeling tense? Take a two-minute breather',
    gamespromo_text:'Three short, hands-on relaxation exercises — pop, mold, and breathe — built for moments of stress, restlessness, or anxiety between tasks.',
    gamespromo_btn:'🎮 Open Take a Breather',

    footer_desc:'An AI-driven public health chatbot spreading disease awareness, prevention tips, and healthy-living guidance for everyone.',
    footer_project_label:'Project:',
    footer_project_value:'AI-Driven Public Health Chatbot for Disease Awareness',
    footer_created_by:'Created by:',
    footer_role:'B.Tech Student',
    footer_bottom:'© 2026 MedSave AI. All Rights Reserved.',

    chat_placeholder:'Ask about symptoms, prevention, wellness…',
    chat_status_connecting:'Connecting…',
    chat_welcome:"Hi! I'm your MedSave AI assistant 👋 Ask me about symptoms, prevention, vaccination, or healthy living — or tap a quick suggestion below.",
    chip1:'Symptoms', chip2:'Disease Awareness', chip3:'Prevention Tips',
    chip4:'Healthy Lifestyle', chip5:'Vaccination Information', chip6:'Emergency Advice',

    sos_title:'Emergency Quick Access',
    sos_subtitle:'Fast numbers & first aid, right when you need them',
    sos_call_now:'Call now',
    sos_first_aid:'Quick first aid',
    sos_disclaimer:'This is general guidance only, not a substitute for professional medical care. In any emergency, call 108 (Ambulance) or 112 (National Emergency) immediately.',
    sos_num_all:'All-in-one Emergency', sos_num_ambulance:'Ambulance', sos_num_police:'Police',
    sos_num_fire:'Fire', sos_num_women:'Women Helpline', sos_num_child:'Child Helpline',
    sos_num_mental:'Mental Health Helpline (KIRAN)',
    sos_fa_choking_title:'Choking',
    sos_fa_choking_steps:['Encourage them to keep coughing if they can.',"If they can't breathe, cough, or speak: give 5 firm back blows between the shoulder blades.",'If that doesn\u2019t clear it, give 5 abdominal thrusts (Heimlich maneuver).','Call 108 if the object doesn\u2019t come out or they lose consciousness.'],
    sos_fa_bleeding_title:'Severe Bleeding',
    sos_fa_bleeding_steps:['Apply firm, direct pressure on the wound with a clean cloth.','Keep pressing without lifting the cloth to check.','Raise the injured area above heart level if possible.','Call 108 for anything more than a minor cut.'],
    sos_fa_burns_title:'Burns',
    sos_fa_burns_steps:['Cool the burn under cool running water for at least 10 minutes.','Do not apply ice, butter, or toothpaste.','Cover loosely with a clean, non-fluffy cloth.','Seek medical help for large, deep, or blistering burns.'],
    sos_fa_fainting_title:'Fainting',
    sos_fa_fainting_steps:['Lay the person flat and raise their legs slightly.','Loosen tight clothing and make sure they have fresh air.','Check that they\u2019re breathing normally.','Call 108 if they don\u2019t wake within a minute, or fall and are hurt.'],
    sos_fa_chest_title:'Chest Pain / Suspected Heart Attack',
    sos_fa_chest_steps:['Call 108 immediately — every minute matters.','Help them sit or lie down in a comfortable, calm position.','Loosen tight clothing around the neck and chest.','Stay with them and keep them calm until help arrives.'],
    sos_fa_snake_title:'Snake Bite',
    sos_fa_snake_steps:['Keep the person still and calm — movement spreads venom faster.','Keep the bitten limb at or below heart level.','Remove rings, watches, or anything tight near the bite.','Do NOT cut the wound, suck out venom, or apply a tourniquet.','Get to a hospital immediately and call 108 on the way.'],

    nav_login:'Log in', nav_signup:'Sign up', nav_back_dashboard:'← Dashboard',

    home_badge:'AI-Driven Public Health Chatbot',
    home_tagline:'Your AI Companion for Public Health Awareness and Disease Prevention.',
    home_footnote:'AI-Driven Public Health Chatbot for Disease Awareness · B.Tech Final Year Project',

    games_eyebrow:'Mental Wellness',
    games_title_prefix:'Take a', games_title_accent:'breather',
    games_subtitle:'Three short, hands-on exercises for moments of stress, restlessness, or a racing mind. No sign-up, no scoring — just a couple of quiet minutes.',
    games_disclaimer:'These are relaxation tools, not a medical treatment. If stress or anxiety is affecting your daily life, please talk to a doctor or licensed mental health professional.',

    game1_tag1:'Restlessness', game1_tag2:'Fidgety, racing thoughts',
    game1_reset:'Re-inflate', game1_title:'Bubble Pop',
    game1_desc:"A realistic sheet of bubble wrap you can pop one cell at a time, each with its own soft click. Good for the kind of nervous, can't-sit-still energy that builds up during a stressful day.",
    game1_why1:'Gives fidgety hands a small, repetitive task to focus on',
    game1_why2:'Short bursts of tactile feedback are a common, low-effort way to interrupt a stress spiral',
    game1_why3:'No wrong way to play — pop one bubble or all of them',
    game1_meta:'~1–2 minutes · works on desktop & touch',

    game2_hint:'Drag your finger or mouse through the sand', game2_reset:'Smooth the sand',
    game2_tag1:'Sensory overwhelm', game2_tag2:'Grounding', game2_title:'Kinetic Sand',
    game2_desc:'Drag across a patch of soft, shadowed sand and watch it hold the groove — a slower, grounding motion rather than a quick fix. Smooth it flat any time and start again.',
    game2_why1:'Slow, deliberate motion helps pull attention back to the present moment',
    game2_why2:'Grounding exercises like this are widely used alongside breathing techniques for anxious moments',
    game2_why3:'Nothing to win or lose — there\u2019s no "finished" state',
    game2_meta:'~2–3 minutes · best with a mouse or touchscreen',

    game3_ready:'Press start when ready', game3_start:'Start breathing',
    game3_tag1:'Acute stress / panic', game3_tag2:'Racing heart', game3_title:'Guided Breathing',
    game3_desc:'A softly glowing orb expands and contracts on a steady 4–4–6–2 rhythm: breathe in, hold, breathe out, hold. Follow it with your breath for a few full cycles.',
    game3_why1:'Paced breathing is one of the most well-established ways to calm a fast heart rate in the moment',
    game3_why2:"The longer exhale (6s) is deliberate — it's the phase most linked to a calming effect",
    game3_why3:'Works anywhere, needs nothing but your breath',
    game3_meta:'~2–5 minutes · works best with sound off, eyes on the orb',

    live_badge:'Physical AI · Real device bridge', live_title:'Live Reading',
    live_subtitle:'Connect real physiological devices straight from your browser — a Bluetooth heart-rate strap, a Bluetooth blood-pressure cuff, or an electronic stethoscope through your microphone input — and get live, context-aware awareness from MedSave AI.',
    live_disclaimer_strong:'Not a medical device.',
    live_disclaimer_text:"Readings shown here come from consumer/BLE sensors and an experimental microphone-based acoustic estimate. They're for general awareness and learning only — not a diagnosis, not a certified medical measurement. For anything urgent, contact a licensed clinician or your local emergency number.",
    live_connect_eyebrow:'Connect a Device', live_connect_heading:'Bring real hardware into the conversation',
    live_connect_sub:'Uses the standard Web Bluetooth and Web Audio browser APIs — no app install required. Works best in Chrome or Edge on desktop / Android.',

    live_hr_title:'Bluetooth Heart Rate Monitor',
    live_hr_desc:'Any BLE device broadcasting the standard Heart Rate Service (chest straps, smartwatches, rings).',
    live_hr_label:'Heart Rate',

    live_bp_title:'Bluetooth Blood Pressure Cuff',
    live_bp_desc:'Any BLE cuff broadcasting the standard Blood Pressure Service — take a reading on the cuff to sync it here.',
    live_bp_label1:'Systolic / Diastolic', live_bp_label2:'Pulse',

    live_steth_title:'Digital Stethoscope (Microphone Input)',
    live_steth_desc:"Select an electronic/USB stethoscope's audio input (or your laptop mic) and listen live — MedSave AI shows the raw waveform and an experimental acoustic pulse estimate.",
    live_steth_label:'Acoustic Pulse (experimental)', live_steth_default_mic:'Default microphone',
    live_steth_start:'Start Listening',
    live_steth_note:"For a real electronic stethoscope, plug it in via USB/3.5mm first, grant microphone permission, then pick it from the dropdown above. This estimate is derived from low-frequency audio envelope peaks — it's a learning demo, not a clinical-grade reading.",

    live_status_notconnected:'Not connected', live_status_notlistening:'Not listening',
    live_connect_btn:'Connect Device',

    live_chat_eyebrow:'Live Awareness Chat', live_chat_heading:"Ask MedSave AI about what you're seeing",
    live_chat_sub:'Your live readings above are automatically shared with the assistant as context — no need to type numbers in.',
    live_chat_name:'MedSave AI Assistant',
    live_vitals_empty:"No live readings yet — connect a device above, and I'll factor it into the chat.",
    live_chip1:'What does my heart rate mean?', live_chip2:'Is my blood pressure in a healthy range?',
    live_chip3:'How accurate is a mic-based stethoscope?', live_chip4:'Tips to keep my heart healthy',
    live_chat_placeholder:'Ask about your live reading…',
  },

  hi: {
    lang_name: 'हिंदी',
    nav_breather: '🎮 थोड़ा आराम करें',
    nav_live: 'लाइव रीडिंग',
    nav_greeting: 'नमस्ते, अतिथि 👋',
    nav_logout: 'लॉग आउट',

    hero_welcome_prefix: 'आपका स्वागत है',
    hero_tagline: 'MedSave AI एक AI-संचालित चैटबॉट है जो सार्वजनिक स्वास्थ्य जागरूकता फैलाने के लिए बनाया गया है — जब भी आपको ज़रूरत हो, बीमारी की जानकारी, बचाव के उपाय और स्वस्थ जीवनशैली की सलाह देता है।',

    awareness_eyebrow: 'बीमारी जागरूकता',
    awareness_heading: 'जानें, पहचानें, बचें',
    awareness_sub: 'हर परिवार को स्वस्थ रहने के लिए ये आठ ज़रूरी बातें समझनी चाहिए।',

    aw1_title:'सामान्य बीमारियाँ', aw1_text:'फ्लू, डेंगू, मधुमेह और अन्य आम बीमारियों की बुनियादी जानकारी जानें।',
    aw2_title:'लक्षण', aw2_text:'स्थिति बिगड़ने से पहले कार्रवाई करने के लिए शुरुआती चेतावनी संकेतों को पहचानें।',
    aw3_title:'बचाव के तरीके', aw3_text:'रोज़ की सरल आदतें जो आम बीमारियों के खतरे को काफी कम कर देती हैं।',
    aw4_title:'स्वच्छता की आदतें', aw4_text:'हाथ धोना, सफाई और स्वच्छ माहौल आपकी पहली सुरक्षा है।',
    aw5_title:'टीकाकरण जागरूकता', aw5_text:'अपने और अपने परिवार के लिए अनुशंसित टीकाकरण के साथ अपडेट रहें।',
    aw6_title:'संतुलित आहार', aw6_text:'संतुलित पोषण रोग प्रतिरोधक क्षमता और दीर्घकालिक स्वास्थ्य को मज़बूत करता है।',
    aw7_title:'व्यायाम के लाभ', aw7_text:'नियमित शारीरिक गतिविधि दिल की सेहत, मूड और ऊर्जा को बेहतर बनाती है।',
    aw8_title:'मानसिक स्वास्थ्य जागरूकता', aw8_text:'भावनात्मक सेहत भी स्वास्थ्य का अहम हिस्सा है — आराम करें, जुड़ें, और मदद लें।',

    tips_eyebrow: 'दैनिक सुझाव',
    tips_heading: 'इस पल की स्वास्थ्य सलाह',

    features_eyebrow: 'MedSave AI क्यों',
    features_heading: 'स्पष्टता, देखभाल और तेज़ी के लिए बनाया गया',
    feat1_title:'AI बीमारी जागरूकता', feat1_text:'बीमारियों और जोखिम कारकों की तुरंत, आसान भाषा में जानकारी।',
    feat2_title:'24/7 AI चैट सहायक', feat2_text:'कभी भी स्वास्थ्य सवाल पूछें — प्रतीक्षा कक्ष की ज़रूरत नहीं।',
    feat3_title:'निवारक स्वास्थ्य सुझाव', feat3_text:'रोज़ की व्यावहारिक आदतें जो बीमारी का खतरा घटाती हैं।',
    feat4_title:'सार्वजनिक स्वास्थ्य शिक्षा', feat4_text:'स्वीकृत स्वास्थ्य दिशानिर्देशों पर आधारित स्पष्ट, भरोसेमंद जानकारी।',
    feat5_title:'सरल उपयोगकर्ता इंटरफ़ेस', feat5_text:'आपकी ज़रूरतों के हिसाब से बना एक शांत, सुव्यवस्थित अनुभव।',
    feat6_title:'तेज़ AI जवाब', feat6_text:'मिनटों में नहीं, सेकंडों में सोचे-समझे जवाब पाएं।',

    livepromo_badge:'नया · फिज़िकल AI',
    livepromo_heading:'लाइव वाइटल्स जागरूकता के लिए असली डिवाइस जोड़ें',
    livepromo_text:'ब्लूटूथ हार्ट-रेट या ब्लड-प्रेशर मॉनिटर जोड़ें, या अपने लैपटॉप के माइक्रोफ़ोन को डिजिटल स्टेथोस्कोप बनाएं — फिर MedSave AI से अपनी लाइव रीडिंग के बारे में बात करें।',
    livepromo_btn:'लाइव रीडिंग खोलें',

    gamespromo_badge:'नया · मानसिक स्वास्थ्य',
    gamespromo_heading:'तनाव महसूस हो रहा है? दो मिनट का ब्रेक लें',
    gamespromo_text:'तीन छोटी, हाथों से की जाने वाली रिलैक्सेशन एक्सरसाइज़ — पॉप, गढ़ें, और सांस लें — तनाव या बेचैनी के पलों के लिए बनाई गई।',
    gamespromo_btn:'🎮 थोड़ा आराम करें खोलें',

    footer_desc:'एक AI-संचालित सार्वजनिक स्वास्थ्य चैटबॉट, जो सभी के लिए बीमारी जागरूकता, बचाव सुझाव और स्वस्थ जीवनशैली की जानकारी फैलाता है।',
    footer_project_label:'प्रोजेक्ट:',
    footer_project_value:'बीमारी जागरूकता के लिए AI-संचालित सार्वजनिक स्वास्थ्य चैटबॉट',
    footer_created_by:'निर्माता:',
    footer_role:'B.Tech छात्र',
    footer_bottom:'© 2026 MedSave AI. सर्वाधिकार सुरक्षित।',

    chat_placeholder:'लक्षण, बचाव, सेहत के बारे में पूछें…',
    chat_status_connecting:'कनेक्ट हो रहा है…',
    chat_welcome:'नमस्ते! मैं आपका MedSave AI सहायक हूँ 👋 मुझसे लक्षण, बचाव, टीकाकरण या स्वस्थ जीवनशैली के बारे में पूछें — या नीचे दिए सुझाव पर टैप करें।',
    chip1:'लक्षण', chip2:'बीमारी जागरूकता', chip3:'बचाव सुझाव',
    chip4:'स्वस्थ जीवनशैली', chip5:'टीकाकरण जानकारी', chip6:'आपातकालीन सलाह',

    sos_title:'आपातकालीन त्वरित सहायता',
    sos_subtitle:'ज़रूरत के समय तुरंत नंबर और प्राथमिक उपचार',
    sos_call_now:'अभी कॉल करें',
    sos_first_aid:'त्वरित प्राथमिक उपचार',
    sos_disclaimer:'यह केवल सामान्य जानकारी है, पेशेवर चिकित्सा सलाह का विकल्प नहीं। किसी भी आपातकाल में तुरंत 108 (एम्बुलेंस) या 112 (राष्ट्रीय आपातकालीन नंबर) पर कॉल करें।',
    sos_num_all:'सभी आपातकालीन सेवाएं', sos_num_ambulance:'एम्बुलेंस', sos_num_police:'पुलिस',
    sos_num_fire:'अग्निशमन', sos_num_women:'महिला हेल्पलाइन', sos_num_child:'चाइल्ड हेल्पलाइन',
    sos_num_mental:'मानसिक स्वास्थ्य हेल्पलाइन (किरण)',
    sos_fa_choking_title:'दम घुटना',
    sos_fa_choking_steps:['अगर वे खांस सकते हैं तो उन्हें खांसते रहने के लिए प्रोत्साहित करें।','अगर वे सांस, खांसी या बोल नहीं पा रहे: कंधों के बीच पीठ पर 5 ज़ोरदार थपकी दें।','अगर इससे साफ न हो, तो 5 बार पेट पर दबाव (हाइमलिख मैन्युवर) दें।','अगर वस्तु न निकले या वे बेहोश हो जाएं तो 108 पर कॉल करें।'],
    sos_fa_bleeding_title:'गंभीर रक्तस्राव',
    sos_fa_bleeding_steps:['घाव पर साफ कपड़े से मज़बूती से सीधा दबाव डालें।','कपड़ा हटाकर जांचने के बिना दबाव बनाए रखें।','यदि संभव हो तो घायल हिस्से को दिल के स्तर से ऊपर उठाएं।','छोटी खरोंच से ज़्यादा किसी भी हालत में 108 पर कॉल करें।'],
    sos_fa_burns_title:'जलना',
    sos_fa_burns_steps:['जले हुए हिस्से को कम से कम 10 मिनट तक ठंडे बहते पानी के नीचे रखें।','बर्फ, मक्खन या टूथपेस्ट न लगाएं।','साफ, बिना रोएंदार कपड़े से हल्के से ढकें।','बड़े, गहरे या छाले वाले जलने पर तुरंत चिकित्सा सहायता लें।'],
    sos_fa_fainting_title:'बेहोशी',
    sos_fa_fainting_steps:['व्यक्ति को सीधा लिटाएं और पैर थोड़े ऊपर उठाएं।','तंग कपड़े ढीले करें और ताज़ी हवा सुनिश्चित करें।','जांचें कि वे सामान्य रूप से सांस ले रहे हैं।','अगर एक मिनट में होश न आए, या गिरने से चोट लगे तो 108 पर कॉल करें।'],
    sos_fa_chest_title:'सीने में दर्द / संभावित हार्ट अटैक',
    sos_fa_chest_steps:['तुरंत 108 पर कॉल करें — हर मिनट कीमती है।','उन्हें आरामदायक स्थिति में बैठाएं या लिटाएं।','गले और सीने के आसपास के तंग कपड़े ढीले करें।','मदद आने तक उनके साथ रहें और उन्हें शांत रखें।'],
    sos_fa_snake_title:'सांप का काटना',
    sos_fa_snake_steps:['व्यक्ति को शांत और स्थिर रखें — हिलने-डुलने से ज़हर तेज़ी से फैलता है।','काटे गए अंग को दिल के स्तर पर या उससे नीचे रखें।','काटने वाली जगह के पास की अंगूठियां, घड़ी आदि हटा दें।','घाव को काटें नहीं, ज़हर चूसें नहीं, और टूर्निकेट न बांधें।','तुरंत अस्पताल जाएं और रास्ते में 108 पर कॉल करें।'],

    nav_login:'लॉग इन', nav_signup:'साइन अप', nav_back_dashboard:'← डैशबोर्ड',

    home_badge:'AI-संचालित सार्वजनिक स्वास्थ्य चैटबॉट',
    home_tagline:'सार्वजनिक स्वास्थ्य जागरूकता और बीमारी की रोकथाम के लिए आपका AI साथी।',
    home_footnote:'बीमारी जागरूकता के लिए AI-संचालित सार्वजनिक स्वास्थ्य चैटबॉट · B.Tech अंतिम वर्ष प्रोजेक्ट',

    games_eyebrow:'मानसिक स्वास्थ्य',
    games_title_prefix:'थोड़ा', games_title_accent:'आराम करें',
    games_subtitle:'तनाव, बेचैनी या दौड़ते दिमाग के पलों के लिए तीन छोटी, हाथों से की जाने वाली एक्सरसाइज़। कोई साइन-अप नहीं, कोई स्कोरिंग नहीं — बस कुछ शांत मिनट।',
    games_disclaimer:'ये रिलैक्सेशन टूल हैं, चिकित्सा उपचार नहीं। अगर तनाव या चिंता आपके रोज़मर्रा के जीवन को प्रभावित कर रही है, तो कृपया किसी डॉक्टर या लाइसेंस प्राप्त मानसिक स्वास्थ्य विशेषज्ञ से बात करें।',

    game1_tag1:'बेचैनी', game1_tag2:'बेचैन, दौड़ते विचार',
    game1_reset:'फिर से फुलाएं', game1_title:'बबल पॉप',
    game1_desc:'बबल रैप की एक असली शीट, जिसे आप एक-एक कर के दबा सकते हैं, हर एक की अपनी हल्की क्लिक ध्वनि के साथ। तनाव भरे दिन में बनने वाली बेचैन, स्थिर न रह पाने वाली ऊर्जा के लिए अच्छा।',
    game1_why1:'बेचैन हाथों को ध्यान लगाने के लिए एक छोटा, दोहराया जाने वाला काम देता है',
    game1_why2:'स्पर्श की छोटी झलकें तनाव के सिलसिले को तोड़ने का एक आम, आसान तरीका हैं',
    game1_why3:'खेलने का कोई गलत तरीका नहीं — एक बबल दबाएं या सारे',
    game1_meta:'~1–2 मिनट · डेस्कटॉप और टच दोनों पर काम करता है',

    game2_hint:'रेत में अपनी उंगली या माउस घुमाएं', game2_reset:'रेत को समतल करें',
    game2_tag1:'संवेदी अधिभार', game2_tag2:'ग्राउंडिंग', game2_title:'काइनेटिक सैंड',
    game2_desc:'मुलायम, छायादार रेत पर उंगली घुमाएं और देखें कि निशान कैसे बना रहता है — यह त्वरित समाधान नहीं, बल्कि धीमी, ग्राउंडिंग गति है। कभी भी इसे समतल कर के फिर से शुरू करें।',
    game2_why1:'धीमी, सोची-समझी गति ध्यान को वर्तमान क्षण पर वापस लाने में मदद करती है',
    game2_why2:'इस तरह की ग्राउंडिंग एक्सरसाइज़ चिंता भरे पलों में सांस लेने की तकनीकों के साथ आम तौर पर इस्तेमाल की जाती हैं',
    game2_why3:'जीतने या हारने को कुछ नहीं — यहां कोई "पूरा हुआ" जैसी स्थिति नहीं है',
    game2_meta:'~2–3 मिनट · माउस या टचस्क्रीन के साथ सबसे बेहतर',

    game3_ready:'तैयार होने पर शुरू करें दबाएं', game3_start:'सांस लेना शुरू करें',
    game3_tag1:'तीव्र तनाव / घबराहट', game3_tag2:'तेज़ दिल की धड़कन', game3_title:'निर्देशित श्वास',
    game3_desc:'एक हल्की चमकती हुई गेंद 4–4–6–2 की स्थिर लय में फैलती और सिकुड़ती है: सांस लें, रोकें, छोड़ें, रोकें। कुछ पूरे चक्रों तक इसके साथ अपनी सांस मिलाएं।',
    game3_why1:'लयबद्ध सांस लेना तेज़ दिल की धड़कन को उसी समय शांत करने के सबसे भरोसेमंद तरीकों में से एक है',
    game3_why2:'लंबी सांस छोड़ना (6 सेकंड) जानबूझकर है — यह वह चरण है जो शांति के प्रभाव से सबसे ज़्यादा जुड़ा है',
    game3_why3:'कहीं भी काम करता है, आपकी सांस के अलावा कुछ नहीं चाहिए',
    game3_meta:'~2–5 मिनट · आवाज़ बंद रखकर, नज़र गेंद पर रखते हुए सबसे बेहतर',

    live_badge:'फिज़िकल AI · असली डिवाइस ब्रिज', live_title:'लाइव रीडिंग',
    live_subtitle:'अपने ब्राउज़र से सीधे असली शारीरिक डिवाइस जोड़ें — ब्लूटूथ हार्ट-रेट स्ट्रैप, ब्लूटूथ ब्लड-प्रेशर कफ, या अपने माइक्रोफ़ोन इनपुट के ज़रिए एक इलेक्ट्रॉनिक स्टेथोस्कोप — और MedSave AI से लाइव, संदर्भ-आधारित जानकारी पाएं।',
    live_disclaimer_strong:'यह एक चिकित्सा उपकरण नहीं है।',
    live_disclaimer_text:'यहां दिखाई गई रीडिंग कंज़्यूमर/BLE सेंसर और एक प्रायोगिक माइक्रोफ़ोन-आधारित ध्वनिक अनुमान से आती हैं। ये केवल सामान्य जागरूकता और सीखने के लिए हैं — निदान नहीं, प्रमाणित चिकित्सा माप नहीं। किसी भी आपात स्थिति के लिए, किसी लाइसेंस प्राप्त चिकित्सक या अपने स्थानीय आपातकालीन नंबर से संपर्क करें।',
    live_connect_eyebrow:'एक डिवाइस जोड़ें', live_connect_heading:'बातचीत में असली हार्डवेयर लाएं',
    live_connect_sub:'मानक Web Bluetooth और Web Audio ब्राउज़र API का उपयोग करता है — किसी ऐप इंस्टॉल की ज़रूरत नहीं। डेस्कटॉप/Android पर Chrome या Edge में सबसे बेहतर काम करता है।',

    live_hr_title:'ब्लूटूथ हार्ट रेट मॉनिटर',
    live_hr_desc:'मानक हार्ट रेट सर्विस प्रसारित करने वाला कोई भी BLE डिवाइस (चेस्ट स्ट्रैप, स्मार्टवॉच, रिंग)।',
    live_hr_label:'हार्ट रेट',

    live_bp_title:'ब्लूटूथ ब्लड प्रेशर कफ',
    live_bp_desc:'मानक ब्लड प्रेशर सर्विस प्रसारित करने वाला कोई भी BLE कफ — यहां सिंक करने के लिए कफ पर रीडिंग लें।',
    live_bp_label1:'सिस्टोलिक / डायस्टोलिक', live_bp_label2:'पल्स',

    live_steth_title:'डिजिटल स्टेथोस्कोप (माइक्रोफ़ोन इनपुट)',
    live_steth_desc:'किसी इलेक्ट्रॉनिक/USB स्टेथोस्कोप का ऑडियो इनपुट (या अपना लैपटॉप माइक) चुनें और लाइव सुनें — MedSave AI असली वेवफ़ॉर्म और एक प्रायोगिक ध्वनिक पल्स अनुमान दिखाता है।',
    live_steth_label:'ध्वनिक पल्स (प्रायोगिक)', live_steth_default_mic:'डिफ़ॉल्ट माइक्रोफ़ोन',
    live_steth_start:'सुनना शुरू करें',
    live_steth_note:'असली इलेक्ट्रॉनिक स्टेथोस्कोप के लिए, पहले उसे USB/3.5mm से जोड़ें, माइक्रोफ़ोन अनुमति दें, फिर ऊपर दिए ड्रॉपडाउन से उसे चुनें। यह अनुमान कम-आवृत्ति ऑडियो एनवलप पीक्स से निकाला जाता है — यह एक सीखने का डेमो है, क्लिनिकल-ग्रेड रीडिंग नहीं।',

    live_status_notconnected:'कनेक्ट नहीं है', live_status_notlistening:'सुन नहीं रहा',
    live_connect_btn:'डिवाइस कनेक्ट करें',

    live_chat_eyebrow:'लाइव जागरूकता चैट', live_chat_heading:'MedSave AI से पूछें कि आप क्या देख रहे हैं',
    live_chat_sub:'ऊपर दी गई आपकी लाइव रीडिंग स्वतः ही सहायक के साथ संदर्भ के रूप में साझा हो जाती हैं — नंबर टाइप करने की ज़रूरत नहीं।',
    live_chat_name:'MedSave AI सहायक',
    live_vitals_empty:'अभी तक कोई लाइव रीडिंग नहीं — ऊपर एक डिवाइस जोड़ें, और मैं इसे चैट में शामिल करूंगा।',
    live_chip1:'मेरी हार्ट रेट का क्या मतलब है?', live_chip2:'क्या मेरा ब्लड प्रेशर स्वस्थ सीमा में है?',
    live_chip3:'माइक-आधारित स्टेथोस्कोप कितना सटीक है?', live_chip4:'दिल को स्वस्थ रखने के सुझाव',
    live_chat_placeholder:'अपनी लाइव रीडिंग के बारे में पूछें…',
  },

  te: {
    lang_name: 'తెలుగు',
    nav_breather: '🎮 కాస్త విశ్రాంతి తీసుకోండి',
    nav_live: 'లైవ్ రీడింగ్',
    nav_greeting: 'నమస్తే, అతిథి 👋',
    nav_logout: 'లాగ్ అవుట్',

    hero_welcome_prefix: 'స్వాగతం',
    hero_tagline: 'MedSave AI అనేది ప్రజారోగ్య అవగాహన కోసం రూపొందించిన AI చాట్‌బాట్ — మీకు అవసరమైనప్పుడు వ్యాధుల సమాచారం, నివారణ చర్యలు, ఆరోగ్యకరమైన జీవనశైలి సలహాలు అందిస్తుంది.',

    awareness_eyebrow: 'వ్యాధి అవగాహన',
    awareness_heading: 'తెలుసుకోండి, గుర్తించండి, నివారించండి',
    awareness_sub: 'ఆరోగ్యంగా ఉండటానికి ప్రతి కుటుంబం తెలుసుకోవాల్సిన ఎనిమిది ముఖ్యాంశాలు.',

    aw1_title:'సాధారణ వ్యాధులు', aw1_text:'ఫ్లూ, డెంగ్యూ, డయాబెటిస్ వంటి సాధారణ వ్యాధుల గురించి ప్రాథమిక సమాచారం తెలుసుకోండి.',
    aw2_title:'లక్షణాలు', aw2_text:'పరిస్థితి తీవ్రం కాకముందే చర్య తీసుకోవడానికి ప్రారంభ హెచ్చరిక సంకేతాలను గుర్తించండి.',
    aw3_title:'నివారణ పద్ధతులు', aw3_text:'సాధారణ వ్యాధుల ప్రమాదాన్ని గణనీయంగా తగ్గించే రోజువారీ సాధారణ అలవాట్లు.',
    aw4_title:'పరిశుభ్రత అలవాట్లు', aw4_text:'చేతులు కడుక్కోవడం, పరిశుభ్రత మరియు శుభ్రమైన పరిసరాలు మీ మొదటి రక్షణ.',
    aw5_title:'టీకా అవగాహన', aw5_text:'మీ మరియు మీ కుటుంబం కోసం సిఫార్సు చేసిన టీకాలతో అప్‌డేట్‌గా ఉండండి.',
    aw6_title:'ఆరోగ్యకరమైన ఆహారం', aw6_text:'సమతుల్య పోషణ రోగనిరోధక శక్తిని మరియు దీర్ఘకాలిక ఆరోగ్యాన్ని బలపరుస్తుంది.',
    aw7_title:'వ్యాయామం వల్ల లాభాలు', aw7_text:'క్రమమైన కదలిక గుండె ఆరోగ్యం, మానసిక స్థితి, శక్తి స్థాయిలను మెరుగుపరుస్తుంది.',
    aw8_title:'మానసిక ఆరోగ్య అవగాహన', aw8_text:'మానసిక శ్రేయస్సు కూడా ఆరోగ్యంలో ముఖ్యమైన భాగం — విశ్రాంతి తీసుకోండి, కనెక్ట్ అవ్వండి, సహాయం తీసుకోండి.',

    tips_eyebrow: 'రోజువారీ సూచన',
    tips_heading: 'ఈ క్షణపు ఆరోగ్య సూచన',

    features_eyebrow: 'MedSave AI ఎందుకు',
    features_heading: 'స్పష్టత, శ్రద్ధ, వేగం కోసం రూపొందించబడింది',
    feat1_title:'AI వ్యాధి అవగాహన', feat1_text:'వ్యాధులు మరియు ప్రమాద కారకాల గురించి తక్షణ, సులభమైన వివరణలు.',
    feat2_title:'24/7 AI చాట్ సహాయకుడు', feat2_text:'ఎప్పుడైనా ఆరోగ్య ప్రశ్నలు అడగండి — వెయిటింగ్ రూమ్ అవసరం లేదు.',
    feat3_title:'నివారణ ఆరోగ్య సూచనలు', feat3_text:'వ్యాధి ప్రమాదాన్ని తగ్గించే ఆచరణాత్మక రోజువారీ అలవాట్లు.',
    feat4_title:'ప్రజారోగ్య విద్య', feat4_text:'ఆమోదించిన ఆరోగ్య మార్గదర్శకాల ఆధారంగా స్పష్టమైన, నమ్మదగిన సమాచారం.',
    feat5_title:'యూజర్-ఫ్రెండ్లీ ఇంటర్‌ఫేస్', feat5_text:'మీ అవసరాల చుట్టూ రూపొందించిన ప్రశాంతమైన, సులభమైన అనుభవం.',
    feat6_title:'వేగవంతమైన AI స్పందనలు', feat6_text:'నిమిషాల్లో కాదు, సెకన్లలో ఆలోచనాత్మక సమాధానాలు పొందండి.',

    livepromo_badge:'కొత్తది · ఫిజికల్ AI',
    livepromo_heading:'లైవ్ వైటల్స్ అవగాహన కోసం నిజమైన పరికరాలను కనెక్ట్ చేయండి',
    livepromo_text:'బ్లూటూత్ హార్ట్-రేట్ లేదా బ్లడ్-ప్రెజర్ మానిటర్‌ను జత చేయండి, లేదా మీ ల్యాప్‌టాప్ మైక్రోఫోన్‌ను డిజిటల్ స్టెతస్కోప్‌గా మార్చండి — తర్వాత మీ లైవ్ రీడింగ్‌ల అర్థం గురించి MedSave AIతో మాట్లాడండి.',
    livepromo_btn:'లైవ్ రీడింగ్ తెరవండి',

    gamespromo_badge:'కొత్తది · మానసిక ఆరోగ్యం',
    gamespromo_heading:'ఒత్తిడిగా అనిపిస్తుందా? రెండు నిమిషాలు విశ్రాంతి తీసుకోండి',
    gamespromo_text:'ఒత్తిడి, చంచలత లేదా ఆందోళన క్షణాల కోసం రూపొందించిన మూడు చిన్న, ప్రత్యక్ష రిలాక్సేషన్ వ్యాయామాలు — పాప్, మౌల్డ్, మరియు శ్వాస.',
    gamespromo_btn:'🎮 విశ్రాంతి తీసుకోండి తెరవండి',

    footer_desc:'అందరికీ వ్యాధి అవగాహన, నివారణ సూచనలు మరియు ఆరోగ్యకరమైన జీవనశైలి మార్గదర్శకత్వాన్ని అందించే AI-ఆధారిత ప్రజారోగ్య చాట్‌బాట్.',
    footer_project_label:'ప్రాజెక్ట్:',
    footer_project_value:'వ్యాధి అవగాహన కోసం AI-ఆధారిత ప్రజారోగ్య చాట్‌బాట్',
    footer_created_by:'రూపొందించినవారు:',
    footer_role:'B.Tech విద్యార్థి',
    footer_bottom:'© 2026 MedSave AI. అన్ని హక్కులు రక్షించబడ్డాయి.',

    chat_placeholder:'లక్షణాలు, నివారణ, ఆరోగ్యం గురించి అడగండి…',
    chat_status_connecting:'కనెక్ట్ అవుతోంది…',
    chat_welcome:'నమస్తే! నేను మీ MedSave AI సహాయకుడిని 👋 లక్షణాలు, నివారణ, టీకాలు లేదా ఆరోగ్యకరమైన జీవనశైలి గురించి నన్ను అడగండి — లేదా కింద ఉన్న సూచనను నొక్కండి.',
    chip1:'లక్షణాలు', chip2:'వ్యాధి అవగాహన', chip3:'నివారణ సూచనలు',
    chip4:'ఆరోగ్యకరమైన జీవనశైలి', chip5:'టీకా సమాచారం', chip6:'అత్యవసర సలహా',

    sos_title:'అత్యవసర త్వరిత సహాయం',
    sos_subtitle:'అవసరమైనప్పుడు తక్షణ నంబర్లు & ప్రథమ చికిత్స',
    sos_call_now:'ఇప్పుడే కాల్ చేయండి',
    sos_first_aid:'త్వరిత ప్రథమ చికిత్స',
    sos_disclaimer:'ఇది సాధారణ మార్గదర్శకత్వం మాత్రమే, వృత్తిపరమైన వైద్య సంరక్షణకు ప్రత్యామ్నాయం కాదు. ఏదైనా అత్యవసర పరిస్థితిలో వెంటనే 108 (అంబులెన్స్) లేదా 112 (జాతీయ అత్యవసర సేవ)కు కాల్ చేయండి.',
    sos_num_all:'అన్ని అత్యవసర సేవలు', sos_num_ambulance:'అంబులెన్స్', sos_num_police:'పోలీస్',
    sos_num_fire:'అగ్నిమాపక దళం', sos_num_women:'మహిళా హెల్ప్‌లైన్', sos_num_child:'చైల్డ్ హెల్ప్‌లైన్',
    sos_num_mental:'మానసిక ఆరోగ్య హెల్ప్‌లైన్ (కిరణ్)',
    sos_fa_choking_title:'ఊపిరి ఆగిపోవడం',
    sos_fa_choking_steps:['వారు దగ్గగలిగితే దగ్గుతూ ఉండమని ప్రోత్సహించండి.','వారు శ్వాస తీసుకోలేకపోతే, దగ్గలేకపోతే, మాట్లాడలేకపోతే: భుజాల మధ్య వీపుపై 5 గట్టి దెబ్బలు కొట్టండి.','అది తొలగకపోతే, 5 సార్లు పొట్టపై నొక్కండి (హైమ్లిక్ మెన్యూవర్).','వస్తువు రాకపోతే లేదా వారు స్పృహ కోల్పోతే 108కు కాల్ చేయండి.'],
    sos_fa_bleeding_title:'తీవ్ర రక్తస్రావం',
    sos_fa_bleeding_steps:['గాయంపై శుభ్రమైన గుడ్డతో గట్టిగా, నేరుగా ఒత్తిడి పెట్టండి.','గుడ్డను తీసి చూడకుండా ఒత్తిడి కొనసాగించండి.','వీలైతే గాయమైన భాగాన్ని గుండె స్థాయి కంటే పైకి లేపండి.','చిన్న గాటు కంటే ఎక్కువైతే 108కు కాల్ చేయండి.'],
    sos_fa_burns_title:'కాలిన గాయాలు',
    sos_fa_burns_steps:['కాలిన భాగాన్ని కనీసం 10 నిమిషాలు చల్లని నీటి కింద ఉంచండి.','మంచు, వెన్న లేదా టూత్‌పేస్ట్ వేయవద్దు.','శుభ్రమైన, మెత్తని గుడ్డతో వదులుగా కప్పండి.','పెద్ద, లోతైన లేదా బొబ్బలు వచ్చిన కాలిన గాయాలకు వెంటనే వైద్య సహాయం తీసుకోండి.'],
    sos_fa_fainting_title:'మూర్ఛ',
    sos_fa_fainting_steps:['వ్యక్తిని నేరుగా పడుకోబెట్టి కాళ్లను కొంచెం పైకి లేపండి.','బిగుతైన బట్టలను వదులు చేసి, తాజా గాలి అందేలా చూడండి.','వారు సాధారణంగా శ్వాస తీసుకుంటున్నారో లేదో చూడండి.','ఒక నిమిషంలో స్పృహ రాకపోతే లేదా పడిపోయి గాయమైతే 108కు కాల్ చేయండి.'],
    sos_fa_chest_title:'ఛాతీ నొప్పి / గుండెపోటు అనుమానం',
    sos_fa_chest_steps:['వెంటనే 108కు కాల్ చేయండి — ప్రతి నిమిషం ముఖ్యమే.','వారిని సౌకర్యవంతంగా కూర్చోబెట్టండి లేదా పడుకోబెట్టండి.','మెడ, ఛాతీ చుట్టూ బిగుతైన బట్టలను వదులు చేయండి.','సహాయం వచ్చే వరకు వారితో ఉండి, వారిని ప్రశాంతంగా ఉంచండి.'],
    sos_fa_snake_title:'పాము కాటు',
    sos_fa_snake_steps:['వ్యక్తిని కదలకుండా, ప్రశాంతంగా ఉంచండి — కదలిక వల్ల విషం వేగంగా వ్యాపిస్తుంది.','కాటు వేసిన అవయవాన్ని గుండె స్థాయిలో లేదా కింద ఉంచండి.','కాటు దగ్గర ఉన్న ఉంగరాలు, వాచీలు తీసివేయండి.','గాయాన్ని కోయవద్దు, విషాన్ని పీల్చవద్దు, టోర్నికెట్ కట్టవద్దు.','వెంటనే ఆసుపత్రికి వెళ్లి దారిలో 108కు కాల్ చేయండి.'],

    nav_login:'లాగిన్', nav_signup:'సైన్ అప్', nav_back_dashboard:'← డాష్‌బోర్డ్',

    home_badge:'AI-ఆధారిత ప్రజారోగ్య చాట్‌బాట్',
    home_tagline:'ప్రజారోగ్య అవగాహన మరియు వ్యాధి నివారణ కోసం మీ AI సహచరుడు.',
    home_footnote:'వ్యాధి అవగాహన కోసం AI-ఆధారిత ప్రజారోగ్య చాట్‌బాట్ · B.Tech చివరి సంవత్సరం ప్రాజెక్ట్',

    games_eyebrow:'మానసిక ఆరోగ్యం',
    games_title_prefix:'కాస్త', games_title_accent:'విశ్రాంతి తీసుకోండి',
    games_subtitle:'ఒత్తిడి, చంచలత లేదా వేగంగా పరుగెత్తే ఆలోచనల క్షణాల కోసం మూడు చిన్న, ప్రత్యక్ష వ్యాయామాలు. సైన్-అప్ లేదు, స్కోరింగ్ లేదు — కేవలం కొన్ని ప్రశాంత నిమిషాలు.',
    games_disclaimer:'ఇవి రిలాక్సేషన్ సాధనాలు, వైద్య చికిత్స కాదు. ఒత్తిడి లేదా ఆందోళన మీ దైనందిన జీవితాన్ని ప్రభావితం చేస్తుంటే, దయచేసి డాక్టర్ లేదా లైసెన్స్ పొందిన మానసిక ఆరోగ్య నిపుణుడిని సంప్రదించండి.',

    game1_tag1:'చంచలత', game1_tag2:'చంచలమైన, పరుగెత్తే ఆలోచనలు',
    game1_reset:'మళ్లీ ఊదండి', game1_title:'బబుల్ పాప్',
    game1_desc:'ఒక్కో సెల్‌ను ఒక్కొక్కటిగా పాప్ చేయగల నిజమైన బబుల్ ర్యాప్ షీట్, ప్రతిదానికి దాని స్వంత మృదువైన క్లిక్ శబ్దం ఉంటుంది. ఒత్తిడితో కూడిన రోజులో పేరుకుపోయే చంచలమైన, స్థిరంగా కూర్చోలేని శక్తికి మంచిది.',
    game1_why1:'చంచలమైన చేతులకు దృష్టి పెట్టడానికి ఒక చిన్న, పునరావృత పనిని ఇస్తుంది',
    game1_why2:'తాకిడి అనుభూతి యొక్క చిన్న క్షణాలు ఒత్తిడి చక్రాన్ని అడ్డుకోవడానికి ఒక సాధారణ, తక్కువ శ్రమతో కూడిన మార్గం',
    game1_why3:'ఆడటానికి తప్పు మార్గం లేదు — ఒక బబుల్‌ను గానీ అన్నింటినీ గానీ పాప్ చేయండి',
    game1_meta:'~1–2 నిమిషాలు · డెస్క్‌టాప్ మరియు టచ్ రెండింటిలో పనిచేస్తుంది',

    game2_hint:'మీ వేలు లేదా మౌస్‌ను ఇసుకలో లాగండి', game2_reset:'ఇసుకను నున్నగా చేయండి',
    game2_tag1:'ఇంద్రియ అధిభారం', game2_tag2:'గ్రౌండింగ్', game2_title:'కైనెటిక్ శాండ్',
    game2_desc:'మృదువైన, నీడ కమ్మిన ఇసుక పలకపై లాగి, అది గీతను ఎలా పట్టుకుంటుందో చూడండి — ఇది త్వరిత పరిష్కారం కాదు, నెమ్మదైన, గ్రౌండింగ్ చేసే కదలిక. ఎప్పుడైనా దాన్ని సమతలంగా చేసి మళ్లీ మొదలుపెట్టండి.',
    game2_why1:'నెమ్మదైన, ఉద్దేశపూర్వక కదలిక దృష్టిని వర్తమాన క్షణానికి తిరిగి తీసుకురావడానికి సహాయపడుతుంది',
    game2_why2:'ఇలాంటి గ్రౌండింగ్ వ్యాయామాలు ఆందోళన క్షణాల్లో శ్వాస పద్ధతులతో పాటు విస్తృతంగా ఉపయోగించబడతాయి',
    game2_why3:'గెలవడానికి, ఓడిపోవడానికి ఏమీ లేదు — ఇక్కడ "పూర్తయింది" అనే స్థితి లేదు',
    game2_meta:'~2–3 నిమిషాలు · మౌస్ లేదా టచ్‌స్క్రీన్‌తో ఉత్తమం',

    game3_ready:'సిద్ధమైనప్పుడు ప్రారంభించు నొక్కండి', game3_start:'శ్వాస ప్రారంభించండి',
    game3_tag1:'తీవ్ర ఒత్తిడి / భయాందోళన', game3_tag2:'వేగవంతమైన హృదయ స్పందన', game3_title:'గైడెడ్ బ్రీతింగ్',
    game3_desc:'మెల్లగా వెలుగుతున్న ఒక గోళం స్థిరమైన 4–4–6–2 లయలో విస్తరించి కుంచించుకుపోతుంది: శ్వాస తీసుకోండి, ఆపండి, వదలండి, ఆపండి. కొన్ని పూర్తి చక్రాల పాటు మీ శ్వాసతో దాన్ని అనుసరించండి.',
    game3_why1:'లయబద్ధమైన శ్వాస ఆ క్షణంలో వేగవంతమైన హృదయ స్పందనను శాంతపరచడానికి బాగా నిరూపితమైన మార్గాల్లో ఒకటి',
    game3_why2:'పొడవైన ఉచ్ఛ్వాసం (6సె) ఉద్దేశపూర్వకమైనది — శాంతపరిచే ప్రభావంతో అత్యధికంగా ముడిపడిన దశ ఇదే',
    game3_why3:'ఎక్కడైనా పనిచేస్తుంది, మీ శ్వాస తప్ప మరేమీ అవసరం లేదు',
    game3_meta:'~2–5 నిమిషాలు · శబ్దం ఆఫ్‌లో ఉంచి, గోళంపై దృష్టి పెట్టి చూస్తే ఉత్తమం',

    live_badge:'ఫిజికల్ AI · నిజమైన పరికర వంతెన', live_title:'లైవ్ రీడింగ్',
    live_subtitle:'మీ బ్రౌజర్ నుండి నేరుగా నిజమైన శారీరక పరికరాలను కనెక్ట్ చేయండి — బ్లూటూత్ హార్ట్-రేట్ స్ట్రాప్, బ్లూటూత్ బ్లడ్-ప్రెజర్ కఫ్, లేదా మీ మైక్రోఫోన్ ఇన్‌పుట్ ద్వారా ఎలక్ట్రానిక్ స్టెతస్కోప్ — మరియు MedSave AI నుండి లైవ్, సందర్భోచిత అవగాహన పొందండి.',
    live_disclaimer_strong:'ఇది వైద్య పరికరం కాదు.',
    live_disclaimer_text:'ఇక్కడ చూపిన రీడింగ్‌లు కన్స్యూమర్/BLE సెన్సార్లు మరియు ప్రయోగాత్మక మైక్రోఫోన్-ఆధారిత అకౌస్టిక్ అంచనా నుండి వస్తాయి. ఇవి కేవలం సాధారణ అవగాహన మరియు నేర్చుకోవడం కోసమే — ఇది నిర్ధారణ కాదు, ధృవీకరించబడిన వైద్య కొలత కాదు. అత్యవసర పరిస్థితుల్లో, లైసెన్స్ పొందిన వైద్యుడిని లేదా మీ స్థానిక అత్యవసర నంబర్‌ను సంప్రదించండి.',
    live_connect_eyebrow:'ఒక పరికరాన్ని కనెక్ట్ చేయండి', live_connect_heading:'సంభాషణలోకి నిజమైన హార్డ్‌వేర్‌ను తీసుకురండి',
    live_connect_sub:'ప్రామాణిక Web Bluetooth మరియు Web Audio బ్రౌజర్ APIలను ఉపయోగిస్తుంది — యాప్ ఇన్‌స్టాల్ అవసరం లేదు. డెస్క్‌టాప్ / Androidలో Chrome లేదా Edgeలో ఉత్తమంగా పనిచేస్తుంది.',

    live_hr_title:'బ్లూటూత్ హార్ట్ రేట్ మానిటర్',
    live_hr_desc:'ప్రామాణిక హార్ట్ రేట్ సర్వీస్‌ను ప్రసారం చేసే ఏదైనా BLE పరికరం (చెస్ట్ స్ట్రాప్‌లు, స్మార్ట్‌వాచ్‌లు, రింగులు).',
    live_hr_label:'హార్ట్ రేట్',

    live_bp_title:'బ్లూటూత్ బ్లడ్ ప్రెజర్ కఫ్',
    live_bp_desc:'ప్రామాణిక బ్లడ్ ప్రెజర్ సర్వీస్‌ను ప్రసారం చేసే ఏదైనా BLE కఫ్ — దీన్ని సింక్ చేయడానికి కఫ్‌పై రీడింగ్ తీసుకోండి.',
    live_bp_label1:'సిస్టోలిక్ / డయాస్టోలిక్', live_bp_label2:'పల్స్',

    live_steth_title:'డిజిటల్ స్టెతస్కోప్ (మైక్రోఫోన్ ఇన్‌పుట్)',
    live_steth_desc:'ఎలక్ట్రానిక్/USB స్టెతస్కోప్ ఆడియో ఇన్‌పుట్‌ను (లేదా మీ ల్యాప్‌టాప్ మైక్‌ను) ఎంచుకుని లైవ్‌గా వినండి — MedSave AI రా వేవ్‌ఫారమ్ మరియు ప్రయోగాత్మక అకౌస్టిక్ పల్స్ అంచనాను చూపిస్తుంది.',
    live_steth_label:'అకౌస్టిక్ పల్స్ (ప్రయోగాత్మకం)', live_steth_default_mic:'డిఫాల్ట్ మైక్రోఫోన్',
    live_steth_start:'వినడం ప్రారంభించండి',
    live_steth_note:'నిజమైన ఎలక్ట్రానిక్ స్టెతస్కోప్ కోసం, ముందుగా దాన్ని USB/3.5mm ద్వారా ప్లగ్ చేసి, మైక్రోఫోన్ అనుమతి ఇచ్చి, తర్వాత పైన ఉన్న డ్రాప్‌డౌన్ నుండి దాన్ని ఎంచుకోండి. ఈ అంచనా తక్కువ-ఫ్రీక్వెన్సీ ఆడియో ఎన్వలప్ పీక్‌ల నుండి తీసుకోబడింది — ఇది నేర్చుకునే డెమో, క్లినికల్-గ్రేడ్ రీడింగ్ కాదు.',

    live_status_notconnected:'కనెక్ట్ కాలేదు', live_status_notlistening:'వినడం లేదు',
    live_connect_btn:'పరికరాన్ని కనెక్ట్ చేయండి',

    live_chat_eyebrow:'లైవ్ అవేర్‌నెస్ చాట్', live_chat_heading:'మీరు చూస్తున్నదాని గురించి MedSave AIని అడగండి',
    live_chat_sub:'పైన ఉన్న మీ లైవ్ రీడింగ్‌లు స్వయంచాలకంగా సందర్భంగా అసిస్టెంట్‌తో పంచుకోబడతాయి — నంబర్లు టైప్ చేయాల్సిన అవసరం లేదు.',
    live_chat_name:'MedSave AI అసిస్టెంట్',
    live_vitals_empty:'ఇంకా లైవ్ రీడింగ్‌లు లేవు — పైన ఒక పరికరాన్ని కనెక్ట్ చేయండి, నేను దాన్ని చాట్‌లో పరిగణలోకి తీసుకుంటాను.',
    live_chip1:'నా హార్ట్ రేట్ అర్థం ఏమిటి?', live_chip2:'నా బ్లడ్ ప్రెజర్ ఆరోగ్యకరమైన పరిధిలో ఉందా?',
    live_chip3:'మైక్-ఆధారిత స్టెతస్కోప్ ఎంత ఖచ్చితమైనది?', live_chip4:'హృదయాన్ని ఆరోగ్యంగా ఉంచుకోవడానికి చిట్కాలు',
    live_chat_placeholder:'మీ లైవ్ రీడింగ్ గురించి అడగండి…',
  }
};

let MS_CURRENT_LANG = localStorage.getItem('medsave_lang') || 'en';
if(!MS_I18N[MS_CURRENT_LANG]) MS_CURRENT_LANG = 'en';

function msT(key){
  const table = MS_I18N[MS_CURRENT_LANG] || MS_I18N.en;
  const val = table[key];
  if(val !== undefined) return val;
  return MS_I18N.en[key] !== undefined ? MS_I18N.en[key] : key;
}

function msApplyLanguage(lang){
  if(!MS_I18N[lang]) return;
  MS_CURRENT_LANG = lang;
  localStorage.setItem('medsave_lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const v = msT(el.dataset.i18n);
    if(typeof v === 'string') el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const v = msT(el.dataset.i18nPlaceholder);
    if(typeof v === 'string') el.placeholder = v;
  });

  const picker = document.getElementById('langPicker');
  if(picker) picker.value = lang;

  document.dispatchEvent(new CustomEvent('ms:langchange', { detail: { lang } }));
}

function msWireLanguagePicker(){
  const picker = document.getElementById('langPicker');
  if(!picker) return;
  picker.value = MS_CURRENT_LANG;
  picker.addEventListener('change', ()=> msApplyLanguage(picker.value));
}

document.addEventListener('DOMContentLoaded', ()=>{
  msWireLanguagePicker();
  msApplyLanguage(MS_CURRENT_LANG);
});