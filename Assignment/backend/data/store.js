const products = [
  {
    id: '1',
    name: 'Field Notes Expedition Edition',
    category: 'Notebooks',
    price: 12.95,
    stock: 50,
    totalStock: 50,
    description: 'Rugged, waterproof notebooks for surviving the elements. High-visibility "Antarctic Survey Orange" covers.',
    imageUrl: '/images/Field%20Notes%20Expedition%20Edition%20(notebook).png'
  },
  {
    id: '2',
    name: 'Brass Pocket Compass',
    category: 'Instruments',
    price: 45.00,
    stock: 15,
    totalStock: 15,
    description: 'Solid brass construction, liquid-filled capsule, and a reliable jeweled bearing. Built to last a lifetime.',
    imageUrl: '/images/Brass%20Pocket%20Compass.png'
  },
  {
    id: '3',
    name: 'Vintage 35mm Rangefinder',
    category: 'Optics',
    price: 150.00,
    stock: 3,
    totalStock: 3,
    description: 'Fully mechanical, professionally CLA\'d. The perfect companion for documenting your excursions on film.',
    imageUrl: '/images/Vintage%2035mm%20Rangefinder.png'
  },
  {
    id: '4',
    name: 'Waxed Canvas Specimen Pouch',
    category: 'Storage',
    price: 38.50,
    stock: 20,
    totalStock: 20,
    description: 'Heavyweight waxed canvas, brass hardware, and multiple compartments for field samples and small tools.',
    imageUrl: '/images/Waxed%20Canvas%20Specimen%20Pouch.png'
  },
  {
    id: '5',
    name: 'Archival Pressing Paper Set',
    category: 'Paper Goods',
    price: 18.00,
    stock: 100,
    totalStock: 100,
    description: 'Acid-free, highly absorbent botanical pressing paper for preserving plant specimens.',
    imageUrl: '/images/Archival%20Pressing%20Paper%20Set.png'
  },
  {
    id: '6',
    name: 'Weatherproof Grid Journal',
    category: 'Notebooks',
    price: 24.00,
    stock: 35,
    totalStock: 35,
    description: 'Wire-bound with synthetic paper that sheds water, sweat, and grease. Grid pattern for precise mapping.',
    imageUrl: '/images/Weatherproof%20Grid%20Journal.png'
  },
  {
    id: '7',
    name: 'Folding Brass Magnifier',
    category: 'Optics',
    price: 28.00,
    stock: 12,
    totalStock: 12,
    description: '10x magnification triplet lens in a protective brass housing. Essential for examining details in the field.',
    imageUrl: '/images/Folding%20Brass%20Magnifier.png'
  },
  {
    id: '8',
    name: 'Botanical Specimen Tins',
    category: 'Storage',
    price: 15.00,
    stock: 40,
    totalStock: 40,
    description: 'Set of three rust-resistant aluminum tins with secure screw tops for fragile finds.',
    imageUrl: '/images/Botanical%20Specimen%20Tins.png'
  }
];

let orders = [];

module.exports = {
  products,
  orders
};
