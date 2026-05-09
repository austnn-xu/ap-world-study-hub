const iconPaths = {
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',
  route: '<path d="M4 18c4-8 12-4 16-12"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="6" r="2"/>',
  crown: '<path d="m3 8 4 4 5-7 5 7 4-4-2 11H5L3 8Z"/><path d="M5 19h14"/>',
  ship: '<path d="M4 18h16"/><path d="M6 14h12l-2 4H8l-2-4Z"/><path d="M12 4v10"/><path d="m12 4 6 6h-6"/>',
  spark: '<path d="M12 2v5"/><path d="M12 17v5"/><path d="m4.93 4.93 3.54 3.54"/><path d="m15.53 15.53 3.54 3.54"/><path d="M2 12h5"/><path d="M17 12h5"/><path d="m4.93 19.07 3.54-3.54"/><path d="m15.53 8.47 3.54-3.54"/>',
  factory: '<path d="M3 21V9l6 4V9l6 4V5h6v16H3Z"/><path d="M7 17h1"/><path d="M12 17h1"/><path d="M17 17h1"/>',
  war: '<path d="m14 6 4 4"/><path d="m5 19 8-8"/><path d="M13 7 7 13"/><path d="m2 22 3-3"/><path d="M15 3h6v6"/>',
  atom: '<circle cx="12" cy="12" r="1.5"/><path d="M20.2 12c0 2-3.7 3.6-8.2 3.6S3.8 14 3.8 12 7.5 8.4 12 8.4s8.2 1.6 8.2 3.6Z"/><path d="M16.1 19.1c-1.7 1-4.9-1.5-7.1-5.4S6.3 5.9 8 4.9s4.9 1.5 7.1 5.4 2.7 7.8 1 8.8Z"/><path d="M7.9 19.1c-1.7-1-.9-4.9 1.4-8.8s5.4-6.4 7.1-5.4.9 4.9-1.4 8.8-5.4 6.4-7.1 5.4Z"/>',
  signal: '<path d="M4 12a8 8 0 0 1 16 0"/><path d="M8 12a4 4 0 0 1 8 0"/><circle cx="12" cy="12" r="1"/><path d="M12 13v7"/>'
};

const units = [
  {
    id: 1,
    title: "The Global Tapestry",
    years: "c. 1200-1450",
    accent: "#00d7ff",
    icon: "globe",
    summary:
      "Regional states and belief systems grew more complex across Afro-Eurasia and the Americas before the age of oceanic empires.",
    events: [
      ["Song China expands", "c. 960-1279", "China's Song dynasty used bureaucracy, Neo-Confucian education, Champa rice, paper money, gunpowder, and commercial cities to become one of the world's most sophisticated economies.", "State building"],
      ["Dar al-Islam connects regions", "c. 1200-1450", "Islamic caliphates, sultanates, scholars, merchants, and Sufi networks linked West Africa, the Middle East, South Asia, and Southeast Asia through religion and trade.", "Cultural diffusion"],
      ["Delhi Sultanate in South Asia", "1206-1526", "Turkic Muslim rulers established new states in northern India, creating political change while Hindu, Buddhist, and Islamic traditions interacted.", "Governance"],
      ["Mali and Mansa Musa", "c. 1235-1600", "Mali grew wealthy from gold and trans-Saharan trade; Mansa Musa's pilgrimage advertised West African wealth and Islamic learning to the wider world.", "Economic systems"],
      ["Swahili city-states flourish", "c. 1200-1500", "Kilwa, Mombasa, and other coastal cities blended African, Arab, Persian, and Indian Ocean influences through trade in gold, ivory, and textiles.", "Exchange"],
      ["Mesoamerican and Andean states", "c. 1200-1450", "The Mexica built tribute power in central Mexico, while Andean societies used mit'a labor, roads, and vertical farming to manage mountain environments.", "Humans and environment"]
    ]
  },
  {
    id: 2,
    title: "Networks of Exchange",
    years: "c. 1200-1450",
    accent: "#73ff9b",
    icon: "route",
    summary:
      "Trade routes intensified, moving goods, technologies, religions, diseases, and people across connected commercial zones.",
    events: [
      ["Silk Roads peak under Mongols", "13th-14th c.", "Mongol rule secured long-distance routes across Eurasia, increasing trade in silk, porcelain, horses, ideas, and technologies.", "Causation"],
      ["Mongol Empire transforms Eurasia", "1206-1368", "Chinggis Khan and successors built history's largest contiguous land empire, spreading military techniques while tolerating many local traditions.", "Comparison"],
      ["Indian Ocean trade expands", "c. 1200-1450", "Monsoon knowledge, dhows, junk ships, bills of exchange, and entrepots helped merchants connect East Africa, Arabia, India, Southeast Asia, and China.", "Networks"],
      ["Trans-Saharan trade grows", "c. 1200-1450", "Caravan routes moved gold, salt, enslaved people, textiles, and books while supporting cities such as Timbuktu and Gao.", "Economic systems"],
      ["Travelers record connected worlds", "13th-14th c.", "Marco Polo, Ibn Battuta, and Margery Kempe left accounts that reveal trade networks, religious travel, and cross-cultural curiosity.", "Sources"],
      ["Black Death spreads", "1340s-1350s", "Bubonic plague moved along trade routes, causing demographic collapse, labor shortages, social unrest, and long-term economic change.", "Continuity and change"]
    ]
  },
  {
    id: 3,
    title: "Land-Based Empires",
    years: "c. 1450-1750",
    accent: "#8d7cff",
    icon: "crown",
    summary:
      "Gunpowder, taxation, monumental art, and administrative systems helped large empires consolidate power across Eurasia.",
    events: [
      ["Ottoman conquest of Constantinople", "1453", "Mehmed II's conquest ended the Byzantine Empire and positioned the Ottomans as a major Mediterranean and Islamic power.", "State building"],
      ["Safavid Empire and Shi'a identity", "1501-1736", "Safavid rulers made Twelver Shi'ism central to Persian identity, creating rivalry with the Sunni Ottomans and shaping Iranian culture.", "Cultural developments"],
      ["Mughal Empire in India", "1526-1857", "Mughal rulers used gunpowder armies, mansabdars, zamindars, Persianate culture, and religious policies ranging from Akbar's tolerance to Aurangzeb's orthodoxy.", "Governance"],
      ["Qing conquest of China", "1644", "Manchu rulers expanded China's borders, preserved Confucian bureaucracy, and governed a multiethnic empire with careful legitimacy strategies.", "Imperial expansion"],
      ["Russian expansion across Siberia", "16th-18th c.", "Muscovy and later Romanov rulers expanded eastward, using fur tribute, Cossacks, and bureaucracy to build a Eurasian empire.", "Expansion"],
      ["Tokugawa shogunate stabilizes Japan", "1603-1868", "Japan's shoguns limited daimyo power, regulated foreign contact, and produced urban growth, commercial culture, and social hierarchy.", "Social organization"]
    ]
  },
  {
    id: 4,
    title: "Transoceanic Interconnections",
    years: "c. 1450-1750",
    accent: "#ff4fd8",
    icon: "ship",
    summary:
      "Oceanic exploration, colonization, mercantilism, coerced labor, and biological exchange reshaped the world.",
    events: [
      ["Portuguese maritime empire", "15th-16th c.", "Caravels, lateen sails, astrolabes, and armed trading posts helped Portugal build routes around Africa into the Indian Ocean.", "Technology"],
      ["Columbian Exchange", "after 1492", "Crops, animals, diseases, and people moved between hemispheres, producing population collapse in the Americas and new diets worldwide.", "Humans and environment"],
      ["Spanish conquest of Mexica and Inca", "1519-1533", "Cortes and Pizarro exploited disease, alliances, horses, steel, and imperial rivalries to overthrow powerful American empires.", "Causation"],
      ["Atlantic slave trade", "16th-19th c.", "European demand for plantation labor forcibly transported millions of Africans, transforming societies across Africa and the Americas.", "Labor systems"],
      ["Silver flows from Potosi and Mexico", "16th-18th c.", "American silver funded Spanish empire, crossed the Pacific to Manila, and entered China's tax economy, linking global markets.", "Economic systems"],
      ["Joint-stock companies and mercantilism", "17th c.", "The Dutch and British East India companies combined private capital with state power, while mercantilist policies sought colonial wealth.", "Commercial practices"]
    ]
  },
  {
    id: 5,
    title: "Revolutions",
    years: "c. 1750-1900",
    accent: "#ffb23f",
    icon: "spark",
    summary:
      "Enlightenment ideas, nationalism, liberalism, industrial technology, and Atlantic revolutions challenged older political and economic orders.",
    events: [
      ["Enlightenment political thought", "17th-18th c.", "Locke, Rousseau, Montesquieu, Wollstonecraft, and others argued about natural rights, popular sovereignty, separation of powers, and equality.", "Ideas"],
      ["American Revolution", "1775-1783", "Colonists used Enlightenment arguments to break from Britain, creating a republic that still protected slavery and limited full citizenship.", "Political change"],
      ["French Revolution", "1789-1799", "Fiscal crisis, inequality, Enlightenment language, and popular mobilization overturned monarchy and spread new ideas about citizenship.", "Causation"],
      ["Haitian Revolution", "1791-1804", "Enslaved and free people of color defeated French rule, creating the first Black republic and terrifying slaveholding societies.", "Social interactions"],
      ["Latin American independence", "1808-1826", "Creole elites, Indigenous and mixed-race rebels, Napoleon's invasion of Spain, and regional leaders broke Iberian colonial rule.", "Comparison"],
      ["Industrial Revolution begins", "c. 1750-1850", "Steam power, coal, textile machinery, factories, railroads, and capitalist investment transformed production first in Britain, then beyond.", "Technology"]
    ]
  },
  {
    id: 6,
    title: "Consequences of Industrialization",
    years: "c. 1750-1900",
    accent: "#00c2a8",
    icon: "factory",
    summary:
      "Industrial capitalism intensified imperialism, migration, environmental change, labor movements, and debates over reform.",
    events: [
      ["Second Industrial Revolution", "late 19th c.", "Steel, chemicals, electricity, oil, and precision machinery expanded industrial power in Germany, the United States, Russia, and Japan.", "Technology"],
      ["Meiji Restoration", "1868", "Japanese leaders ended shogunate rule, centralized the state, industrialized rapidly, and built a modern military to resist Western domination.", "State building"],
      ["New Imperialism in Africa and Asia", "c. 1870-1914", "Industrial powers used military technology, finance, racism, and resource demand to conquer or dominate large parts of Africa and Asia.", "Imperialism"],
      ["Opium Wars and unequal treaties", "1839-1842; 1856-1860", "British victory forced Qing China into treaty ports, indemnities, and foreign privileges, weakening Chinese sovereignty.", "Economic systems"],
      ["Indian Rebellion and British Raj", "1857-1858", "A major revolt against the East India Company led Britain to impose direct colonial rule over India.", "Resistance"],
      ["Global migration and labor reforms", "19th c.", "Industrial jobs, indentured servitude, abolition, settler colonialism, and urbanization moved millions and produced new labor politics.", "Social organization"]
    ]
  },
  {
    id: 7,
    title: "Global Conflict",
    years: "c. 1900-present",
    accent: "#ff5f57",
    icon: "war",
    summary:
      "Imperial rivalry, nationalism, economic crisis, fascism, communism, and total war remade global politics.",
    events: [
      ["World War I", "1914-1918", "Militarism, alliances, imperial rivalry, and nationalism produced total war, trench stalemate, mass death, and the collapse of empires.", "Causation"],
      ["Russian Revolution and USSR", "1917-1922", "War crisis and inequality helped Bolsheviks seize power, creating a communist state that pursued planned economics and one-party rule.", "Political change"],
      ["Treaty of Versailles and mandates", "1919", "Peace settlements punished Germany, redrew borders, created mandates, and fed future grievances while promising self-determination unevenly.", "Continuity and change"],
      ["Great Depression", "1929-1930s", "Global market collapse hurt trade, employment, and trust in liberal capitalism, encouraging state intervention and extremist politics.", "Economic systems"],
      ["World War II", "1939-1945", "Fascist expansion, appeasement, militarism, and unresolved tensions produced a global war ending with genocide, atomic bombs, and new superpowers.", "Global conflict"],
      ["Holocaust and mass atrocities", "1930s-1945", "Nazi racial ideology and modern state machinery murdered six million Jews and millions of other victims, reshaping human rights debates.", "Social interactions"]
    ]
  },
  {
    id: 8,
    title: "Cold War and Decolonization",
    years: "c. 1900-present",
    accent: "#00d7ff",
    icon: "atom",
    summary:
      "After World War II, superpower rivalry and anticolonial movements reshaped sovereignty, development, and identity.",
    events: [
      ["United Nations founded", "1945", "The UN aimed to prevent war, coordinate diplomacy, and promote human rights, though Cold War politics often limited action.", "Institutions"],
      ["Cold War blocs form", "1945-1991", "The United States and Soviet Union competed through alliances, nuclear arms, ideology, espionage, aid, and proxy wars.", "Comparison"],
      ["Chinese Communist Revolution", "1949", "Mao Zedong's victory created the People's Republic of China, followed by land reform, collectivization, and major social campaigns.", "Political change"],
      ["Indian independence and partition", "1947", "Mass movements, British weakness, and communal tensions produced independence, partition, migration, and violence in South Asia.", "Decolonization"],
      ["African decolonization", "1950s-1970s", "Ghana, Algeria, Kenya, Congo, and others pursued independence through diplomacy, protest, and armed struggle against European empires.", "Resistance"],
      ["Non-Aligned Movement", "1955-1961", "Leaders from newly independent states sought a third path outside formal U.S. or Soviet control, beginning with Bandung-era cooperation.", "Global politics"]
    ]
  },
  {
    id: 9,
    title: "Globalization",
    years: "c. 1900-present",
    accent: "#2f80ed",
    icon: "signal",
    summary:
      "Technology, trade, migration, climate pressures, rights movements, and global institutions made the late twentieth and early twenty-first centuries deeply interconnected.",
    events: [
      ["Postwar economic institutions", "1944-present", "The IMF, World Bank, GATT, and WTO encouraged trade, loans, development, and market integration with uneven effects.", "Economic systems"],
      ["Green Revolution", "mid-20th c.", "High-yield crops, fertilizers, irrigation, and mechanization increased food production while raising environmental and equity concerns.", "Humans and environment"],
      ["Digital and communications revolutions", "late 20th c.", "Satellites, computers, the internet, and mobile devices sped up finance, culture, activism, education, and surveillance.", "Technology"],
      ["Human rights and social movements", "20th-21st c.", "Feminist, civil rights, Indigenous, LGBTQ, anti-apartheid, and democracy movements challenged states and social hierarchies.", "Social organization"],
      ["Global environmental change", "20th-21st c.", "Industrial growth, population change, fossil fuels, deforestation, and climate change created shared environmental crises.", "Environment"],
      ["Global popular culture and migration", "late 20th-21st c.", "Media, sports, music, tourism, diasporas, and labor migration spread cultural forms while provoking debates over identity.", "Cultural diffusion"]
    ]
  }
];

