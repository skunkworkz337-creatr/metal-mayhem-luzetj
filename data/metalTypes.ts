
// Comprehensive metal types database with grades, descriptions, and common sources
export interface MetalType {
  id: string;
  name: string;
  grade: string;
  description: string;
  commonSources: string[];
  icon: string;
  category: 'ferrous' | 'non-ferrous' | 'precious' | 'specialty';
}

export const metalTypesDatabase: MetalType[] = [
  // Copper grades
  {
    id: 'copper-1',
    name: 'Copper',
    grade: '#1 Bare Bright Copper',
    description: 'Clean, uncoated, unalloyed copper wire or cable, no smaller than 16 gauge. Bright and shiny with no oxidation, paint, or coating.',
    commonSources: ['Electrical wiring', 'Copper tubing', 'Bus bars', 'Electrical components', 'Copper cable'],
    icon: 'bolt.fill',
    category: 'non-ferrous',
  },
  {
    id: 'copper-2',
    name: 'Copper',
    grade: '#2 Copper',
    description: 'Unalloyed copper that is dirty, oxidized, or has solder, paint, or coating. May include burnt copper wire.',
    commonSources: ['Old electrical wiring', 'Plumbing pipes', 'Copper fittings', 'Burnt wire', 'Painted copper'],
    icon: 'bolt.fill',
    category: 'non-ferrous',
  },
  {
    id: 'copper-insulated',
    name: 'Insulated Copper Wire',
    grade: 'ICW / THHN',
    description: 'Copper wire still covered with insulation. Value depends on copper content percentage.',
    commonSources: ['Romex cable', 'Extension cords', 'Appliance cords', 'Building wire', 'Power cables'],
    icon: 'cable.connector',
    category: 'non-ferrous',
  },
  
  // Aluminum grades
  {
    id: 'aluminum-extrusion',
    name: 'Aluminum',
    grade: 'Aluminum Extrusion',
    description: 'Clean aluminum with no steel, rubber, or plastic attachments. Includes window frames, door frames, and structural pieces.',
    commonSources: ['Window frames', 'Door frames', 'Aluminum siding', 'Gutters', 'Lawn furniture'],
    icon: 'cube.fill',
    category: 'non-ferrous',
  },
  {
    id: 'aluminum-6061',
    name: 'Aluminum',
    grade: '6061 Aluminum',
    description: 'High-grade aluminum alloy used in structural applications. Contains magnesium and silicon for strength.',
    commonSources: ['Aircraft parts', 'Boat components', 'Bicycle frames', 'Automotive parts', 'Structural beams'],
    icon: 'cube.fill',
    category: 'non-ferrous',
  },
  {
    id: 'aluminum-cast',
    name: 'Aluminum',
    grade: 'Cast Aluminum',
    description: 'Aluminum that has been cast into shapes. Heavier and less pure than extruded aluminum.',
    commonSources: ['Engine blocks', 'Transmission cases', 'Lawn mower decks', 'BBQ grills', 'Patio furniture'],
    icon: 'cube.transparent',
    category: 'non-ferrous',
  },
  {
    id: 'aluminum-sheet',
    name: 'Aluminum',
    grade: 'Aluminum Sheet',
    description: 'Thin aluminum sheets or plates. Must be clean and free of attachments.',
    commonSources: ['Printing plates', 'Roofing material', 'Siding', 'Trailer panels', 'Industrial equipment'],
    icon: 'square.fill',
    category: 'non-ferrous',
  },
  {
    id: 'aluminum-cans',
    name: 'Aluminum',
    grade: 'Aluminum Cans (UBC)',
    description: 'Used beverage cans. Should be empty and reasonably clean.',
    commonSources: ['Soda cans', 'Beer cans', 'Energy drink cans', 'Sparkling water cans'],
    icon: 'cylinder.fill',
    category: 'non-ferrous',
  },
  
  // Brass grades
  {
    id: 'brass-yellow',
    name: 'Brass',
    grade: 'Yellow Brass',
    description: 'Brass with 60-70% copper content. Golden yellow color. Most common type of brass scrap.',
    commonSources: ['Plumbing fixtures', 'Door handles', 'Keys', 'Decorative items', 'Musical instruments'],
    icon: 'circle.hexagongrid.fill',
    category: 'non-ferrous',
  },
  {
    id: 'brass-red',
    name: 'Brass',
    grade: 'Red Brass',
    description: 'Brass with 85-90% copper content. Reddish color, higher value than yellow brass.',
    commonSources: ['Valves', 'Pumps', 'Water meters', 'Plumbing fittings', 'Industrial equipment'],
    icon: 'circle.hexagongrid.fill',
    category: 'non-ferrous',
  },
  {
    id: 'brass-shell-casings',
    name: 'Brass',
    grade: 'Brass Shell Casings',
    description: 'Spent ammunition casings. Must be clean and free of live rounds.',
    commonSources: ['Shooting ranges', 'Military surplus', 'Ammunition reloading'],
    icon: 'circle.grid.cross.fill',
    category: 'non-ferrous',
  },
  
  // Steel grades
  {
    id: 'steel-heavy',
    name: 'Steel',
    grade: 'Heavy Melting Steel (HMS)',
    description: 'Steel that is 1/4 inch thick or greater. Clean steel with no attachments.',
    commonSources: ['I-beams', 'Steel plates', 'Structural steel', 'Heavy machinery', 'Railroad tracks'],
    icon: 'square.stack.3d.up.fill',
    category: 'ferrous',
  },
  {
    id: 'steel-light',
    name: 'Steel',
    grade: 'Light Iron',
    description: 'Steel less than 1/4 inch thick. Includes sheet metal and thin steel.',
    commonSources: ['Car body panels', 'Appliance shells', 'Metal roofing', 'Ductwork', 'File cabinets'],
    icon: 'square.stack.fill',
    category: 'ferrous',
  },
  {
    id: 'steel-shredded',
    name: 'Steel',
    grade: 'Shredded Steel',
    description: 'Steel that has been processed through a shredder. Mixed steel scrap.',
    commonSources: ['Automobiles', 'Appliances', 'Mixed metal scrap'],
    icon: 'square.grid.3x3.fill',
    category: 'ferrous',
  },
  {
    id: 'steel-tin',
    name: 'Steel',
    grade: 'Tin Cans',
    description: 'Steel cans with tin coating. Should be clean and labels removed.',
    commonSources: ['Food cans', 'Soup cans', 'Vegetable cans', 'Pet food cans'],
    icon: 'cylinder',
    category: 'ferrous',
  },
  
  // Stainless Steel
  {
    id: 'stainless-304',
    name: 'Stainless Steel',
    grade: '304 Stainless',
    description: 'Most common stainless steel grade. Non-magnetic, contains 18% chromium and 8% nickel.',
    commonSources: ['Kitchen sinks', 'Appliances', 'Food processing equipment', 'Restaurant equipment', 'Brewing equipment'],
    icon: 'sparkles',
    category: 'specialty',
  },
  {
    id: 'stainless-316',
    name: 'Stainless Steel',
    grade: '316 Stainless',
    description: 'Marine-grade stainless with added molybdenum. Higher corrosion resistance and value.',
    commonSources: ['Marine equipment', 'Chemical processing', 'Medical equipment', 'Pharmaceutical equipment'],
    icon: 'sparkles',
    category: 'specialty',
  },
  {
    id: 'stainless-430',
    name: 'Stainless Steel',
    grade: '430 Stainless',
    description: 'Magnetic stainless steel. Lower nickel content, less valuable than 304/316.',
    commonSources: ['Automotive trim', 'Appliance parts', 'Decorative items'],
    icon: 'sparkles',
    category: 'specialty',
  },
  
  // Lead
  {
    id: 'lead-soft',
    name: 'Lead',
    grade: 'Soft Lead',
    description: 'Pure lead with no attachments. Soft and malleable.',
    commonSources: ['Lead pipes', 'Wheel weights', 'Fishing weights', 'Radiation shielding', 'Battery posts'],
    icon: 'circle.fill',
    category: 'specialty',
  },
  {
    id: 'lead-batteries',
    name: 'Lead',
    grade: 'Lead Acid Batteries',
    description: 'Automotive and industrial batteries. Must be intact with acid.',
    commonSources: ['Car batteries', 'Truck batteries', 'Industrial batteries', 'UPS batteries'],
    icon: 'battery.100',
    category: 'specialty',
  },
  
  // Zinc
  {
    id: 'zinc-die-cast',
    name: 'Zinc',
    grade: 'Zinc Die Cast',
    description: 'Zinc alloy castings. Common in automotive and hardware applications.',
    commonSources: ['Door handles', 'Automotive parts', 'Toys', 'Hardware', 'Decorative items'],
    icon: 'hexagon.fill',
    category: 'non-ferrous',
  },
  
  // Nickel
  {
    id: 'nickel-alloy',
    name: 'Nickel',
    grade: 'Nickel Alloy',
    description: 'High-nickel content alloys. Used in high-temperature applications.',
    commonSources: ['Jet engine parts', 'Industrial furnaces', 'Chemical processing equipment'],
    icon: 'diamond.fill',
    category: 'specialty',
  },
  
  // Titanium
  {
    id: 'titanium',
    name: 'Titanium',
    grade: 'Titanium Scrap',
    description: 'Lightweight, strong metal. High value but less common.',
    commonSources: ['Aircraft parts', 'Medical implants', 'Bicycle frames', 'Golf clubs', 'Industrial equipment'],
    icon: 'star.fill',
    category: 'specialty',
  },
  
  // Electric Motors
  {
    id: 'electric-motors',
    name: 'Electric Motors',
    grade: 'Electric Motors',
    description: 'Complete electric motors with copper windings. Value based on size and copper content.',
    commonSources: ['Washers', 'Dryers', 'Air conditioners', 'Furnaces', 'Power tools', 'Pool pumps'],
    icon: 'fan.fill',
    category: 'specialty',
  },
  
  // Transformers
  {
    id: 'transformers',
    name: 'Transformers',
    grade: 'Copper Transformers',
    description: 'Electrical transformers containing copper windings. High copper content.',
    commonSources: ['Power poles', 'Electrical substations', 'Industrial equipment', 'HVAC systems'],
    icon: 'powerplug.fill',
    category: 'specialty',
  },
  
  // Radiators
  {
    id: 'radiators-copper',
    name: 'Radiators',
    grade: 'Copper/Brass Radiators',
    description: 'Radiators with copper and brass components. Must be clean and drained.',
    commonSources: ['Car radiators', 'HVAC radiators', 'Industrial cooling systems'],
    icon: 'rectangle.grid.2x2.fill',
    category: 'non-ferrous',
  },
  {
    id: 'radiators-aluminum',
    name: 'Radiators',
    grade: 'Aluminum Radiators',
    description: 'Modern radiators made primarily of aluminum. Lower value than copper/brass.',
    commonSources: ['Modern car radiators', 'Air conditioning units'],
    icon: 'rectangle.grid.2x2',
    category: 'non-ferrous',
  },
  
  // Catalytic Converters
  {
    id: 'catalytic-converters',
    name: 'Catalytic Converters',
    grade: 'Catalytic Converters',
    description: 'Contain precious metals (platinum, palladium, rhodium). High value, requires specialized processing.',
    commonSources: ['Automobiles', 'Trucks', 'Industrial equipment'],
    icon: 'car.fill',
    category: 'precious',
  },
  
  // Computer Scrap
  {
    id: 'computer-boards',
    name: 'Computer Boards',
    grade: 'Circuit Boards',
    description: 'Electronic circuit boards containing precious metals. Value varies by type and condition.',
    commonSources: ['Computers', 'Servers', 'Telecommunications equipment', 'Consumer electronics'],
    icon: 'cpu.fill',
    category: 'precious',
  },
];

// Helper function to get metals by category
export const getMetalsByCategory = (category: MetalType['category']) => {
  return metalTypesDatabase.filter(metal => metal.category === category);
};

// Helper function to search metals
export const searchMetals = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return metalTypesDatabase.filter(metal => 
    metal.name.toLowerCase().includes(lowerQuery) ||
    metal.grade.toLowerCase().includes(lowerQuery) ||
    metal.description.toLowerCase().includes(lowerQuery) ||
    metal.commonSources.some(source => source.toLowerCase().includes(lowerQuery))
  );
};
