const timelineEvents = [
  {
    year: "1206",
    title: "Rise of the Mongol Empire",
    period: "p1",
    region: "Asia",
    theme: "Empire",
    summary: "Temujin becomes Chinggis Khan and builds a vast land empire that intensifies Eurasian exchange."
  },
  {
    year: "1271-1295",
    title: "Yuan Dynasty in China",
    period: "p1",
    region: "Asia",
    theme: "State-building",
    summary: "Mongol rule connects China more tightly to Afro-Eurasian networks while using foreign administrators."
  },
  {
    year: "c. 1300",
    title: "Indian Ocean Trade Expands",
    period: "p1",
    region: "Global",
    theme: "Trade",
    summary: "Monsoon knowledge, diasporic communities, and commercial cities support exchange from East Africa to Southeast Asia."
  },
  {
    year: "1347-1351",
    title: "Black Death",
    period: "p1",
    region: "Global",
    theme: "Disease",
    summary: "Pandemic disease spreads across trade routes, reshaping labor, social structures, and economies."
  },
  {
    year: "c. 1450",
    title: "Maritime Exploration Accelerates",
    period: "p2",
    region: "Europe",
    theme: "Technology",
    summary: "Caravels, cartography, and state sponsorship help European kingdoms enter long-distance oceanic networks."
  },
  {
    year: "1492",
    title: "Columbian Exchange Begins",
    period: "p2",
    region: "Americas",
    theme: "Exchange",
    summary: "The linking of the Americas with Afro-Eurasia transforms diets, environments, labor systems, and populations."
  },
  {
    year: "1517",
    title: "Protestant Reformation",
    period: "p2",
    region: "Europe",
    theme: "Belief",
    summary: "Religious reform challenges Catholic authority and contributes to political conflict and state consolidation."
  },
  {
    year: "1526",
    title: "Mughal Empire Founded",
    period: "p2",
    region: "Asia",
    theme: "Empire",
    summary: "The Mughals use gunpowder, bureaucracy, and monumental architecture to rule a diverse South Asian empire."
  },
  {
    year: "1571",
    title: "Manila Galleons Link Markets",
    period: "p2",
    region: "Global",
    theme: "Trade",
    summary: "Spanish ships connect American silver, Asian goods, and Pacific commerce through the Philippines."
  },
  {
    year: "1600s",
    title: "Atlantic Slave Trade Expands",
    period: "p2",
    region: "Africa",
    theme: "Labor",
    summary: "European demand for plantation labor fuels forced migration and transforms societies across the Atlantic world."
  },
  {
    year: "1750s",
    title: "Industrialization Begins in Britain",
    period: "p3",
    region: "Europe",
    theme: "Technology",
    summary: "Coal, steam power, textile production, and capital investment launch sustained industrial growth."
  },
  {
    year: "1776-1804",
    title: "Atlantic Revolutions",
    period: "p3",
    region: "Americas",
    theme: "Revolution",
    summary: "Revolutionary movements challenge monarchy, slavery, and colonial rule while spreading new political ideas."
  },
  {
    year: "1839-1842",
    title: "First Opium War",
    period: "p3",
    region: "Asia",
    theme: "Imperialism",
    summary: "British military pressure forces Qing concessions and illustrates industrial-era imbalances in power."
  },
  {
    year: "1857",
    title: "Indian Rebellion",
    period: "p3",
    region: "Asia",
    theme: "Resistance",
    summary: "A major uprising against the British East India Company leads to direct British Crown rule in India."
  },
  {
    year: "1868",
    title: "Meiji Restoration",
    period: "p3",
    region: "Asia",
    theme: "State-building",
    summary: "Japan centralizes power, industrializes, reforms the military, and becomes an imperial power."
  },
  {
    year: "1884-1885",
    title: "Berlin Conference",
    period: "p3",
    region: "Africa",
    theme: "Imperialism",
    summary: "European powers formalize rules for colonizing Africa, accelerating the Scramble for Africa."
  },
  {
    year: "1914-1918",
    title: "World War I",
    period: "p4",
    region: "Global",
    theme: "Conflict",
    summary: "Industrial warfare, empire, nationalism, and alliances produce a global conflict and political upheaval."
  },
  {
    year: "1917",
    title: "Russian Revolution",
    period: "p4",
    region: "Europe",
    theme: "Revolution",
    summary: "Bolshevik victory creates the first major communist state and reshapes twentieth-century ideology."
  },
  {
    year: "1929",
    title: "Great Depression",
    period: "p4",
    region: "Global",
    theme: "Economy",
    summary: "A worldwide economic crisis increases state intervention, social strain, and political extremism."
  },
  {
    year: "1939-1945",
    title: "World War II",
    period: "p4",
    region: "Global",
    theme: "Conflict",
    summary: "Total war, genocide, occupation, and mobilization transform global power and accelerate decolonization."
  },
  {
    year: "1945",
    title: "United Nations Founded",
    period: "p4",
    region: "Global",
    theme: "Institutions",
    summary: "Postwar states create new institutions for diplomacy, development, finance, and collective security."
  },
  {
    year: "1947",
    title: "Partition of India",
    period: "p4",
    region: "Asia",
    theme: "Decolonization",
    summary: "British India becomes independent India and Pakistan amid mass migration and communal violence."
  },
  {
    year: "1949",
    title: "Chinese Communist Revolution",
    period: "p4",
    region: "Asia",
    theme: "Revolution",
    summary: "The People's Republic of China forms after civil war, changing Cold War politics in Asia."
  },
  {
    year: "1955",
    title: "Bandung Conference",
    period: "p4",
    region: "Asia",
    theme: "Decolonization",
    summary: "Newly independent Asian and African states promote nonalignment and anti-colonial cooperation."
  },
  {
    year: "1960",
    title: "Year of Africa",
    period: "p4",
    region: "Africa",
    theme: "Decolonization",
    summary: "Seventeen African countries gain independence, showing the rapid weakening of European empires."
  },
  {
    year: "1989-1991",
    title: "Cold War Ends",
    period: "p4",
    region: "Global",
    theme: "Ideology",
    summary: "Revolutions in Eastern Europe and the Soviet collapse end the bipolar world order."
  },
  {
    year: "1995",
    title: "World Trade Organization Founded",
    period: "p4",
    region: "Global",
    theme: "Globalization",
    summary: "The WTO reflects deeper trade integration and debates over globalization, labor, and sovereignty."
  }
];