const studyNotes = {
  1: {
    points: [
      "Major states used bureaucracy, tribute, religion, and elite education to stabilize rule.",
      "Song China shows how technology, agriculture, and markets can strengthen a state.",
      "Belief systems shaped legitimacy, social hierarchy, and cultural identity across regions."
    ],
    vocab: ["Neo-Confucianism", "Champa rice", "tribute", "Mansa Musa", "mit'a", "Swahili"],
    remember: "Unit 1 is mostly about regional comparison: how different societies organized power before global oceanic empires.",
    visuals: [
      { label: "Song city life", tone: "#00d7ff", src: "assets/apw/song-china-city.jpg" },
      { label: "Imperial architecture", tone: "#73ff9b", src: "assets/apw/safavid-isfahan.jpg" },
      { label: "Global tapestry", tone: "#ffb23f", src: "assets/apw/ottoman-sultan.jpg" }
    ]
  },
  2: {
    points: [
      "Trade networks carried goods, but also technology, religion, disease, and cultural ideas.",
      "Mongol rule increased Eurasian connection while also spreading violence and disruption.",
      "Commercial growth depended on environmental knowledge, credit, ports, and caravan systems."
    ],
    vocab: ["Silk Roads", "Pax Mongolica", "diaspora", "monsoon winds", "caravanserai", "Black Death"],
    remember: "For Unit 2, always connect exchange to consequences: trade rarely moves only products.",
    visuals: [
      { label: "Silk Roads", tone: "#73ff9b", src: "assets/apw/song-china-city.jpg" },
      { label: "Indian Ocean exchange", tone: "#00d7ff", src: "assets/apw/safavid-isfahan.jpg" },
      { label: "Travel and trade", tone: "#8d7cff", src: "assets/wiki/portuguese-empire.png" }
    ]
  },
  3: {
    points: [
      "Land empires used gunpowder armies, tax systems, and administrative elites to expand.",
      "Rulers blended religious legitimacy, monumental art, and bureaucracy to project authority.",
      "Multiethnic empires had to balance central control with local traditions and resistance."
    ],
    vocab: ["gunpowder empire", "devshirme", "zamindar", "janissaries", "Twelver Shi'ism", "Manchu"],
    remember: "Unit 3 loves comparison: Ottoman, Safavid, Mughal, Qing, Russian, and Tokugawa methods of rule.",
    visuals: [
      { label: "Ottoman rule", tone: "#8d7cff", src: "assets/apw/ottoman-sultan.jpg" },
      { label: "Mughal architecture", tone: "#ffb23f", src: "assets/apw/safavid-isfahan.jpg" },
      { label: "Imperial power", tone: "#ff5f57", src: "assets/wiki/french-revolution.jpg" }
    ]
  },
  4: {
    points: [
      "Maritime technology and state-backed exploration created sustained transoceanic links.",
      "The Columbian Exchange changed diets, disease environments, labor needs, and populations.",
      "Plantation slavery, silver mining, and mercantilism tied colonies to global capitalism."
    ],
    vocab: ["Columbian Exchange", "mercantilism", "joint-stock company", "encomienda", "Middle Passage", "Manila galleons"],
    remember: "Unit 4 is the major turn toward a truly global economy, but it came with conquest and coerced labor.",
    visuals: [
      { label: "Ocean crossings", tone: "#00d7ff", src: "assets/wiki/portuguese-empire.png" },
      { label: "Silver circuits", tone: "#ff4fd8", src: "assets/apw/safavid-isfahan.jpg" },
      { label: "Atlantic systems", tone: "#ff5f57", src: "assets/wiki/brookes-slave-ship.jpg" }
    ]
  },
  5: {
    points: [
      "Enlightenment ideals challenged monarchy, hierarchy, and inherited privilege.",
      "Revolutions often promised rights while still excluding women, enslaved people, and colonized groups.",
      "Industrialization changed production, class relations, urban life, and the global balance of power."
    ],
    vocab: ["natural rights", "popular sovereignty", "nationalism", "liberalism", "factory system", "socialism"],
    remember: "For Unit 5, track both political revolutions and industrial revolution; AP asks how ideas and machines changed power.",
    visuals: [
      { label: "Atlantic revolutions", tone: "#ffb23f", src: "assets/wiki/french-revolution.jpg" },
      { label: "Factory systems", tone: "#00c2a8", src: "assets/wiki/industrial-revolution.jpg" },
      { label: "Rights debates", tone: "#ff4fd8", src: "assets/wiki/industrial-revolution.jpg" }
    ]
  },
  6: {
    points: [
      "Industrial states wanted raw materials, markets, investment outlets, and strategic territory.",
      "Imperialism relied on technology and racial ideology, but colonized peoples resisted in many ways.",
      "Migration expanded because of labor demand, abolition, poverty, and empire."
    ],
    vocab: ["New Imperialism", "Social Darwinism", "spheres of influence", "indentured labor", "settler colony", "Raj"],
    remember: "Unit 6 asks what industrialization did to the rest of the world: empire, migration, reform, and resistance.",
    visuals: [
      { label: "Industrial cities", tone: "#00c2a8", src: "assets/wiki/industrial-revolution.jpg" },
      { label: "Imperial conflict", tone: "#8d7cff", src: "assets/wiki/portuguese-empire.png" },
      { label: "Labor and migration", tone: "#73ff9b", src: "assets/wiki/industrial-revolution.jpg" }
    ]
  },
  7: {
    points: [
      "Total war mobilized economies, civilians, propaganda, science, and state power.",
      "Economic crisis and unresolved grievances helped fascism and militarism grow.",
      "Genocide and mass violence forced new global conversations about human rights."
    ],
    vocab: ["total war", "fascism", "appeasement", "self-determination", "genocide", "mandate system"],
    remember: "In Unit 7, connect causes, conduct, and consequences of war instead of memorizing battles alone.",
    visuals: [
      { label: "World war fronts", tone: "#ff5f57", src: "assets/wiki/brookes-slave-ship.jpg" },
      { label: "Revolutionary crisis", tone: "#ffb23f", src: "assets/wiki/french-revolution.jpg" },
      { label: "Urban war", tone: "#8d7cff", src: "assets/wiki/cold-war.png" }
    ]
  },
  8: {
    points: [
      "The Cold War was ideological, military, economic, and cultural, even when superpowers avoided direct war.",
      "Decolonization came through negotiation, mass protest, civil disobedience, and armed struggle.",
      "New states faced border conflicts, development pressures, and Cold War intervention."
    ],
    vocab: ["containment", "proxy war", "nonalignment", "partition", "decolonization", "nuclear deterrence"],
    remember: "Unit 8 is about two overlapping stories: superpower rivalry and the end of European empires.",
    visuals: [
      { label: "Cold War blocs", tone: "#00d7ff", src: "assets/wiki/cold-war.png" },
      { label: "Independence movements", tone: "#73ff9b", src: "assets/apw/safavid-isfahan.jpg" },
      { label: "New nations", tone: "#ffb23f", src: "assets/wiki/portuguese-empire.png" }
    ]
  },
  9: {
    points: [
      "Globalization accelerated through trade institutions, container shipping, aviation, and digital networks.",
      "New technologies improved life for many while also expanding surveillance, inequality, and environmental pressure.",
      "Rights movements and cultural exchange challenged older borders and identities."
    ],
    vocab: ["globalization", "Green Revolution", "IMF", "World Bank", "WTO", "climate change"],
    remember: "Unit 9 is the modern synthesis: technology links the world, but the benefits and costs are uneven.",
    visuals: [
      { label: "Global networks", tone: "#2f80ed", src: "assets/wiki/cold-war.png" },
      { label: "Container trade", tone: "#00c2a8", src: "assets/wiki/industrial-revolution.jpg" },
      { label: "Global exchange", tone: "#73ff9b", src: "assets/apw/song-china-city.jpg" }
    ]
  }
};

