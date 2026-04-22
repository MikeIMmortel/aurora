interface Source {
  name: string;
  portion: string;
  protein: number;
  kcal: number;
  note?: string;
}

interface Group {
  title: string;
  items: Source[];
}

const GROUPS: Group[] = [
  {
    title: 'Ochtend / shake',
    items: [
      { name: 'Whey shake + 250 ml magere melk', portion: '1 scoop (30 g)', protein: 32, kcal: 210 },
      { name: 'Skyr / magere kwark', portion: '250 g', protein: 25, kcal: 150 },
      { name: 'Havermout droog', portion: '50 g', protein: 7, kcal: 180, note: 'voeg toe aan shake voor vezels' },
      { name: 'Gekookte eieren (AH voorgekookt)', portion: '2 stuks', protein: 13, kcal: 155 },
    ],
  },
  {
    title: 'Lunch op brood',
    items: [
      { name: 'Hüttenkäse', portion: '200 g', protein: 25, kcal: 180, note: 'op volkorenbrood' },
      { name: 'Kipfilet (kant-en-klaar)', portion: '100 g', protein: 22, kcal: 110 },
      { name: 'Rosbief', portion: '100 g', protein: 20, kcal: 140 },
      { name: 'Tonijn in water', portion: '1 blikje (120 g)', protein: 25, kcal: 115 },
      { name: 'Proteïne-brood (AH/Jumbo)', portion: '2 sneden', protein: 14, kcal: 170, note: 'vs. 6 g bij gewoon brood' },
    ],
  },
  {
    title: 'Bij groentepakket (avond)',
    items: [
      { name: 'Rotisserie-kip (AH)', portion: '150 g', protein: 35, kcal: 245 },
      { name: 'Zalmfilet uit oven', portion: '150 g', protein: 33, kcal: 310, note: '12 min 180°' },
      { name: 'Gepelde garnalen', portion: '150 g', protein: 30, kcal: 145, note: '3 min pan' },
      { name: 'Gemarineerde tofu (AH)', portion: '200 g', protein: 30, kcal: 240, note: '5 min pan' },
      { name: 'Magere gehaktbal', portion: '150 g', protein: 25, kcal: 240 },
      { name: 'Edamame bevroren', portion: '150 g', protein: 18, kcal: 180, note: '3 min koken' },
    ],
  },
  {
    title: 'Snack / avond',
    items: [
      { name: 'Eiwit-pudding (AH Excellent / Arla)', portion: '1 bakje', protein: 20, kcal: 130 },
      { name: 'Magere kwark + fruit', portion: '250 g', protein: 25, kcal: 180 },
      { name: 'Eiwitreep (20+ g eiwit)', portion: '1 reep', protein: 20, kcal: 200, note: 'let op suikers' },
      { name: 'Shake voor bed (langzame eiwit)', portion: '1 scoop caseïne / whey', protein: 25, kcal: 120 },
    ],
  },
];

export default function ProteinSources() {
  return (
    <div className="rounded-2xl border border-aurora-border bg-aurora-surface p-5 flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-semibold text-white">Eiwitbronnen — kant-en-klaar</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Snel te combineren tot je dag-target. Kies 3–4 per dag.
        </p>
      </div>

      {GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-2">
          <h4 className="text-xs uppercase tracking-wider text-aurora-gold">{group.title}</h4>
          <div className="flex flex-col divide-y divide-aurora-border">
            {group.items.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-4 py-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-100">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    {item.portion}
                    {item.note && <span className="text-gray-600"> · {item.note}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-[#4ADE80]">
                    {item.protein} g
                  </div>
                  <div className="text-xs text-gray-500">{item.kcal} kcal</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