const searchInput = document.querySelector("#timelineSearch");
const periodFilter = document.querySelector("#periodFilter");
const regionFilter = document.querySelector("#regionFilter");
const list = document.querySelector("#timelineList");

[searchInput, periodFilter, regionFilter].forEach((control) => {
  control?.addEventListener("input", renderTimeline);
});

renderTimeline();

function renderTimeline() {
  const search = (searchInput?.value || "").trim().toLowerCase();
  const period = periodFilter?.value || "all";
  const region = regionFilter?.value || "all";

  const filtered = timelineEvents.filter((event) => {
    const matchesPeriod = period === "all" || event.period === period;
    const matchesRegion = region === "all" || event.region === region;
    const haystack = `${event.year} ${event.title} ${event.region} ${event.theme} ${event.summary}`.toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    return matchesPeriod && matchesRegion && matchesSearch;
  });

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-state in-panel">
        <h2>No timeline events found.</h2>
        <p>Try a broader period, region, or search term.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map((event) => `
    <article class="timeline-event ${event.period}">
      <div class="timeline-date">${escapeHtml(event.year)}</div>
      <div class="timeline-content">
        <div class="question-meta">
          <span>${periodLabel(event.period)}</span>
          <span>${escapeHtml(event.region)}</span>
          <span>${escapeHtml(event.theme)}</span>
        </div>
        <h2>${escapeHtml(event.title)}</h2>
        <p>${escapeHtml(event.summary)}</p>
      </div>
    </article>
  `).join("");
}

function periodLabel(period) {
  return {
    p1: "Period 1",
    p2: "Period 2",
    p3: "Period 3",
    p4: "Period 4"
  }[period] || "AP World";
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