const topicDetails = {
  "1-0": {
    points: [
      "Song rulers relied on a large scholar-bureaucracy and civil service exams to manage the state.",
      "Champa rice, commercialization, paper money, and urban growth made Song China a major economic center.",
      "Technologies such as gunpowder, printing, and compass navigation later spread through exchange networks."
    ],
    vocab: ["civil service exam", "scholar-gentry", "Neo-Confucianism", "Champa rice", "paper money"],
    remember: "Song China is a model example of bureaucracy plus economic innovation strengthening a state."
  },
  "1-1": {
    points: [
      "Dar al-Islam was not one empire; it was a wider Islamic world connected by trade, scholarship, and religion.",
      "Merchants, ulama, Sufi missionaries, and madrasas helped spread Islamic beliefs and practices.",
      "Islamic networks connected West Africa, the Middle East, South Asia, and Southeast Asia."
    ],
    vocab: ["Dar al-Islam", "ulama", "Sufism", "madrasa", "sharia"],
    remember: "Think of Dar al-Islam as a cultural and commercial network, not just a political state."
  },
  "1-2": {
    points: [
      "The Delhi Sultanate brought Turkic Muslim rule into northern India and changed regional politics.",
      "It did not erase Hindu traditions; instead, South Asia became a place of interaction and tension among traditions.",
      "The sultanate shows how conquest can create new political systems while older cultures continue."
    ],
    vocab: ["Delhi Sultanate", "sultan", "jizya", "Hinduism", "South Asia"],
    remember: "Use the Delhi Sultanate to discuss cultural interaction, religious diversity, and state building."
  },
  "1-3": {
    points: [
      "Mali grew wealthy because it controlled gold fields and important trans-Saharan trade routes.",
      "Mansa Musa's pilgrimage showed Mali's wealth and increased Islamic connections to West Africa.",
      "Cities such as Timbuktu became centers of trade, scholarship, and Islamic learning."
    ],
    vocab: ["Mali", "Mansa Musa", "Timbuktu", "gold-salt trade", "trans-Saharan trade"],
    remember: "Mali is the go-to example for wealth, Islam, and trade in medieval West Africa."
  },
  "1-4": {
    points: [
      "Swahili city-states grew because of Indian Ocean trade in gold, ivory, textiles, and other goods.",
      "Swahili culture blended Bantu African roots with Arab, Persian, and Islamic influences.",
      "Cities such as Kilwa and Mombasa were independent commercial centers rather than one unified empire."
    ],
    vocab: ["Swahili", "Kilwa", "Mombasa", "dhows", "Indian Ocean trade"],
    remember: "Swahili city-states show how trade can create blended cultures along coastlines."
  },
  "1-5": {
    points: [
      "The Mexica built power through tribute, military expansion, and control over central Mexico.",
      "Andean societies used roads, terrace farming, and mit'a labor to manage mountain environments.",
      "These states were complex even though they developed outside Afro-Eurasian trade networks."
    ],
    vocab: ["Mexica", "Inca", "tribute", "mit'a", "terrace farming"],
    remember: "Mesoamerican and Andean states are examples of complex American societies before European arrival."
  },
  "2-0": {
    points: [
      "The Silk Roads connected China, Central Asia, the Middle East, and Europe through overland trade.",
      "Luxury goods moved along these routes, but so did technology, religion, and disease.",
      "Mongol protection made travel safer for a time, increasing long-distance exchange."
    ],
    vocab: ["Silk Roads", "caravanserai", "Pax Mongolica", "luxury goods", "cultural diffusion"],
    remember: "Silk Roads questions usually ask what moved besides goods."
  },
  "2-1": {
    points: [
      "The Mongols built the largest contiguous land empire in history through cavalry warfare and conquest.",
      "Mongol rule could be destructive, but it also protected trade and connected Eurasia.",
      "They often tolerated local religions and used local administrators to govern diverse peoples."
    ],
    vocab: ["Chinggis Khan", "khanate", "Pax Mongolica", "Yuan dynasty", "steppe nomads"],
    remember: "The Mongols are both conquerors and connectors in AP World."
  },
  "2-2": {
    points: [
      "Indian Ocean trade depended on monsoon winds, ports, and merchant communities.",
      "Goods such as spices, textiles, porcelain, and gold moved across East Africa, Arabia, India, Southeast Asia, and China.",
      "Diasporic merchant communities helped spread Islam, languages, and cultural practices."
    ],
    vocab: ["monsoon winds", "diaspora", "dhow", "junk ship", "entrepot"],
    remember: "Indian Ocean trade was maritime, seasonal, and more bulk-goods friendly than the Silk Roads."
  },
  "2-3": {
    points: [
      "Trans-Saharan trade linked West Africa to North Africa and the Mediterranean world.",
      "Gold, salt, enslaved people, textiles, and books moved by camel caravan.",
      "The trade helped support states such as Ghana, Mali, and Songhai and cities such as Timbuktu."
    ],
    vocab: ["camel caravan", "Sahara", "gold-salt trade", "Songhai", "Timbuktu"],
    remember: "Trans-Saharan trade explains why West African states became rich and connected to Islam."
  },
  "2-4": {
    points: [
      "Travelers' accounts give historians evidence about trade, religion, cities, and cultural exchange.",
      "Ibn Battuta traveled through much of Dar al-Islam, while Marco Polo described Mongol-era Eurasia.",
      "Their writings can be useful but also biased by their own backgrounds and expectations."
    ],
    vocab: ["Ibn Battuta", "Marco Polo", "primary source", "travel narrative", "bias"],
    remember: "Travelers are evidence for connection, but always think about point of view."
  },
  "2-5": {
    points: [
      "The Black Death spread through trade routes and Mongol-era connections across Eurasia.",
      "Mass death caused labor shortages, social unrest, and economic changes in many regions.",
      "The plague shows that networks of exchange can spread disease as well as goods and ideas."
    ],
    vocab: ["bubonic plague", "Black Death", "pathogen", "labor shortage", "pandemic"],
    remember: "The Black Death is the strongest example of a negative consequence of increased connectivity."
  },
  "3-0": {
    points: [
      "The Ottoman conquest of Constantinople ended the Byzantine Empire and expanded Ottoman power.",
      "Gunpowder weapons and artillery helped the Ottomans take the city.",
      "The city became Istanbul, a major imperial and Islamic capital."
    ],
    vocab: ["Ottoman Empire", "Constantinople", "Istanbul", "Mehmed II", "gunpowder"],
    remember: "1453 marks a major shift in Mediterranean and Islamic world power."
  },
  "3-1": {
    points: [
      "The Safavids made Twelver Shi'a Islam central to Persian identity.",
      "Their Shi'a identity sharpened rivalry with the Sunni Ottoman Empire.",
      "Safavid rule blended religion, Persian culture, military power, and trade."
    ],
    vocab: ["Safavid", "Twelver Shi'ism", "Shah", "Isfahan", "Sunni-Shi'a split"],
    remember: "Safavid Iran is the classic AP example of religion used to build state identity."
  },
  "3-2": {
    points: [
      "The Mughal Empire used gunpowder armies and administrative systems to rule much of India.",
      "Akbar is known for religious tolerance, while Aurangzeb is associated with stricter Islamic policies.",
      "Mughal architecture and culture blended Persian, Islamic, and South Asian influences."
    ],
    vocab: ["Mughal", "Akbar", "Aurangzeb", "zamindar", "Taj Mahal"],
    remember: "Mughal India is useful for comparing religious policy and imperial administration."
  },
  "3-3": {
    points: [
      "The Qing were Manchu rulers who governed China while preserving many Confucian institutions.",
      "They expanded China's borders into areas such as Tibet, Xinjiang, and Mongolia.",
      "Qing rulers had to balance Manchu identity with Chinese political traditions."
    ],
    vocab: ["Qing dynasty", "Manchu", "Kangxi", "Qianlong", "Confucian bureaucracy"],
    remember: "The Qing show how a minority ruling group can adapt local traditions to claim legitimacy."
  },
  "3-4": {
    points: [
      "Russia expanded east across Siberia through Cossacks, fur tribute, and military outposts.",
      "Expansion connected Russia to Asian trade and increased control over diverse peoples.",
      "The state used bureaucracy and coercion to bring frontier regions under imperial authority."
    ],
    vocab: ["Muscovy", "Romanov", "Cossacks", "yasak", "Siberia"],
    remember: "Russian expansion is land-based empire building across northern Eurasia."
  },
  "3-5": {
    points: [
      "The Tokugawa shogunate created stability after a long period of Japanese conflict.",
      "The shoguns controlled daimyo through systems such as alternate attendance.",
      "Japan limited some foreign influence while still allowing controlled trade and cultural growth."
    ],
    vocab: ["Tokugawa", "shogun", "daimyo", "samurai", "alternate attendance"],
    remember: "Tokugawa Japan is about order, hierarchy, and carefully managed outside contact."
  },
  "4-0": {
    points: [
      "Portugal used maritime technology and armed trading posts to enter Indian Ocean commerce.",
      "Caravels, lateen sails, and navigation tools helped Europeans travel farther by sea.",
      "Portuguese power depended on controlling strategic ports rather than conquering huge inland empires."
    ],
    vocab: ["caravel", "lateen sail", "astrolabe", "trading post empire", "Vasco da Gama"],
    remember: "Portuguese expansion is the early example of European maritime empire."
  },
  "4-1": {
    points: [
      "The Columbian Exchange moved plants, animals, diseases, and people between hemispheres.",
      "American crops such as maize and potatoes supported population growth in Afro-Eurasia.",
      "Smallpox and other diseases devastated Indigenous populations in the Americas."
    ],
    vocab: ["Columbian Exchange", "smallpox", "maize", "potato", "cash crop"],
    remember: "The Columbian Exchange changed environments, diets, populations, and economies worldwide."
  },
  "4-2": {
    points: [
      "Spanish conquest succeeded partly because of disease, steel, horses, and Indigenous alliances.",
      "The Mexica and Inca were powerful empires, but internal tensions made them vulnerable.",
      "Conquest led to new colonial governments, forced labor systems, and cultural change."
    ],
    vocab: ["Cortes", "Pizarro", "Mexica", "Inca", "encomienda"],
    remember: "Spanish conquest was not just Europeans versus Indigenous peoples; alliances mattered."
  },
  "4-3": {
    points: [
      "The Atlantic slave trade forcibly moved millions of Africans to the Americas.",
      "Plantation economies demanded labor for sugar, tobacco, cotton, and other cash crops.",
      "The trade devastated African societies and created African diaspora cultures in the Americas."
    ],
    vocab: ["Middle Passage", "chattel slavery", "plantation", "African diaspora", "triangular trade"],
    remember: "This topic is central for labor systems, race, capitalism, and demographic change."
  },
  "4-4": {
    points: [
      "Silver from Potosi and Mexico connected the Americas, Europe, and Asia.",
      "Spanish silver crossed the Atlantic and Pacific, especially through the Manila galleons.",
      "China's demand for silver helped pull the world economy together."
    ],
    vocab: ["Potosi", "Manila galleons", "silver trade", "mercantilism", "mita"],
    remember: "Silver is one of the clearest examples of a global economy before 1750."
  },
  "4-5": {
    points: [
      "Joint-stock companies raised private money for risky overseas trade and colonization.",
      "Companies such as the Dutch and British East India Companies gained military and political power.",
      "Mercantilist states wanted colonies to provide wealth, raw materials, and controlled markets."
    ],
    vocab: ["joint-stock company", "VOC", "British East India Company", "mercantilism", "monopoly"],
    remember: "These companies blur the line between business power and state power."
  },
  "5-0": {
    points: [
      "Enlightenment thinkers argued about natural rights, reason, liberty, and government by consent.",
      "Their ideas challenged absolute monarchy and inherited privilege.",
      "Enlightenment claims could inspire reform, revolution, and debates over who deserved rights."
    ],
    vocab: ["natural rights", "social contract", "popular sovereignty", "Montesquieu", "Wollstonecraft"],
    remember: "The Enlightenment gives the language that many revolutionaries used."
  },
  "5-1": {
    points: [
      "The American Revolution used Enlightenment ideas to justify independence from Britain.",
      "The new republic expanded political ideas but did not create equality for all people.",
      "Slavery, Indigenous dispossession, and limited voting rights remained major contradictions."
    ],
    vocab: ["Declaration of Independence", "republic", "constitution", "liberty", "popular sovereignty"],
    remember: "The American Revolution is both revolutionary and limited."
  },
  "5-2": {
    points: [
      "The French Revolution began from financial crisis, social inequality, and Enlightenment ideas.",
      "It overthrew monarchy, expanded citizenship claims, and inspired radical political change.",
      "The revolution also included violence, the Reign of Terror, and later Napoleon's rise."
    ],
    vocab: ["Estates-General", "Bastille", "National Assembly", "Reign of Terror", "Napoleon"],
    remember: "French Revolution questions often focus on causes, radicalization, and global influence."
  },
  "5-3": {
    points: [
      "The Haitian Revolution was led by enslaved and free people of color against French colonial slavery.",
      "It created the first Black republic and the first successful slave revolt to form an independent state.",
      "The revolution frightened slaveholding societies and challenged racist assumptions."
    ],
    vocab: ["Saint-Domingue", "Toussaint Louverture", "slave revolt", "Haiti", "abolition"],
    remember: "Haiti is the most radical Atlantic Revolution because enslaved people won independence."
  },
  "5-4": {
    points: [
      "Latin American independence was influenced by Enlightenment ideas, creole resentment, and Napoleon's invasion of Spain.",
      "Creole leaders often wanted independence without fully overturning racial and class hierarchy.",
      "Independence created new states but did not solve inequality or political instability."
    ],
    vocab: ["creoles", "peninsulares", "Simon Bolivar", "Jose de San Martin", "Gran Colombia"],
    remember: "Latin American independence changed political control more than social hierarchy."
  },
  "5-5": {
    points: [
      "Industrialization began in Britain because of coal, capital, labor, technology, and access to markets.",
      "Factories changed production by concentrating workers, machines, and discipline in one place.",
      "Steam power, textiles, and railroads transformed economies and daily life."
    ],
    vocab: ["factory system", "steam engine", "coal", "textiles", "urbanization"],
    remember: "The Industrial Revolution is about a new way of producing goods, not just new machines."
  },
  "6-0": {
    points: [
      "The Second Industrial Revolution expanded production through steel, oil, electricity, chemicals, and new machinery.",
      "Germany, the United States, Japan, and Russia became major industrial powers.",
      "Industrial competition increased demand for raw materials and markets."
    ],
    vocab: ["steel", "electricity", "oil", "mass production", "industrial capitalism"],
    remember: "This topic explains why industrial power spread and why imperial competition intensified."
  },
  "6-1": {
    points: [
      "The Meiji Restoration centralized Japan and ended the Tokugawa shogunate.",
      "Japanese leaders industrialized and modernized the military to avoid Western domination.",
      "Japan became an imperial power after adopting selected Western methods."
    ],
    vocab: ["Meiji Restoration", "emperor", "zaibatsu", "modernization", "Russo-Japanese War"],
    remember: "Meiji Japan is an example of defensive modernization becoming imperial expansion."
  },
  "6-2": {
    points: [
      "New Imperialism was driven by industrial demand, strategic competition, and racial ideology.",
      "European states used military technology and finance to dominate Africa and Asia.",
      "Colonized peoples resisted through rebellion, diplomacy, religious movements, and nationalism."
    ],
    vocab: ["New Imperialism", "Social Darwinism", "Berlin Conference", "colony", "protectorate"],
    remember: "Connect imperialism to industrialization: factories needed resources and markets."
  },
  "6-3": {
    points: [
      "The Opium Wars began from trade conflict between Britain and Qing China.",
      "British victory forced China into unequal treaties, treaty ports, and foreign privileges.",
      "The wars weakened Qing sovereignty and increased foreign influence in China."
    ],
    vocab: ["Opium Wars", "unequal treaties", "Treaty of Nanjing", "treaty ports", "extraterritoriality"],
    remember: "The Opium Wars show how industrial powers forced open weaker states for trade."
  },
  "6-4": {
    points: [
      "The Indian Rebellion of 1857 challenged British East India Company rule.",
      "Its causes included military grievances, religious concerns, and resentment toward British policies.",
      "After the rebellion, Britain replaced company rule with direct rule called the British Raj."
    ],
    vocab: ["sepoy", "Indian Rebellion of 1857", "British Raj", "East India Company", "colonial rule"],
    remember: "This topic marks the shift from company rule to direct British imperial rule in India."
  },
  "6-5": {
    points: [
      "Industrialization and empire moved millions of people through migration, indenture, and settlement.",
      "Abolition ended some forms of slavery but created new coerced labor systems.",
      "Migrants built diasporic communities while facing discrimination and labor exploitation."
    ],
    vocab: ["indentured labor", "diaspora", "settler colony", "abolition", "labor union"],
    remember: "Migration in this period is tied to labor demand and imperial networks."
  },
  "7-0": {
    points: [
      "World War I was caused by militarism, alliances, imperial rivalry, and nationalism.",
      "It became a total war that mobilized soldiers, civilians, economies, and propaganda.",
      "The war destroyed empires and created new political tensions."
    ],
    vocab: ["total war", "trench warfare", "militarism", "alliances", "armistice"],
    remember: "For World War I, focus on causes and consequences more than individual battles."
  },
  "7-1": {
    points: [
      "The Russian Revolution grew from war exhaustion, poverty, inequality, and anger at the tsar.",
      "The Bolsheviks promised peace, land, and bread and built a communist one-party state.",
      "The new USSR used planned economics and political repression to reshape society."
    ],
    vocab: ["Bolsheviks", "Lenin", "tsar", "communism", "USSR"],
    remember: "Lenin and the Bolsheviks connect World War I crisis to communist state building."
  },
  "7-2": {
    points: [
      "The Treaty of Versailles punished Germany and redrew parts of Europe.",
      "Mandates placed former Ottoman and German territories under Allied control.",
      "The peace settlement promised self-determination unevenly, creating resentment and instability."
    ],
    vocab: ["Treaty of Versailles", "mandate system", "self-determination", "League of Nations", "reparations"],
    remember: "The postwar settlement solved some problems but created many new ones."
  },
  "7-3": {
    points: [
      "The Great Depression began with financial collapse and spread through global trade and credit networks.",
      "Unemployment and hardship weakened faith in liberal capitalism.",
      "States responded with welfare programs, protectionism, militarism, or authoritarian politics."
    ],
    vocab: ["Great Depression", "stock market crash", "protectionism", "New Deal", "fascism"],
    remember: "The Depression helps explain why extremist politics gained support in the 1930s."
  },
  "7-4": {
    points: [
      "World War II grew from fascist expansion, militarism, appeasement, and unresolved World War I tensions.",
      "It was a global total war involving civilians, genocide, bombing, and mass mobilization.",
      "The war ended with the United States and Soviet Union as rival superpowers."
    ],
    vocab: ["fascism", "appeasement", "Axis Powers", "Allies", "atomic bomb"],
    remember: "World War II reshaped global power and set up the Cold War."
  },
  "7-5": {
    points: [
      "The Holocaust was the Nazi genocide of six million Jews and millions of other victims.",
      "It used state bureaucracy, racism, camps, forced labor, and mass murder.",
      "The Holocaust shaped postwar human rights law and genocide prevention debates."
    ],
    vocab: ["Holocaust", "antisemitism", "genocide", "concentration camp", "Nuremberg Trials"],
    remember: "This topic is about ideology, state power, and mass violence."
  },
  "8-0": {
    points: [
      "The United Nations was founded after World War II to promote peace and cooperation.",
      "It created forums for diplomacy, security, development, and human rights.",
      "Cold War rivalry often limited what the UN could actually do."
    ],
    vocab: ["United Nations", "Security Council", "General Assembly", "human rights", "peacekeeping"],
    remember: "The UN reflects hopes for collective security after two world wars."
  },
  "8-1": {
    points: [
      "The Cold War divided the world into U.S.-led capitalist and Soviet-led communist blocs.",
      "Competition included arms races, alliances, propaganda, espionage, and proxy wars.",
      "Nuclear weapons made direct superpower war extremely dangerous."
    ],
    vocab: ["Cold War", "NATO", "Warsaw Pact", "containment", "nuclear deterrence"],
    remember: "The Cold War was a global rivalry fought indirectly in many regions."
  },
  "8-2": {
    points: [
      "The Chinese Communist Revolution ended the Chinese Civil War and created the People's Republic of China.",
      "Mao's government used land reform, collectivization, and campaigns to transform society.",
      "China became a major communist power separate from the Soviet Union over time."
    ],
    vocab: ["Mao Zedong", "People's Republic of China", "land reform", "Great Leap Forward", "Cultural Revolution"],
    remember: "China's revolution is a major example of communism outside Europe."
  },
  "8-3": {
    points: [
      "Indian independence came from mass politics, anti-colonial organizing, and British weakness after World War II.",
      "Partition divided British India into India and Pakistan, causing migration and violence.",
      "Independence did not remove all religious, ethnic, or border tensions."
    ],
    vocab: ["Gandhi", "Indian National Congress", "Muslim League", "partition", "Pakistan"],
    remember: "Independence and partition should be studied together because freedom came with violence."
  },
  "8-4": {
    points: [
      "African decolonization used negotiation, protest, strikes, armed struggle, and international pressure.",
      "New states inherited colonial borders and economies built around extraction.",
      "Cold War powers often intervened in postcolonial conflicts and development."
    ],
    vocab: ["decolonization", "Ghana", "Algeria", "Kenya", "neocolonialism"],
    remember: "African independence was not one process; different colonies used different paths."
  },
  "8-5": {
    points: [
      "The Non-Aligned Movement gave newly independent states a way to avoid formal Cold War blocs.",
      "Bandung-era leaders promoted anti-colonialism, sovereignty, and development.",
      "Nonalignment did not always mean neutrality, but it resisted superpower control."
    ],
    vocab: ["Non-Aligned Movement", "Bandung Conference", "Nehru", "Nasser", "Tito"],
    remember: "Nonalignment was a political strategy for postcolonial states during the Cold War."
  },
  "9-0": {
    points: [
      "Postwar institutions such as the IMF, World Bank, GATT, and WTO promoted economic integration.",
      "They encouraged trade, loans, development projects, and market-oriented policies.",
      "Their effects were uneven, helping some economies while increasing debt or dependency in others."
    ],
    vocab: ["IMF", "World Bank", "GATT", "WTO", "free trade"],
    remember: "These institutions show how globalization was built through rules, money, and trade policy."
  },
  "9-1": {
    points: [
      "The Green Revolution used high-yield seeds, fertilizer, irrigation, and machinery to increase food production.",
      "It helped reduce famine risk in some places but favored farmers with access to land, water, and capital.",
      "It also created environmental issues such as chemical use and water strain."
    ],
    vocab: ["Green Revolution", "high-yield crops", "fertilizer", "irrigation", "Norman Borlaug"],
    remember: "The Green Revolution increased food production, but its benefits and costs were unequal."
  },
  "9-2": {
    points: [
      "Digital and communication technologies accelerated globalization by moving information instantly.",
      "Satellites, computers, phones, and the internet changed work, politics, education, and culture.",
      "These tools also increased surveillance, misinformation, and unequal access."
    ],
    vocab: ["internet", "satellite", "digital divide", "telecommunications", "automation"],
    remember: "Technology made the world more connected, but not everyone benefited equally."
  },
  "9-3": {
    points: [
      "Human rights and social movements challenged discrimination, authoritarianism, and old social hierarchies.",
      "Movements used protest, legal change, media, and international pressure.",
      "Civil rights, feminism, anti-apartheid, Indigenous rights, and LGBTQ rights all fit this larger pattern."
    ],
    vocab: ["human rights", "civil rights", "feminism", "anti-apartheid", "NGO"],
    remember: "Modern rights movements show how people used global language to demand local change."
  },
  "9-4": {
    points: [
      "Industrial growth and population change increased fossil fuel use, pollution, and resource pressure.",
      "Climate change became a global issue because causes and effects cross national borders.",
      "Environmental movements and international agreements tried to respond to shared ecological problems."
    ],
    vocab: ["climate change", "fossil fuels", "deforestation", "sustainability", "Paris Agreement"],
    remember: "Environmental change is a global consequence of industrialization and modern consumption."
  },
  "9-5": {
    points: [
      "Global popular culture spread through music, film, sports, tourism, migration, and the internet.",
      "Migration created diasporas that connected home countries and host societies.",
      "Cultural globalization can create shared trends, but it can also produce backlash over identity."
    ],
    vocab: ["popular culture", "diaspora", "migration", "cultural globalization", "remittances"],
    remember: "This topic is about how people, media, and culture move in the modern world."
  }
};

