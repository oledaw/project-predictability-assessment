// ─────────────────────────────────────────────
// data.js — all content lives here; no logic, no DOM
// ─────────────────────────────────────────────

export const THRESHOLDS = {
  SCORE_LOW:      4.2,  // overall avg >= this → low risk
  SCORE_MEDIUM:   3.4,
  SCORE_HIGH:     2.5,
  WEAK_AREA:      4.0,  // area avg below → show in risk table
  CRITICAL_AREA:  2.5,  // area avg below → "blocks" impact
  GLOBAL_RISK:    3.0,  // overall avg below → add global risk row
  PLAN_BUFFER_PCT: 15,  // % used in planning tooltip copy
};

/** Display order matters — sections render in this sequence */
export const AREAS = [
  { id: 'requirements', label: 'Zakres i wymagania',      icon: '📋' },
  { id: 'tech',         label: 'Technologia',             icon: '⚙️' },
  { id: 'deps',         label: 'Zależności zewnętrzne',   icon: '🔗' },
  { id: 'team',         label: 'Zespół',                  icon: '👥' },
  { id: 'planning',     label: 'Planowanie i estymacje',  icon: '📅' },
  { id: 'risk',         label: 'Zarządzanie ryzykiem',    icon: '⚠️' },
];

export const QUESTIONS = [
  // ── Zakres i wymagania ──────────────────────
  {
    area: 'requirements', name: 'q1',
    label:   'Wymagania są jasno określone i zatwierdzone',
    context: 'Wiesz co ma powstać i klient to potwierdził na piśmie.',
    tooltip: 'Czy interesariusze podpisali się pod zakresem? Czy nie ma obszarów „do ustalenia" które mogą zmienić zakres w trakcie?',
    options: [
      { value: 5, text: '✅ Tak, zakres jest zamknięty' },
      { value: 4, text: '🟦 Prawie – zostały drobne szczegóły' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Są znaczące luki do wyjaśnienia' },
      { value: 1, text: '❌ Wymagania są płynne lub nie istnieją' },
    ],
  },
  {
    area: 'requirements', name: 'q2',
    label:   'Zmiany zakresu przechodzą przez formalną akceptację',
    context: 'Nikt nie dorzuca zadań „przy okazji" bez konsekwencji dla harmonogramu.',
    tooltip: 'Czy każda zmiana zakresu jest analizowana pod kątem wpływu na termin i budżet, a dopiero potem akceptowana przez sponsora?',
    options: [
      { value: 5, text: '✅ Tak, mamy działający change management' },
      { value: 4, text: '🟦 Prawie – proces jest, bywa omijany' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Zmiany wchodzą bez analizy wpływu' },
      { value: 1, text: '❌ Brak jakiegokolwiek procesu kontroli zmian' },
    ],
  },

  // ── Technologia ─────────────────────────────
  {
    area: 'tech', name: 'q3',
    label:   'Zespół zna używane technologie z poprzednich projektów',
    context: 'Nikt nie uczy się kluczowej technologii dopiero w trakcie projektu.',
    tooltip: 'Chodzi o praktyczne doświadczenie – frameworki, bazy danych, platformy chmurowe. Nie wystarczy że ktoś widział tutorial.',
    options: [
      { value: 5, text: '✅ Tak, znamy stos z wcześniejszych projektów' },
      { value: 4, text: '🟦 Prawie – 1–2 elementy są nowe, reszta znana' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Znaczna część technologii jest dla nas nowa' },
      { value: 1, text: '❌ Nie znamy wybranych technologii' },
    ],
  },
  {
    area: 'tech', name: 'q4',
    label:   'Wiemy że rozwiązanie zadziała – nie musimy tego sprawdzać',
    context: 'Architektura jest zweryfikowana – nie budujemy na nieznanych założeniach.',
    tooltip: 'Czy są obszary gdzie nie wiadomo czy dane podejście techniczne w ogóle jest wykonalne? Np. nieznane ograniczenia API, niesprawdzone integracje.',
    options: [
      { value: 5, text: '✅ Tak, podejście jest sprawdzone' },
      { value: 4, text: '🟦 Prawie – drobne obszary do szybkiej weryfikacji' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Kilka istotnych obszarów niezweryfikowanych' },
      { value: 1, text: '❌ Kluczowe elementy są całkowicie niezbadane' },
    ],
  },

  // ── Zależności zewnętrzne ───────────────────
  {
    area: 'deps', name: 'q5',
    label:   'Projekt nie jest blokowany przez zewnętrznych dostawców',
    context: 'Jeśli ktoś zewnętrzny nie dostarczy – projekt nie stanie.',
    tooltip: 'Zewnętrzni dostawcy to: firmy trzecie, systemy legacy innej organizacji, API zewnętrzne, regulator. Jeśli są – czy masz SLA i kogoś do eskalacji?',
    options: [
      { value: 5, text: '✅ Tak, brak krytycznych zależności zewnętrznych' },
      { value: 4, text: '🟦 Są zależności, ale objęte SLA i regularnym kontaktem' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Są krytyczne zależności bez żadnych gwarancji' },
      { value: 1, text: '❌ Projekt silnie zależny od niekontrolowanych stron trzecich' },
    ],
  },
  {
    area: 'deps', name: 'q6',
    label:   'Współpraca z innymi zespołami przebiega bez zaskoczeń',
    context: 'Inne zespoły nie blokują waszej pracy przez brak odpowiedzi lub zmianę priorytetów.',
    tooltip: 'Czy inne zespoły traktują wasze potrzeby priorytetowo? Czy macie zdefiniowane punkty styku (np. kontrakty API, regularne synce)?',
    options: [
      { value: 5, text: '✅ Tak, współpraca jest przewidywalna i ustrukturyzowana' },
      { value: 4, text: '🟦 Drobne tarcia, ale nic co nas blokuje' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Częste opóźnienia lub niejasne granice odpowiedzialności' },
      { value: 1, text: '❌ Chaotyczna współpraca, nie wiemy na kogo możemy liczyć' },
    ],
  },

  // ── Zespół ──────────────────────────────────
  {
    area: 'team', name: 'q7',
    label:   'Zespół robił już podobne projekty',
    context: 'Macie punkt odniesienia – wiecie czego się spodziewać i gdzie zwykle pojawiają się problemy.',
    tooltip: 'Chodzi o podobną skalę, złożoność i domenę. Lider, architekt i kluczowi developerzy – nie tylko jedna osoba w zespole.',
    options: [
      { value: 5, text: '✅ Tak, mamy doświadczenie z podobnymi projektami' },
      { value: 4, text: '🟦 Prawie – większość zespołu ma odpowiedni background' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Tylko 1–2 osoby mają doświadczenie w tym typie projektu' },
      { value: 1, text: '❌ Zespół nie robił podobnych projektów' },
    ],
  },
  {
    area: 'team', name: 'q8',
    label:   'Skład zespołu nie zmieni się znacząco w trakcie projektu',
    context: 'Nie planujecie rotacji kluczowych osób i wiedza nie leży tylko u jednej osoby.',
    tooltip: 'Bus factor – czy gdyby jedna kluczowa osoba odeszła jutro, projekt by stanął? Czy wiedza jest rozłożona na kilka osób?',
    options: [
      { value: 5, text: '✅ Tak, zespół jest stabilny i wiedza jest współdzielona' },
      { value: 4, text: '🟦 Planowane zmiany mają zaplanowane przekazanie wiedzy' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Prawdopodobna rotacja kluczowych osób' },
      { value: 1, text: '❌ Wysokie ryzyko odejść, wiedza u jednej osoby' },
    ],
  },
  {
    area: 'team', name: 'q13',
    label:   'Role i odpowiedzialności w projekcie są jasno określone',
    context: 'Każdy wie za co odpowiada, kto podejmuje decyzje i gdzie kończą się granice odpowiedzialności.',
    tooltip: 'Czy wiadomo kto podejmuje decyzje, kto odpowiada za konkretne obszary i do kogo eskalować problemy? Jeśli kilka osób „myśli że ktoś inny się tym zajmuje", to znak ostrzegawczy.',
    options: [
      { value: 5, text: '✅ Tak, mamy RACI lub jednoznaczny podział ról i odpowiedzialności' },
      { value: 4, text: '🟦 Role są podzielone, ale brakuje formalnej dokumentacji' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Kilka ról się nakłada lub mamy luki odpowiedzialności' },
      { value: 1, text: '❌ Nikt nie wie za co odpowiada' },
    ],
  },

  // ── Planowanie i estymacje ──────────────────
  {
    area: 'planning', name: 'q9',
    label:   'Terminy wynikają z estymacji, nie zostały narzucone z góry',
    context: 'Termin oddania ma podstawę w obliczeniach, a nie w życzeniu sponsora.',
    tooltip: 'Czy harmonogram powstał na podstawie realnej analizy zakresu i zasobów, czy data końcowa była znana zanim ktokolwiek policzył ile pracy to wymaga?',
    options: [
      { value: 5, text: '✅ Tak, terminy wynikają z estymacji zespołu' },
      { value: 4, text: '🟦 Głównie tak – drobne narzucone ograniczenia, ale realne' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Termin narzucony, zespół stara się go uzasadnić' },
      { value: 1, text: '❌ Deadline narzucony odgórnie, nikt nie sprawdził wykonalności' },
    ],
  },
  {
    area: 'planning', name: 'q10',
    label:   'Plan ma zapas na nieprzewidziane sytuacje',
    context: 'Harmonogram nie zakłada że każdy pracuje na 100% przez cały czas i nic się nie wydarzy.',
    tooltip: `Realistyczny plan zakłada że ludzie mają urlopy, spotkania i niespodzianki. Minimum ${THRESHOLDS.PLAN_BUFFER_PCT}% czasu jako bufor to dobra praktyka.`,
    options: [
      { value: 5, text: '✅ Tak, mamy bufory i realistyczne założenia' },
      { value: 4, text: '🟦 Bufory są, ale niewystarczające na gorszy scenariusz' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Plan napięty, nie ma miejsca na żadne problemy' },
      { value: 1, text: '❌ Plan nierealistyczny, terminy niemożliwe do dotrzymania' },
    ],
  },

  // ── Zarządzanie ryzykiem ────────────────────
  {
    area: 'risk', name: 'q11',
    label:   'Ryzyka projektu są spisane i ktoś za nie odpowiada',
    context: 'Masz listę rzeczy które mogą pójść nie tak i konkretne osoby które ich pilnują.',
    tooltip: 'Każde ryzyko powinno mieć właściciela (konkretną osobę, nie „zespół") i być przeglądane regularnie – np. co sprint.',
    options: [
      { value: 5, text: '✅ Tak, rejestr ryzyk jest aktualny i ma ownerów' },
      { value: 4, text: '🟦 Rejestr jest, ale wymaga częstszych przeglądów' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Ryzyka omawiane ad hoc, nic nie jest spisane' },
      { value: 1, text: '❌ Brak jakiegokolwiek zarządzania ryzykiem' },
    ],
  },
  {
    area: 'risk', name: 'q12',
    label:   'Wiemy co zrobimy jeśli kluczowe ryzyko się zmaterializuje',
    context: 'Dla najpoważniejszych ryzyk masz plan B – nie improwizujesz gdy coś się posypie.',
    tooltip: 'Plan odpowiedzi to nie „postaramy się rozwiązać problem". To konkretne działania, osoby odpowiedzialne i próg kiedy eskalujemy do sponsora.',
    options: [
      { value: 5, text: '✅ Tak, mamy plany odpowiedzi dla kluczowych ryzyk' },
      { value: 4, text: '🟦 Są dla większości, brakuje dla kilku' },
      { value: 3, text: '❔ Trudno ocenić' },
      { value: 2, text: '🟧 Brak planów dla istotnej części ryzyk' },
      { value: 1, text: '❌ Nie mamy planów – reagujemy gdy problem już jest' },
    ],
  },
];

/** Impact type when area score is critical vs merely weak */
export const AREA_IMPACT_MAP = {
  requirements: { critical: 'blocks', weak: 'result' },
  tech:         { critical: 'blocks', weak: 'result' },
  deps:         { critical: 'blocks', weak: 'delay'  },
  team:         { critical: 'result', weak: 'delay'  },
  planning:     { critical: 'blocks', weak: 'delay'  },
  risk:         { critical: 'blocks', weak: 'result' },
};

export const RISK_CONTENT = {
  requirements: {
    title:      'Niekontrolowane rozszerzanie zakresu (scope creep)',
    mitigation: 'Wprowadź obowiązkową analizę wpływu przed każdą zmianą zakresu. Sponsor zatwierdza zmiany na piśmie, a harmonogram jest aktualizowany przy każdej akceptacji.',
  },
  tech: {
    title:      'Ryzyko technologiczne – rozwiązanie może nie zadziałać',
    mitigation: 'Zrób szybki proof-of-concept dla niezweryfikowanych obszarów zanim wejdziesz w pełną realizację. Przygotuj alternatywne podejście techniczne dla krytycznych komponentów.',
  },
  deps: {
    title:      'Opóźnienia po stronie zewnętrznych dostawców lub zespołów',
    mitigation: 'Zmapuj wszystkie zależności zewnętrzne i przypisz im ownerów po waszej stronie. Zadbaj o SLA lub przynajmniej cotygodniowy kontakt statusowy. Zbuduj środowisko testowe niezależne od zewnętrznych systemów.',
  },
  team: {
    title:      'Niejasny ownership lub utrata kluczowych kompetencji',
    mitigation: 'Jasno przypisz ownerów dla każdego obszaru projektu i kluczowych decyzji. Ustal ścieżki eskalacji oraz odpowiedzialności między zespołami. Upewnij się że każdy krytyczny obszar znają min. 2 osoby i dokumentuj wiedzę na bieżąco.',
  },
  planning: {
    title:      'Przekroczenie harmonogramu i budżetu',
    mitigation: 'Sprawdź harmonogram z zespołem – czy terminy są realne przy obecnym obciążeniu? Dodaj bufor min. 15% na nieprzewidziane sytuacje. Zdefiniuj jasne kryteria ukończenia każdego etapu.',
  },
  risk: {
    title:      'Nieodkryte ryzyka – brak widoczności na zagrożenia projektu',
    mitigation: 'Przeprowadź sesję identyfikacji ryzyk z całym zespołem (wystarczy 1h). Prowadź rejestr z ownerem i datą przeglądu. Przeglądaj go co dwa tygodnie.',
  },
};

export const GLOBAL_RISK = {
  title:      'Systemowo wysoka nieprzewidywalność – projekt wymaga dodatkowej uwagi PMO',
  impact:     'blocks',
  mitigation: 'Rozważ podział projektu na mniejsze etapy z osobnymi punktami decyzyjnymi. Wdróż cotygodniowe spotkania statusowe z PMO. Zidentyfikuj 3 największe zagrożenia i zacznij od nich.',
};

export const IMPACT_META = {
  blocks: { label: 'Blokuje projekt', cssClass: 'impact-blocks' },
  result: { label: 'Psuje rezultat',  cssClass: 'impact-result' },
  delay:  { label: 'Przesuwa termin', cssClass: 'impact-delay'  },
};

export const LEVEL_META = {
  low:    { cssClass: 'level-low',    badge: '🟢', label: 'Niska nieprzewidywalność',        desc: 'Projekt jest dobrze zdefiniowany i kontrolowany. Standardowe praktyki PM są wystarczające.' },
  medium: { cssClass: 'level-medium', badge: '🔵', label: 'Umiarkowana nieprzewidywalność',  desc: 'Są obszary wymagające aktywnego monitorowania. Zalecane regularne checkpointy z PMO.' },
  high:   { cssClass: 'level-high',   badge: '🟠', label: 'Wysoka nieprzewidywalność',       desc: 'Projekt jest obarczony istotnymi ryzykami. Wymagane intensywniejsze zarządzanie i mechanizmy kontrolne.' },
  vhigh:  { cssClass: 'level-vhigh',  badge: '🔴', label: 'Bardzo wysoka nieprzewidywalność', desc: 'Projekt wymaga gruntownego przeglądu zakresu, zasobów i podejścia. Rozważ podział na mniejsze etapy.' },
};