const floatingLayouts = [
  [
    { x: "2%", y: "6%", r: "-5deg" },
    { x: "34%", y: "30%", r: "4deg" },
    { x: "8%", y: "58%", r: "-2deg" }
  ],
  [
    { x: "30%", y: "2%", r: "5deg" },
    { x: "0%", y: "34%", r: "-4deg" },
    { x: "48%", y: "60%", r: "3deg" }
  ],
  [
    { x: "6%", y: "18%", r: "3deg" },
    { x: "42%", y: "6%", r: "-5deg" },
    { x: "24%", y: "62%", r: "5deg" }
  ]
];

const imageAssets = {
  songCity: { src: "assets/apw/song-china-city.jpg", label: "Song China city life", tone: "#00d7ff", focus: "50% 45%" },
  songMap: { src: "assets/wiki/song-dynasty.png", label: "Song dynasty", tone: "#00d7ff", focus: "50% 45%" },
  songScroll: { src: "assets/apw/song-china-city.jpg", label: "Song-era city scene", tone: "#73ff9b", focus: "50% 46%" },
  djenne: { src: "assets/wiki/great-mosque-djenne.jpg", label: "Great Mosque of Djenne", tone: "#73ff9b", focus: "50% 48%" },
  djenneWide: { src: "assets/apw/great-mosque-djenne.jpg", label: "Djenne mosque architecture", tone: "#73ff9b", focus: "50% 48%" },
  delhiSultanate: { src: "assets/wiki/delhi-sultanate.png", label: "Delhi Sultanate", tone: "#8d7cff", focus: "50% 50%" },
  swahiliCoast: { src: "assets/wiki/swahili-coast.png", label: "Swahili Coast", tone: "#00c2a8", focus: "50% 50%" },
  mansaMusa: { src: "assets/wiki/mansa-musa.jpg", label: "Mansa Musa", tone: "#ffb23f", focus: "50% 42%" },
  mansaManuscript: { src: "assets/apw/mansa-musa.jpg", label: "Mansa Musa manuscript", tone: "#ffb23f", focus: "50% 42%" },
  inca: { src: "assets/wiki/inca-empire.png", label: "Inca Empire", tone: "#8d7cff", focus: "50% 50%" },
  incaTerraces: { src: "assets/apw/inca-terraces.jpg", label: "Andean terrace farming", tone: "#73ff9b", focus: "50% 48%" },
  aztecEmpire: { src: "assets/wiki/aztec-empire.png", label: "Aztec Empire map", tone: "#ffb23f", focus: "50% 50%" },
  silkRoad: { src: "assets/wiki/silk-road.png", label: "Silk Road", tone: "#73ff9b", focus: "50% 50%" },
  caravan: { src: "assets/apw/silk-road-caravan.jpg", label: "Silk Road caravan", tone: "#ffb23f", focus: "50% 45%" },
  ibnBattuta: { src: "assets/wiki/ibn-battuta.jpg", label: "Ibn Battuta", tone: "#00d7ff", focus: "50% 42%" },
  mongolMap: { src: "assets/apw/mongol-empire-map.jpg", label: "Mongol Empire map", tone: "#8d7cff", focus: "50% 50%" },
  blackDeath: { src: "assets/wiki/black-death.png", label: "Black Death", tone: "#8d7cff", focus: "50% 42%" },
  blackDeathManuscript: { src: "assets/apw/black-death.jpg", label: "Plague manuscript", tone: "#ff5f57", focus: "50% 40%" },
  ottoman: { src: "assets/apw/ottoman-sultan.jpg", label: "Ottoman sultan", tone: "#8d7cff", focus: "45% 35%" },
  safavid: { src: "assets/wiki/safavid-iran.png", label: "Safavid Iran", tone: "#00d7ff", focus: "50% 50%" },
  safavidIsfahan: { src: "assets/apw/safavid-isfahan.jpg", label: "Safavid Isfahan", tone: "#00d7ff", focus: "50% 48%" },
  mughalEmpire: { src: "assets/wiki/mughal-empire.jpg", label: "Mughal Empire", tone: "#ffb23f", focus: "50% 45%" },
  tajMahal: { src: "assets/apw/safavid-isfahan.jpg", label: "Taj Mahal", tone: "#ffb23f", focus: "50% 46%" },
  qing: { src: "assets/wiki/qing-dynasty.png", label: "Qing dynasty", tone: "#73ff9b", focus: "50% 50%" },
  tokugawa: { src: "assets/wiki/tokugawa-shogunate.png", label: "Tokugawa shogunate", tone: "#73ff9b", focus: "50% 50%" },
  portugueseEmpire: { src: "assets/wiki/portuguese-empire.png", label: "Portuguese Empire", tone: "#00d7ff", focus: "50% 50%" },
  columbianExchange: { src: "assets/wiki/columbian-exchange.jpg", label: "Columbian Exchange", tone: "#73ff9b", focus: "50% 48%" },
  oceanEmpire: { src: "assets/wiki/portuguese-empire.png", label: "Imperial maritime conflict", tone: "#00d7ff", focus: "52% 40%" },
  potosi: { src: "assets/wiki/potosi.jpg", label: "Potosi silver mines", tone: "#ff4fd8", focus: "50% 48%" },
  manilaGalleon: { src: "assets/wiki/manila-galleon.jpg", label: "Manila galleon trade", tone: "#00d7ff", focus: "50% 50%" },
  silverEmpire: { src: "assets/wiki/potosi.jpg", label: "Silver and empire", tone: "#ff4fd8", focus: "50% 48%" },
  coercedLabor: { src: "assets/wiki/brookes-slave-ship.jpg", label: "Coerced labor and empire", tone: "#ff5f57", focus: "50% 42%" },
  atlanticSlaveTrade: { src: "assets/wiki/atlantic-slave-trade.jpg", label: "Atlantic slave trade", tone: "#ff5f57", focus: "50% 45%" },
  brookesSlaveShip: { src: "assets/wiki/brookes-slave-ship.jpg", label: "Slave ship diagram", tone: "#ff5f57", focus: "50% 45%" },
  americanRevolution: { src: "assets/wiki/american-revolution.jpg", label: "American Revolution", tone: "#2f80ed", focus: "50% 42%" },
  bastille: { src: "assets/wiki/bastille.jpg", label: "Storming of the Bastille", tone: "#ffb23f", focus: "50% 42%" },
  rightsOfMan: { src: "assets/wiki/rights-of-man.jpg", label: "Rights of Man", tone: "#00d7ff", focus: "50% 45%" },
  frenchRevolution: { src: "assets/wiki/french-revolution.jpg", label: "French Revolution", tone: "#ffb23f", focus: "48% 42%" },
  frenchRevolutionCrowd: { src: "assets/wiki/french-revolution.jpg", label: "French revolutionary crowd", tone: "#ffb23f", focus: "48% 42%" },
  haitian: { src: "assets/wiki/haitian-revolution.jpg", label: "Haitian Revolution", tone: "#ff5f57", focus: "50% 42%" },
  simonBolivar: { src: "assets/wiki/simon-bolivar.png", label: "Simon Bolivar", tone: "#ffb23f", focus: "50% 42%" },
  spinningJenny: { src: "assets/wiki/industrial-revolution.jpg", label: "Spinning jenny", tone: "#00c2a8", focus: "52% 50%" },
  industrialRevolution: { src: "assets/wiki/industrial-revolution.jpg", label: "Industrial Revolution", tone: "#00c2a8", focus: "50% 45%" },
  crystalPalace: { src: "assets/wiki/industrial-revolution.jpg", label: "Industrial exhibition", tone: "#73ff9b", focus: "50% 48%" },
  meiji: { src: "assets/wiki/meiji-restoration.jpg", label: "Meiji Restoration", tone: "#ffb23f", focus: "50% 42%" },
  opiumWar: { src: "assets/wiki/portuguese-empire.png", label: "Opium War", tone: "#8d7cff", focus: "52% 40%" },
  industrialMachine: { src: "assets/wiki/industrial-revolution.jpg", label: "Industrial machinery", tone: "#00c2a8", focus: "35% 50%" },
  scrambleAfrica: { src: "assets/wiki/scramble-for-africa.png", label: "Scramble for Africa", tone: "#ffb23f", focus: "50% 50%" },
  indianRebellion: { src: "assets/wiki/indian-rebellion.jpg", label: "Indian Rebellion", tone: "#ff5f57", focus: "50% 42%" },
  wwi: { src: "assets/wiki/wwi-trench.jpg", label: "World War I trench", tone: "#ff5f57", focus: "50% 42%" },
  treatyVersailles: { src: "assets/wiki/treaty-versailles.jpg", label: "Treaty of Versailles", tone: "#ffb23f", focus: "50% 42%" },
  vladimirLenin: { src: "assets/wiki/vladimir-lenin.jpg", label: "Vladimir Lenin", tone: "#ff5f57", focus: "50% 42%" },
  depression: { src: "assets/wiki/great-depression.jpg", label: "Great Depression", tone: "#8d7cff", focus: "50% 40%" },
  holocaust: { src: "assets/wiki/the-holocaust.jpg", label: "Holocaust memorial context", tone: "#ff5f57", focus: "50% 44%" },
  worldWarII: { src: "assets/wiki/world-war-ii.jpg", label: "World War II", tone: "#ff5f57", focus: "50% 44%" },
  berlinWall: { src: "assets/wiki/cold-war.png", label: "Berlin Wall", tone: "#00d7ff", focus: "50% 42%" },
  unitedNations: { src: "assets/wiki/un-general-assembly.jpg", label: "United Nations", tone: "#2f80ed", focus: "50% 45%" },
  coldWar: { src: "assets/wiki/cold-war.png", label: "Cold War", tone: "#2f80ed", focus: "50% 50%" },
  maoZedong: { src: "assets/wiki/mao-zedong.jpg", label: "Mao Zedong", tone: "#ff5f57", focus: "50% 42%" },
  partition: { src: "assets/wiki/partition-india.jpg", label: "Partition of India", tone: "#ffb23f", focus: "50% 40%" },
  nonAligned: { src: "assets/wiki/non-aligned.png", label: "Non-Aligned Movement", tone: "#73ff9b", focus: "50% 50%" },
  bandungConference: { src: "assets/wiki/bandung-conference.png", label: "Bandung Conference", tone: "#73ff9b", focus: "50% 50%" },
  globalization: { src: "assets/wiki/globalization.png", label: "Globalization", tone: "#2f80ed", focus: "50% 50%" },
  greenRevolution: { src: "assets/wiki/green-revolution.png", label: "Green Revolution", tone: "#73ff9b", focus: "50% 50%" },
  sputnik: { src: "assets/wiki/sputnik.jpg", label: "Satellite technology", tone: "#00d7ff", focus: "50% 50%" },
  humanRights: { src: "assets/wiki/human-rights.jpg", label: "Human rights", tone: "#ff4fd8", focus: "50% 46%" },
  containerShip: { src: "assets/wiki/container-ship.jpg", label: "Container shipping", tone: "#00c2a8", focus: "50% 45%" },
  climate: { src: "assets/wiki/climate-change.png", label: "Climate change", tone: "#73ff9b", focus: "50% 50%" }
};

const assetPool = Object.values(imageAssets);

const topicImageSets = {
  "1-0": [imageAssets.songCity, imageAssets.songMap, imageAssets.songScroll],
  "1-1": [imageAssets.djenne, imageAssets.djenneWide, imageAssets.mansaManuscript],
  "1-2": [imageAssets.delhiSultanate, imageAssets.tajMahal, imageAssets.safavidIsfahan],
  "1-3": [imageAssets.mansaMusa, imageAssets.mansaManuscript, imageAssets.djenneWide],
  "1-4": [imageAssets.swahiliCoast, imageAssets.djenne, imageAssets.caravan],
  "1-5": [imageAssets.aztecEmpire, imageAssets.inca, imageAssets.incaTerraces],
  "2-0": [imageAssets.silkRoad, imageAssets.caravan, imageAssets.mongolMap],
  "2-1": [imageAssets.mongolMap, imageAssets.caravan, imageAssets.silkRoad],
  "2-2": [imageAssets.caravan, imageAssets.silkRoad, imageAssets.containerShip],
  "2-3": [imageAssets.mansaManuscript, imageAssets.djenneWide, imageAssets.caravan],
  "2-4": [imageAssets.ibnBattuta, imageAssets.caravan, imageAssets.silkRoad],
  "2-5": [imageAssets.blackDeath, imageAssets.blackDeathManuscript, imageAssets.silkRoad],
  "3-0": [imageAssets.ottoman, imageAssets.safavidIsfahan, imageAssets.oceanEmpire],
  "3-1": [imageAssets.safavid, imageAssets.safavidIsfahan, imageAssets.ottoman],
  "3-2": [imageAssets.mughalEmpire, imageAssets.tajMahal, imageAssets.safavidIsfahan],
  "3-3": [imageAssets.qing, imageAssets.songMap, imageAssets.safavid],
  "3-4": [imageAssets.mongolMap, imageAssets.qing, imageAssets.ottoman],
  "3-5": [imageAssets.tokugawa, imageAssets.qing, imageAssets.songMap],
  "4-0": [imageAssets.portugueseEmpire, imageAssets.oceanEmpire, imageAssets.silkRoad],
  "4-1": [imageAssets.columbianExchange, imageAssets.aztecEmpire, imageAssets.inca],
  "4-2": [imageAssets.aztecEmpire, imageAssets.inca, imageAssets.oceanEmpire],
  "4-3": [imageAssets.atlanticSlaveTrade, imageAssets.brookesSlaveShip, imageAssets.mansaManuscript],
  "4-4": [imageAssets.potosi, imageAssets.manilaGalleon, imageAssets.qing],
  "4-5": [imageAssets.manilaGalleon, imageAssets.portugueseEmpire, imageAssets.containerShip],
  "5-0": [imageAssets.rightsOfMan, imageAssets.bastille, imageAssets.frenchRevolution],
  "5-1": [imageAssets.americanRevolution, imageAssets.rightsOfMan, imageAssets.frenchRevolution],
  "5-2": [imageAssets.frenchRevolution, imageAssets.bastille, imageAssets.rightsOfMan],
  "5-3": [imageAssets.haitian, imageAssets.atlanticSlaveTrade, imageAssets.frenchRevolution],
  "5-4": [imageAssets.simonBolivar, imageAssets.americanRevolution, imageAssets.frenchRevolution],
  "5-5": [imageAssets.industrialRevolution, imageAssets.spinningJenny, imageAssets.crystalPalace],
  "6-0": [imageAssets.crystalPalace, imageAssets.industrialRevolution, imageAssets.spinningJenny],
  "6-1": [imageAssets.meiji, imageAssets.qing, imageAssets.crystalPalace],
  "6-2": [imageAssets.scrambleAfrica, imageAssets.oceanEmpire, imageAssets.atlanticSlaveTrade],
  "6-3": [imageAssets.opiumWar, imageAssets.qing, imageAssets.oceanEmpire],
  "6-4": [imageAssets.indianRebellion, imageAssets.tajMahal, imageAssets.partition],
  "6-5": [imageAssets.containerShip, imageAssets.crystalPalace, imageAssets.atlanticSlaveTrade],
  "7-0": [imageAssets.wwi, imageAssets.ottoman, imageAssets.mongolMap],
  "7-1": [imageAssets.vladimirLenin, imageAssets.wwi, imageAssets.depression],
  "7-2": [imageAssets.treatyVersailles, imageAssets.wwi, imageAssets.vladimirLenin],
  "7-3": [imageAssets.depression, imageAssets.industrialMachine, imageAssets.containerShip],
  "7-4": [imageAssets.worldWarII, imageAssets.holocaust, imageAssets.berlinWall],
  "7-5": [imageAssets.holocaust, imageAssets.wwi, imageAssets.depression],
  "8-0": [imageAssets.unitedNations, imageAssets.coldWar, imageAssets.humanRights],
  "8-1": [imageAssets.coldWar, imageAssets.berlinWall, imageAssets.sputnik],
  "8-2": [imageAssets.maoZedong, imageAssets.coldWar, imageAssets.qing],
  "8-3": [imageAssets.partition, imageAssets.indianRebellion, imageAssets.simonBolivar],
  "8-4": [imageAssets.scrambleAfrica, imageAssets.nonAligned, imageAssets.mansaMusa],
  "8-5": [imageAssets.bandungConference, imageAssets.nonAligned, imageAssets.coldWar],
  "9-0": [imageAssets.globalization, imageAssets.containerShip, imageAssets.coldWar],
  "9-1": [imageAssets.greenRevolution, imageAssets.incaTerraces, imageAssets.containerShip],
  "9-2": [imageAssets.sputnik, imageAssets.globalization, imageAssets.containerShip],
  "9-3": [imageAssets.humanRights, imageAssets.nonAligned, imageAssets.partition],
  "9-4": [imageAssets.climate, imageAssets.greenRevolution, imageAssets.containerShip],
  "9-5": [imageAssets.globalization, imageAssets.containerShip, imageAssets.partition]
};

const searchHints = [
  { terms: ["lenin", "bolshevik", "russian revolution", "stalin", "ussr", "communism", "versailles", "fascism", "hitler", "holocaust", "world war", "depression"], unit: 7 },
  { terms: ["cold war", "mao", "gandhi", "partition", "decolonization", "nonaligned", "non-aligned", "proxy", "nuclear", "berlin"], unit: 8 },
  { terms: ["internet", "climate", "globalization", "wto", "imf", "world bank", "green revolution", "digital", "container"], unit: 9 },
  { terms: ["industrial", "imperialism", "meiji", "opium", "raj", "indentured", "migration", "social darwinism"], unit: 6 },
  { terms: ["enlightenment", "robespierre", "haiti", "haitian", "american revolution", "french revolution", "nationalism", "liberalism", "socialism"], unit: 5 },
  { terms: ["columbus", "columbian", "silver", "potosi", "middle passage", "slave trade", "mercantilism", "joint-stock", "plantation"], unit: 4 },
  { terms: ["ottoman", "safavid", "mughal", "qing", "russia", "tokugawa", "gunpowder", "janissary", "zamindar"], unit: 3 },
  { terms: ["mongol", "silk road", "ibn battuta", "marco polo", "black death", "indian ocean", "trans-saharan", "caravan"], unit: 2 },
  { terms: ["song", "china", "mali", "mansa musa", "swahili", "islam", "buddhism", "hinduism", "aztec", "mexica", "inca"], unit: 1 }
];

const timelineList = document.querySelector("#timelineList");
const unitNav = document.querySelector("#unitNav");
const panelUnit = document.querySelector("#panelUnit");
const panelTitle = document.querySelector("#panelTitle");
const panelText = document.querySelector("#panelText");
const panelRange = document.querySelector("#panelRange");
const panelSkill = document.querySelector("#panelSkill");
const panelPoints = document.querySelector("#panelPoints");
const panelVocab = document.querySelector("#panelVocab");
const panelRemember = document.querySelector("#panelRemember");
const panelImages = document.querySelector("#panelImages");
const imageCloud = document.querySelector("#imageCloud");
const lineProgress = document.querySelector("#lineProgress");
const expandAllButton = document.querySelector("#expandAll");
const themeToggle = document.querySelector("#themeToggle");
const searchForm = document.querySelector("#searchForm");
const timelineSearch = document.querySelector("#timelineSearch");
const searchResult = document.querySelector("#searchResult");
const readingPanel = document.querySelector(".reading-panel");
const lineWrap = document.querySelector(".line-wrap");
let pinnedCard = null;

function iconSvg(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.globe}</svg>`;
}

function topicVisuals(unit, topicTitle, topicIndex) {
  const assigned = topicImageSets[`${unit.id}-${topicIndex}`] || [];
  const visuals = [];

  [...assigned, ...assetPool].forEach((image) => {
    if (image && visuals.length < 3 && !visuals.some((visual) => visual.src === image.src)) {
      visuals.push(image);
    }
  });

  return visuals;
}

function visualMarkup(visuals, layout) {
  return visuals
    .map(
      (visual, index) => `
      <figure
        class="floating-image"
        data-label="${visual.label}"
        style="--tone:${visual.tone};--x:${layout[index].x};--y:${layout[index].y};--r:${layout[index].r};--focus:${visual.focus}"
      >
        <img src="${visual.src}" alt="${visual.label}" loading="lazy" />
        <figcaption>${visual.label}</figcaption>
      </figure>
    `
    )
    .join("");
}

function render() {
  unitNav.innerHTML = units
    .map((unit) => `<a href="#unit-${unit.id}" title="${unit.title}" data-unit-link="${unit.id}">Unit ${unit.id}</a>`)
    .join("");

  timelineList.innerHTML = units
    .map(
      (unit) => `
      <section class="unit-block" id="unit-${unit.id}" data-unit="${unit.id}" style="--accent:${unit.accent}">
        <div class="unit-heading">
          <p class="eyebrow">Unit ${unit.id} - ${unit.years}</p>
          <h2>${unit.title}</h2>
          <p>${unit.summary}</p>
        </div>
        ${unit.events
          .map(
            ([title, date, summary, skill], index) => `
              <article
                class="event-card"
                tabindex="0"
                data-unit="${unit.id}"
                data-index="${index}"
                style="--accent:${unit.accent}"
                aria-label="${title}, ${date}"
              >
                <span class="timeline-dot" aria-hidden="true"></span>
                <span class="event-icon">${iconSvg(unit.icon)}</span>
                <div class="event-body">
                  <p class="event-date">${date}</p>
                  <h3 class="event-title">${title}</h3>
                  <p class="event-summary">${summary}</p>
                </div>
              </article>
            `
          )
          .join("")}
      </section>
    `
    )
    .join("");
}

function setActive(card) {
  if (!card) return;
  document.querySelectorAll(".event-card.active").forEach((item) => item.classList.remove("active"));
  card.classList.add("active");

  const unit = units.find((candidate) => candidate.id === Number(card.dataset.unit));
  const topicIndex = Number(card.dataset.index);
  const [title, date, summary, skill] = unit.events[topicIndex];
  const notes = topicDetails[`${unit.id}-${topicIndex}`] || studyNotes[unit.id];

  panelUnit.textContent = `Unit ${unit.id} - ${unit.title}`;
  panelTitle.textContent = title;
  panelText.textContent = summary;
  panelRange.textContent = date;
  panelSkill.textContent = skill;
  panelUnit.style.color = unit.accent;
  readingPanel.style.setProperty("--accent", unit.accent);
  panelPoints.innerHTML = notes.points.map((point) => `<li>${point}</li>`).join("");
  panelVocab.innerHTML = notes.vocab.map((word) => `<span>${word}</span>`).join("");
  panelRemember.textContent = notes.remember;

  const layout = floatingLayouts[topicIndex % floatingLayouts.length];
  const visuals = topicVisuals(unit, title, topicIndex);
  const markup = visualMarkup(visuals, layout);
  imageCloud.style.setProperty("--accent", unit.accent);
  imageCloud.innerHTML = markup;
  panelImages.innerHTML = markup;
  positionImageCloud(card);
  positionReadingPanel(card);
  imageCloud.classList.add("show");
}

function positionReadingPanel(card) {
  if (window.matchMedia("(max-width: 720px), (pointer: coarse), (hover: none)").matches) {
    readingPanel.style.setProperty("--panel-offset", "0px");
    return;
  }
  const panelRect = readingPanel.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  const desiredCenter = cardRect.top + cardRect.height / 2;
  const currentCenter = panelRect.top + panelRect.height / 2;
  const offset = Math.min(Math.max(desiredCenter - currentCenter, -72), 180);
  readingPanel.style.setProperty("--panel-offset", `${offset}px`);
}

function positionImageCloud(card) {
  if (window.matchMedia("(max-width: 720px), (pointer: coarse), (hover: none)").matches || !lineWrap) {
    imageCloud.style.left = "";
    imageCloud.style.top = "";
    return;
  }
  const wrapRect = lineWrap.getBoundingClientRect();
  const rect = card.getBoundingClientRect();
  const cloudWidth = imageCloud.offsetWidth || Math.min(window.innerWidth * 0.28, 420);
  const cloudHeight = imageCloud.offsetHeight || 360;
  const cardLeft = rect.left - wrapRect.left;
  const cardTop = rect.top - wrapRect.top;
  const desiredLeft = cardLeft + rect.width + 22;
  const maxLeft = Math.max(cardLeft + 18, lineWrap.clientWidth - cloudWidth - 4);
  const left = Math.min(desiredLeft, maxLeft);
  const maxTop = Math.max(0, lineWrap.offsetHeight - cloudHeight - 16);
  const top = Math.min(Math.max(cardTop - 42, 0), maxTop);
  imageCloud.style.left = `${left}px`;
  imageCloud.style.top = `${top}px`;
}

function updateProgress() {
  const line = document.querySelector(".timeline-line");
  if (!line || line.offsetHeight <= 0) return;
  const lineTop = line.getBoundingClientRect().top + window.scrollY;
  const lineHeight = line.offsetHeight;
  const viewportAnchor = window.innerHeight * 0.55;
  const progress = Math.min(Math.max((window.scrollY + viewportAnchor - lineTop) / lineHeight, 0), 1);
  lineProgress.style.height = `${progress * 100}%`;
}

function updateActiveNav(unitId) {
  document.querySelectorAll("[data-unit-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.unitLink === String(unitId));
  });
}

function setPinned(card) {
  if (pinnedCard === card) {
    card.classList.remove("locked");
    pinnedCard = null;
    return;
  }
  pinnedCard = card;
  document.querySelectorAll(".event-card.locked").forEach((item) => item.classList.remove("locked"));
  card.classList.add("locked");
  setActive(card);
}

function scoreUnit(query, unit) {
  const unitTopicDetails = Object.entries(topicDetails)
    .filter(([key]) => key.startsWith(`${unit.id}-`))
    .flatMap(([, detail]) => [...detail.points, ...detail.vocab, detail.remember]);
  const text = [
    unit.title,
    unit.summary,
    ...unit.events.flatMap(([title, date, summary, skill]) => [title, date, summary, skill]),
    ...studyNotes[unit.id].vocab,
    ...studyNotes[unit.id].points,
    ...unitTopicDetails
  ]
    .join(" ")
    .toLowerCase();
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return words.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
}

function inferSearchTarget(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  const hinted = searchHints.find((hint) => hint.terms.some((term) => normalized.includes(term)));
  if (hinted) {
    return { unit: units.find((unit) => unit.id === hinted.unit), reason: "keyword match" };
  }

  const ranked = units
    .map((unit) => ({ unit, score: scoreUnit(normalized, unit) }))
    .sort((a, b) => b.score - a.score);
  return ranked[0].score > 0 ? { unit: ranked[0].unit, reason: "timeline text match" } : { unit: units[0], reason: "best guess" };
}

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
    themeToggle.querySelector("span").textContent = nextTheme === "dark" ? "Light" : "Dark";
  }
  try {
    localStorage.setItem("apworld.theme.v2", nextTheme);
  } catch (error) {
    // Local files can be opened with storage disabled in some browsers.
  }
}

function initialTheme() {
  try {
    return localStorage.getItem("apworld.theme.v2") || "light";
  } catch (error) {
    return "light";
  }
}

applyTheme(initialTheme());
render();

timelineList.addEventListener("pointerover", (event) => {
  if (pinnedCard) return;
  const card = event.target.closest(".event-card");
  if (card) setActive(card);
});

timelineList.addEventListener("focusin", (event) => {
  if (pinnedCard) return;
  const card = event.target.closest(".event-card");
  if (card) setActive(card);
});

timelineList.addEventListener("click", (event) => {
  const card = event.target.closest(".event-card");
  if (card) setPinned(card);
  requestAnimationFrame(updateProgress);
});

imageCloud.addEventListener(
  "error",
  (event) => {
    const image = event.target.closest("img");
    const frame = event.target.closest(".floating-image");
    if (image && frame) frame.classList.add("image-error");
  },
  true
);

panelImages.addEventListener(
  "error",
  (event) => {
    const image = event.target.closest("img");
    const frame = event.target.closest(".floating-image");
    if (image && frame) frame.classList.add("image-error");
  },
  true
);

expandAllButton.addEventListener("click", () => {
  timelineList.classList.toggle("expanded");
  const expanded = timelineList.classList.contains("expanded");
  expandAllButton.textContent = expanded ? "Collapse all" : "Expand all";
});

themeToggle?.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const target = inferSearchTarget(timelineSearch.value);
  if (!target) return;

  const firstCard = document.querySelector(`#unit-${target.unit.id} .event-card`);
  pinnedCard?.classList.remove("locked");
  pinnedCard = null;
  setActive(firstCard);
  searchResult.textContent = `Best match: Unit ${target.unit.id}, ${target.unit.title}.`;
  document.querySelector(`#unit-${target.unit.id}`).scrollIntoView({ behavior: "smooth", block: "start" });
  requestAnimationFrame(updateProgress);
});

const unitObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) updateActiveNav(visible.target.dataset.unit);
  },
  { rootMargin: "-15% 0px -55% 0px", threshold: [0.08, 0.18, 0.35] }
);

document.querySelectorAll(".unit-block").forEach((unit) => unitObserver.observe(unit));
document.querySelector(".event-card")?.classList.add("active");
setActive(document.querySelector(".event-card"));
updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener(
  "scroll",
  () => {
    const active = document.querySelector(".event-card.active");
    if (active) {
      positionImageCloud(active);
      positionReadingPanel(active);
    }
  },
  { passive: true }
);
window.addEventListener("resize", () => {
  updateProgress();
  const active = document.querySelector(".event-card.active");
  if (active) {
    positionImageCloud(active);
    positionReadingPanel(active);
  }
});

