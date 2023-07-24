/**
 * Quick demo of how to implement a dynamic museum map.
 */

import type { CollectionObjectDocument } from '@/types/collectionObjectDocument';

const galleries = [
  {
    id: 'pavilion',
    imgId: 'f1-pavilion',
    name: 'Martha A. and Robert S. Rubin Pavilion, 1st Floor',
    floor: 1,
  },
  {
    id: 'islamic',
    imgId: 'f2-arts-islamic',
    name: 'Arts of the Islamic World, 2nd floor',
    floor: 2,
  },
  {
    id: 'asian-west',
    imgId: 'f2-arts-asia',
    name: 'Asian Galleries, West, 2nd floor (China)',
    floor: 2,
  },
  {
    id: 'south-asia',
    imgId: 'f2-arts-asia',
    name: 'Asian Galleries, Arts of South Asia, 2nd floor',
    floor: 2,
  },
  {
    id: 'asia-south',
    imgId: 'f2-arts-asia',
    name: 'Asian Galleries, South, 2nd floor',
    floor: 2,
  },
  {
    id: 'asian-southwest',
    imgId: 'f2-arts-asia',
    name: 'Asian Galleries, Southwest, 2nd floor',
    floor: 2,
  },
  {
    id: 'asian-japan',
    imgId: 'f2-arts-asia',
    name: 'Asian Galleries, Arts of Japan, 2nd floor',
    floor: 2,
  },
  {
    id: 'asian-japan-north',
    imgId: 'f2-arts-asia',
    name: 'Asian Galleries, North, 2nd floor (Japan)',
    floor: 2,
  },
  {
    id: 'orientation',
    imgId: 'f3-egyptian',
    name: 'Egyptian Orientation Gallery, 3rd Floor',
    floor: 3,
  },
  {
    id: 'rubin-roman',
    imgId: 'f3-egyptian',
    name: '19th Dynasty to Roman Period, Martha A. and Robert S. Rubin Gallery, 3rd Floor',
    floor: 3,
  },
  {
    id: 'egyptian',
    imgId: 'f3-egyptian',
    name: 'Old Kingdom to 18th Dynasty, Egyptian Galleries, 3rd Floor',
    floor: 3,
  },
  {
    id: 'funerary-2',
    imgId: 'f3-mummy-chamber',
    name: 'Funerary Gallery 2, Martha A. and Robert S. Rubin Gallery, 3rd Floor',
    floor: 3,
  },
  {
    id: 'funerary-3',
    imgId: 'f3-mummy-chamber',
    name: 'Funerary Gallery 3, Martha A. and Robert S. Rubin Gallery, 3rd Floor',
    floor: 3,
  },
  {
    id: 'rubin-amarna',
    imgId: 'f3-egyptian',
    name: 'Amarna Period, Martha A. and Robert S. Rubin Gallery, 3rd Floor',
    floor: 3,
  },
  {
    id: 'decorative-19th',
    imgId: 'f4-decorative-arts',
    name: 'Decorative Art, 19th Century, 4th Floor',
    floor: 4,
  },
  {
    id: 'igrassia',
    imgId: 'f4-igrassia',
    name: 'Contemporary Art, North Gallery',
    floor: 4,
  },
  {
    id: 'cupola',
    imgId: 'f4-decorative-arts',
    name: 'Cupola House, Pantry and Dining Decorative Art, Hall, 4th Floor',
    floor: 4,
  },
  {
    id: 'decorative-20th',
    imgId: 'f4-decorative-arts',
    name: 'Decorative Art, 20th-Century Decorative Arts, 4th Floor',
    floor: 4,
  },
  {
    id: 'decorative',
    imgId: 'f4-decorative-arts',
    name: 'Decorative Art, 4th Floor',
    floor: 4,
  },
  {
    id: 'f4-dinner-party',
    imgId: 'f4-decorative-arts',
    name: 'Elizabeth A. Sackler Center for Feminist Art, 4th Floor',
    floor: 4,
  },
  {
    id: 'luce',
    imgId: 'f5-luce-center',
    name: 'Luce Visible Storage and Study Center, 5th Floor',
    floor: 5,
  },
  {
    id: 'european',
    imgId: 'f5-european-art',
    name: 'European Art Galleries, 5th floor',
    floor: 5,
  },
  {
    id: 'americas',
    imgId: 'f5-arts-americas',
    name: 'Arts of the Americas Galleries, 5th Floor',
    floor: 5,
  },
  {
    id: 'americas-colonies',
    imgId: 'f5-arts-americas',
    name: 'American Art Galleries, 5th Floor, From Colonies to States, 1660–1830',
    floor: 5,
  },
  {
    id: 'americas-colonies',
    imgId: 'f5-arts-americas',
    name: 'American Art Galleries, 5th Floor, Imagining the New Nation’s Landscape, 1800–1880',
    floor: 5,
  },
  {
    id: 'americas-colonies',
    imgId: 'f5-arts-americas',
    name: 'American Art Galleries, 5th Floor, The City and the Rise of the Modern Woman, 1900–1945',
    floor: 5,
  },
  {
    id: 'americas-colonies',
    imgId: 'f5-arts-americas',
    name: 'American Art Galleries, 5th Floor, Beyond Borders and Boundaries, 20th and 21st Centuries',
    floor: 5,
  },
  {
    id: 'european',
    imgId: 'rotunda',
    name: 'Special Exhibition Gallery, 5th Floor',
    floor: 5,
  },
];

export function MuseumMap({ item }: { item: CollectionObjectDocument }) {
  if (!item?.id || !item?.museumLocation?.name) return null;

  const gallery = galleries.find(
    (gallery) => gallery.name === item.museumLocation?.name
  );

  if (!gallery) return null;

  const myFloor = gallery.floor;
  const myLocation = gallery.imgId;

  function getLinesStyles(floor: number): any {
    if (floor === myFloor) {
      return {
        fill: 'none',
        stroke: '#000000',
        strokeWidth: 5.6693,
        strokeMiterlimit: 10,
      };
    }
    return {
      fill: 'none',
      stroke: '#b7b8b9',
      strokeWidth: 5.6693,
      strokeMiterlimit: 10,
    };
  }

  function getFillStyles(location: string): any {
    if (location === myLocation) {
      return {
        fill: '#FF0000',
      };
    }
    return {
      fill: '#E5E6E8',
    };
  }

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 2451 4215"
      className="h-full"
    >
      <g id="shadow">
        <path
          style={{ fill: '#E5E6E8' }}
          d="M1427.3,3928.8l-443,255.8l-711-410.5l630.5-364l34.6,20l36.4-21l387.1,223.5l299.6-173l149.8,86.5l254.6-147
            l-53.7-31l194-112l193.1,111.5l-504,291l96.1-12.5l0.1,0c76.6,83.7,53.9,189.8-68.1,260.3c-135.3,78.1-346.5,85.7-496.7,22.8
            L1427.3,3928.8z"
        />
      </g>
      <g id="_x31__zones">
        <polygon
          style={getFillStyles('great-hall')}
          points="986,3518 536.6,3777.5 986.9,4037.5 1437.2,3777.5 1361,3733.5 1380.1,3722.5 1081.3,3550 
            1062.3,3561 	"
        />
        <polygon
          style={getFillStyles('education-studios')}
          points="536.6,3777.5 423.1,3843 872.6,4102.5 986,4037 	"
        />
        <polygon
          style={getFillStyles('robert-blum-gallery')}
          points="1494.4,3874.5 1381.8,3809.5 873.5,4103 986,4168 	"
        />
        <path
          style={getFillStyles('f1-pavilion')}
          d="M1430.3,3911c140.7,66.3,349.9,63,481.1-12.8c113.7-65.6,139.9-161.7,68.9-239.7l-154.2,24l79.1-45.7
            l-112.6-65l-411.2,237.4l113,65.2L1430.3,3911z"
        />
      </g>
      <g id="_x31__drawing">
        <polyline
          style={getLinesStyles(1)}
          points="1532.5,3888 1532.5,3852 986,4167.5 302.7,3773 904.6,3425.5 943.6,3448 979.1,3427.5 1316,3622 	"
        />
        <line
          style={getLinesStyles(1)}
          x1="1351.5"
          y1="3642.5"
          x2="1394.8"
          y2="3667.5"
        />
        <line
          style={getLinesStyles(1)}
          x1="1426"
          y1="3685.5"
          x2="1434.6"
          y2="3690.5"
        />
        <line
          style={getLinesStyles(1)}
          x1="1423.4"
          y1="3697"
          x2="1558.5"
          y2="3619"
        />
        <line
          style={getLinesStyles(1)}
          x1="1362.4"
          y1="3648.8"
          x2="1375.4"
          y2="3641.3"
        />
        <polyline
          style={getLinesStyles(1)}
          points="1410.4,3621.5 1457.2,3594.5 1529,3636 	"
        />
        <polyline
          style={getLinesStyles(1)}
          points="1621.7,3582.5 1735.2,3517 1811.4,3561 1736,3604.5 1717.8,3594 	"
        />
        <line
          style={getLinesStyles(1)}
          x1="1691"
          y1="3578.5"
          x2="1659.8"
          y2="3560.5"
        />
        <line
          style={getLinesStyles(1)}
          x1="423.8"
          y1="3842.9"
          x2="940"
          y2="3544.9"
        />
        <polyline
          style={getLinesStyles(1)}
          points="975.6,3524.5 986.6,3518.2 1006,3507 	"
        />
        <polyline
          style={getLinesStyles(1)}
          points="1296.1,3674.5 1379.2,3722.5 1388.7,3717 1360.2,3733.5 1380.9,3745.5 	"
        />
        <line
          style={getLinesStyles(1)}
          x1="1417.3"
          y1="3766.5"
          x2="1465.8"
          y2="3794.5"
        />
        <line
          style={getLinesStyles(1)}
          x1="873.5"
          y1="4102.5"
          x2="912.4"
          y2="4080"
        />
        <line
          style={getLinesStyles(1)}
          x1="945.3"
          y1="4061"
          x2="1399.1"
          y2="3799"
        />
        <line
          style={getLinesStyles(1)}
          x1="1417.3"
          y1="3788.5"
          x2="1436.4"
          y2="3777.5"
        />
        <line
          style={getLinesStyles(1)}
          x1="976.5"
          y1="4031"
          x2="1028.5"
          y2="4061"
        />
        <line
          style={getLinesStyles(1)}
          x1="1062.2"
          y1="4080.5"
          x2="1099.5"
          y2="4102"
        />
        <line
          style={getLinesStyles(1)}
          x1="943.6"
          y1="4012"
          x2="910.7"
          y2="3993"
        />
        <line
          style={getLinesStyles(1)}
          x1="885.6"
          y1="3978.5"
          x2="639.6"
          y2="3836.5"
        />
        <line
          style={getLinesStyles(1)}
          x1="612.8"
          y1="3821"
          x2="583.3"
          y2="3804"
        />
        <line
          style={getLinesStyles(1)}
          x1="548.7"
          y1="3784"
          x2="537.4"
          y2="3777.5"
        />
        <line
          style={getLinesStyles(1)}
          x1="593.9"
          y1="3810.1"
          x2="552.4"
          y2="3834.1"
        />
        <line
          style={getLinesStyles(1)}
          x1="519.3"
          y1="3853"
          x2="480.3"
          y2="3875.5"
        />
        <line
          style={getLinesStyles(1)}
          x1="931.5"
          y1="4005"
          x2="889.9"
          y2="4029"
        />
        <line
          style={getLinesStyles(1)}
          x1="857"
          y1="4048"
          x2="818"
          y2="4070.5"
        />
        <line
          style={getLinesStyles(1)}
          x1="1154"
          y1="4070.5"
          x2="1116.8"
          y2="4049"
        />
        <line
          style={getLinesStyles(1)}
          x1="1083"
          y1="4029.5"
          x2="1041.5"
          y2="4005.5"
        />
        <line
          style={getLinesStyles(1)}
          x1="1493.8"
          y1="3874.3"
          x2="1456.6"
          y2="3852.8"
        />
        <line
          style={getLinesStyles(1)}
          x1="1422.5"
          y1="3833.5"
          x2="1380.9"
          y2="3809.5"
        />
        <polyline
          style={getLinesStyles(1)}
          points="986.9,3518 1015.4,3534.5 1062.3,3561.5 1081.3,3550.5 1262.3,3655 	"
        />
        <polyline
          style={getLinesStyles(1)}
          points="1343.3,3701.8 1247.1,3757.3 985.2,3606 1015.5,3534.5 	"
        />
        <line
          style={getLinesStyles(1)}
          x1="1194.1"
          y1="3615.6"
          x2="1098"
          y2="3671.1"
        />
        <line
          style={getLinesStyles(1)}
          x1="1004.2"
          y1="3725"
          x2="1090.8"
          y2="3775"
        />
        <line
          style={getLinesStyles(1)}
          x1="1137.6"
          y1="3802"
          x2="1035.4"
          y2="3861"
        />
        <line
          style={getLinesStyles(1)}
          x1="995.6"
          y1="3884"
          x2="862.2"
          y2="3807"
        />
        <line
          style={getLinesStyles(1)}
          x1="815.4"
          y1="3780"
          x2="957.5"
          y2="3698"
        />
        <path
          style={getLinesStyles(1)}
          d="M1792.6,3571.8l112.6,65l-79.1,45.7l154.2-24c71,78.1,44.8,174.1-68.9,239.7c-131.2,75.7-340.4,79-481.1,12.8"
        />
        <line
          style={getLinesStyles(1)}
          x1="1765.5"
          y1="3621.5"
          x2="1822.6"
          y2="3654.5"
        />
      </g>
      <g id="shadow_copy">
        <polyline
          style={{ fill: '#E5E6E8' }}
          points="1835.1,2878.3 1895.9,2843.2 2399.9,2552.2 2206.8,2440.8 2012.8,2552.8 2066.5,2583.7 
            1811.9,2730.7 1662,2644.3 1362.4,2817.3 975.3,2593.8 938.9,2614.8 904.3,2594.8 273.8,2958.8 984.8,3369.2 1427.8,3113.5 
            1427.3,3113.8 1560.5,3036.9 1606,3063 1874,2901 1835.1,2878.3 	"
        />
      </g>
      <g id="_x32__zones">
        <path
          style={getFillStyles('f2-arts-asia')}
          d="M757.9,3087.8l-220.8-127.5l464.2-268l114.3,66l21.7-12.5l263.3,152l-21.7,12.5l75.3,43.5l-353.3,204l-76.2-44
            l224.3-129.5l0-43.5l-226-130l-75.3,0L723.7,2940l0,44.7l18,10.4l56.1-32.4l88.3,51L757.9,3087.8L757.9,3087.8z"
        />
        <polygon
          style={getFillStyles('f2-arts-islamic')}
          points="1100.8,3157.7 1024.6,3113.8 950.2,3113.8 913.8,3092.8 969.2,3060.8 886.9,3013.3 757.9,3087.8 
            903.4,3171.8 787.3,3238.8 874,3288.7 	"
        />
        <polygon
          style={getFillStyles('libraries-archives')}
          points="1566.8,3018.7 1454.2,2953.7 874,3288.7 986.5,3353.7 	"
        />
      </g>
      <g id="_x32__drawing">
        <polygon
          style={getLinesStyles(2)}
          points="899.1,2608.3 1024.6,2680.8 1003,2693.3 1115.6,2758.3 1137.2,2745.8 1400.5,2897.8 1378.8,2910.2 
            1453.4,2953.3 1566.8,3018.7 986.5,3353.7 787.3,3238.8 903.4,3171.8 537.1,2960.3 948.9,2722.5 912.1,2701.3 835,2745.8 
            872.2,2767.3 788.2,2718.8 864.4,2674.8 824.6,2651.8 	"
        />
        <polygon
          style={getLinesStyles(2)}
          points="723.3,2985.3 741.5,2995.8 798.6,2962.8 966.6,3059.8 909.5,3092.8 946.7,3114.3 1024.6,3114.2 
            1248.9,2984.8 1248.9,2940.8 1024.6,2811.3 948.4,2811.3 938.9,2816.8 1137.2,2931.3 1100,2952.8 901.7,2838.3 724.1,2940.8 	"
        />
        <line
          style={getLinesStyles(2)}
          x1="1454.2"
          y1="2953.2"
          x2="900.8"
          y2="3272.7"
        />
        <line
          style={getLinesStyles(2)}
          x1="814.6"
          y1="3223"
          x2="854.9"
          y2="3246.2"
        />
      </g>
      <g id="shadow_copy_4">
        <polygon
          style={{ fill: '#E5E6E8' }}
          points="1895.9,2037.2 2399.9,1746.2 2206.8,1634.8 2012.8,1746.8 2066.5,1777.7 1811.9,1924.7 1662,1838.3 
            1362.4,2011.3 975.3,1787.8 938.9,1808.8 904.3,1788.8 273.8,2152.8 984.8,2563.2 1427.8,2307.5 1427.3,2307.8 	"
        />
      </g>
      <g id="_x33__zones">
        <polygon
          style={getFillStyles('beaux-arts-court')}
          points="1002.1,1887.3 1077.5,1930.8 1099.1,1918.3 1399.6,2091.8 1363.3,2112.8 1438.6,2156.2 989.1,2415.7 
            536.2,2154.3 	"
        />
        <polygon
          style={getFillStyles('beaux-arts-court-inner')}
          points="947.6,2005.3 722.4,2135.3 722.4,2182.3 939.8,2307.8 1022.9,2307.8 1247.2,2178.2 1247.2,2137.3 
            1020.3,2006.3 	"
        />
        <polygon
          style={getFillStyles('womans-afterlife')}
          points="1044.3,2383.6 1155.8,2448 1100.8,2479.7 990,2415.7 	"
        />
        <polygon
          style={getFillStyles('f3-egyptian')}
          points="2094.2,1777.2 2207.6,1842.7 1815.3,2069.2 1869.9,2100.7 1606.6,2252.7 1550.3,2220.2 
            1156.3,2447.7 1044.6,2383.2 	"
        />
        <polygon
          style={getFillStyles('kevorkian')}
          points="1738.2,1895.8 1813.6,1939.2 1438.2,2156 1362.8,2112.5 	"
        />
        <polygon
          style={getFillStyles('mummy-chamber')}
          points="2263.9,1680.2 2376.5,1745.2 2207.6,1842.7 2094.2,1777.2 	"
        />
        <polygon
          style={getFillStyles('auditorium')}
          points="854.2,1972 733.1,1902.1 453.9,2063.3 573.9,2132.5 	"
        />
      </g>
      <g id="_x33__drawing">
        <path style={getLinesStyles(3)} d="M872.2,1961.3" />
        <polyline
          style={getLinesStyles(3)}
          points="912.1,1895.3 948.9,1916.5 537.1,2154.3 1100.8,2479.7 1549.9,2220.5 	"
        />
        <polyline
          style={getLinesStyles(3)}
          points="1453.4,2147.3 1378.8,2104.2 1400.5,2091.8 1099.6,1918 1077.9,1930.5 1003,1887.3 1024.6,1874.8 
            899.1,1802.3 450,2061.5 574.3,2133.3 	"
        />
        <polyline
          style={getLinesStyles(3)}
          points="901.7,2032.3 724.1,2134.8 723.3,2179.3 741.5,2189.8 741.5,2189.8 909.5,2286.8 909.5,2286.8 
            946.7,2308.3 1024.6,2308.2 1248.9,2178.8 1248.9,2134.8 1024.6,2005.3 948.4,2005.3 938.9,2010.8 	"
        />
        <polyline
          style={getLinesStyles(3)}
          points="1034.6,2389.5 1454.2,2147.2 1543.4,2095.7 	"
        />
        <line
          style={getLinesStyles(3)}
          x1="1400.5"
          y1="2091.2"
          x2="1475.8"
          y2="2047.8"
        />
        <polyline
          style={getLinesStyles(3)}
          points="2198.1,1717.7 2150.5,1745.2 2093.3,1712.2 2037,1744.8 2094.2,1777.7 1813.6,1939.7 1738.2,1896.2 
            1511.3,2027.2 	"
        />
        <polyline
          style={getLinesStyles(3)}
          points="2215.4,1707.7 2263.1,1680.2 2375.6,1745.2 1814.5,2069.2 	"
        />
        <polyline
          style={getLinesStyles(3)}
          points="2235.3,1696.2 2178.2,1663.2 2121.9,1695.8 2179.1,1728.7 	"
        />
        <line
          style={getLinesStyles(3)}
          x1="1813.6"
          y1="1939.7"
          x2="1737.4"
          y2="1983.7"
        />
        <line
          style={getLinesStyles(3)}
          x1="1720.9"
          y1="1993.2"
          x2="1597.1"
          y2="2064.7"
        />
        <polyline
          style={getLinesStyles(3)}
          points="1682.8,1993.2 1869.9,2101.2 1606.6,2253.2 1513.1,2199.2 	"
        />
        <line
          style={getLinesStyles(3)}
          x1="1494.9"
          y1="2188.7"
          x2="1419.5"
          y2="2145.2"
        />
        <polyline
          style={getLinesStyles(3)}
          points="1383.2,2124.2 1363.3,2112.8 1378.8,2103.8 	"
        />
        <line
          style={getLinesStyles(3)}
          x1="1044.8"
          y1="2383.6"
          x2="1081.2"
          y2="2404.6"
        />
        <line
          style={getLinesStyles(3)}
          x1="1119"
          y1="2426.7"
          x2="1155.8"
          y2="2448"
        />
        <line
          style={getLinesStyles(3)}
          x1="1382.3"
          y1="2188.7"
          x2="1418.7"
          y2="2209.7"
        />
        <line
          style={getLinesStyles(3)}
          x1="1456.8"
          y1="2231.7"
          x2="1493.6"
          y2="2253"
        />
        <line
          style={getLinesStyles(3)}
          x1="938.9"
          y1="2010.8"
          x2="901.7"
          y2="2032.3"
        />
      </g>
      <g id="shadow_copy_3">
        <polygon
          style={{ fill: '#E5E6E8' }}
          points="1895.9,1231.2 2399.9,940.2 2206.8,828.8 2012.8,940.8 2066.5,971.7 1811.9,1118.7 1662,1032.3 
            1362.4,1205.3 975.3,981.8 938.9,1002.8 904.3,982.8 273.8,1346.8 984.8,1757.2 1427.8,1501.5 1427.3,1501.8 	"
        />
      </g>
      <g id="_x34__zones">
        <polygon
          style={getFillStyles('f4-decorative-arts')}
          points="1399.6,1285.3 1099.1,1111.8 1082.7,1121.3 1007.3,1077.8 759.6,1220.8 834.1,1263.8 949.3,1197.3 
            1023.8,1199.3 1248.1,1328.8 1248.1,1372.8 	"
        />
        <polygon
          style={getFillStyles('f4-decorative-arts')}
          points="759.6,1220.8 835,1264.3 724.1,1328.3 725.9,1372.3 949.3,1501.3 1025.5,1501.3 1101.7,1545.2 
            879.1,1673.7 427.1,1412.8 	"
        />
        <polygon
          style={getFillStyles('f4-igrassia')}
          points="1101.7,1545.2 1025.5,1501.3 1248.1,1372.8 1323.4,1416.2 	"
        />
        <polygon
          style={getFillStyles('f4-dinner-party')}
          points="1652.5,1226.2 1710.5,1344.7 1691.5,1355.7 1484.5,1323.2 	"
        />
        <path
          style={getFillStyles('eascfa')}
          d="M1626.5,1154.3l243.4,140.5l-263.3,152l-242.9-140.2L1626.5,1154.3z M1484.5,1323.2l207,32.5l19.1-11
            l-58-118.5L1484.5,1323.2z"
        />
      </g>
      <g id="_x34__drawing">
        <polygon
          style={getLinesStyles(4)}
          points="2375.6,939.2 2263.1,874.2 2235.3,890.2 2178.2,857.2 2121.9,889.8 2179.1,922.7 2150.5,939.2 
            2093.3,906.2 2037,938.8 2094.2,971.7 1813.6,1133.7 1738.2,1090.2 1532.1,1209.2 1457.7,1166.3 1383.2,1209.3 1457.7,1252.2 
            1400.5,1285.2 1100,1111.8 1082.7,1121.8 1006.5,1077.8 1022.9,1068.3 905.1,1000.3 830.7,1043.3 948.4,1111.3 426.2,1412.8 
            990.9,1738.7 1551.2,1415.2 1606.6,1447.2 1869.9,1295.2 1814.5,1263.2 	"
        />
        <polygon
          style={getLinesStyles(4)}
          points="1024.6,1199.3 1248.9,1328.8 1248.9,1372.8 1024.6,1502.2 950.2,1502.3 725,1372.3 725,1328.8 
            952.3,1197.5 	"
        />
        <line
          style={getLinesStyles(4)}
          x1="583.8"
          y1="1375.8"
          x2="943.2"
          y2="1583.2"
        />
        <line
          style={getLinesStyles(4)}
          x1="978.7"
          y1="1603.7"
          x2="1025.5"
          y2="1630.7"
        />
        <line
          style={getLinesStyles(4)}
          x1="1063.6"
          y1="1652.7"
          x2="1100.4"
          y2="1674"
        />
        <line
          style={getLinesStyles(4)}
          x1="550.1"
          y1="1356.3"
          x2="537.4"
          y2="1348.9"
        />
        <line
          style={getLinesStyles(4)}
          x1="594.1"
          y1="1381.7"
          x2="556"
          y2="1403.7"
        />
        <line
          style={getLinesStyles(4)}
          x1="520.6"
          y1="1424.3"
          x2="483.4"
          y2="1445.8"
        />
        <line
          style={getLinesStyles(4)}
          x1="933.7"
          y1="1577.8"
          x2="895.6"
          y2="1599.8"
        />
        <line
          style={getLinesStyles(4)}
          x1="860.1"
          y1="1620.2"
          x2="822.9"
          y2="1641.8"
        />
        <path style={getLinesStyles(4)} d="M988.7,1609.5" />
        <line
          style={getLinesStyles(4)}
          x1="999.5"
          y1="1602.7"
          x2="950.2"
          y2="1631.2"
        />
        <line
          style={getLinesStyles(4)}
          x1="914.7"
          y1="1651.7"
          x2="877.4"
          y2="1673.2"
        />
        <line
          style={getLinesStyles(4)}
          x1="1145.5"
          y1="1519.5"
          x2="1438.6"
          y2="1350.2"
        />
        <line
          style={getLinesStyles(4)}
          x1="1035"
          y1="1583.2"
          x2="1112.1"
          y2="1538.7"
        />
        <line
          style={getLinesStyles(4)}
          x1="1212"
          y1="1609.4"
          x2="1055"
          y2="1518.7"
        />
        <line
          style={getLinesStyles(4)}
          x1="1156.2"
          y1="1641.7"
          x2="1044.1"
          y2="1577"
        />
        <line
          style={getLinesStyles(4)}
          x1="948.4"
          y1="1111.3"
          x2="1005.6"
          y2="1144.3"
        />
        <line
          style={getLinesStyles(4)}
          x1="872.6"
          y1="1155.5"
          x2="893"
          y2="1167.3"
        />
        <line
          style={getLinesStyles(4)}
          x1="929.4"
          y1="1188.3"
          x2="949.3"
          y2="1199.8"
        />
        <line
          style={getLinesStyles(4)}
          x1="817.7"
          y1="1252.8"
          x2="835.8"
          y2="1263.3"
        />
        <line
          style={getLinesStyles(4)}
          x1="780.4"
          y1="1232.3"
          x2="760"
          y2="1220.5"
        />
        <line
          style={getLinesStyles(4)}
          x1="725"
          y1="1372.3"
          x2="689.5"
          y2="1392.8"
        />
        <line
          style={getLinesStyles(4)}
          x1="1231.6"
          y1="1382.7"
          x2="1280.1"
          y2="1410.7"
        />
        <line
          style={getLinesStyles(4)}
          x1="1327.3"
          y1="1415.1"
          x2="1280.9"
          y2="1388.3"
        />
        <line
          style={getLinesStyles(4)}
          x1="1352.9"
          y1="1429.7"
          x2="1439.5"
          y2="1479.7"
        />
        <polyline
          style={getLinesStyles(4)}
          points="1157.8,1512.9 1223.1,1550.7 1335.5,1485.7 1295.7,1462.7 1314.8,1451.7 1287.9,1436.2 
            1354.6,1474.7 	"
        />
        <line
          style={getLinesStyles(4)}
          x1="1345.9"
          y1="1339.8"
          x2="1269.7"
          y2="1295.8"
        />
        <polyline
          style={getLinesStyles(4)}
          points="1400.5,1285.2 1363.3,1306.8 1383.2,1318.2 	"
        />
        <line
          style={getLinesStyles(4)}
          x1="1419.5"
          y1="1339.2"
          x2="1456.8"
          y2="1360.7"
        />
        <line
          style={getLinesStyles(4)}
          x1="1492.3"
          y1="1381.2"
          x2="1551.2"
          y2="1415.2"
        />
        <line
          style={getLinesStyles(4)}
          x1="1418.7"
          y1="1403.7"
          x2="1382.8"
          y2="1383"
        />
        <line
          style={getLinesStyles(4)}
          x1="1456.8"
          y1="1425.7"
          x2="1495.3"
          y2="1448"
        />
        <line
          style={getLinesStyles(4)}
          x1="1596.2"
          y1="1410.2"
          x2="1655.1"
          y2="1376.2"
        />
        <polyline
          style={getLinesStyles(4)}
          points="1691.5,1355.2 1484.5,1322.7 1652.5,1225.7 1710.5,1344.2 	"
        />
        <line
          style={getLinesStyles(4)}
          x1="1626.5"
          y1="1154.8"
          x2="1646.4"
          y2="1166.2"
        />
        <line
          style={getLinesStyles(4)}
          x1="1681.9"
          y1="1122.8"
          x2="1701.8"
          y2="1134.3"
        />
        <line
          style={getLinesStyles(4)}
          x1="1738.2"
          y1="1155.2"
          x2="1795.4"
          y2="1188.2"
        />
        <line
          style={getLinesStyles(4)}
          x1="1813.6"
          y1="1133.7"
          x2="1746"
          y2="1172.7"
        />
        <line
          style={getLinesStyles(4)}
          x1="1711.4"
          y1="1192.7"
          x2="1701.9"
          y2="1198.2"
        />
        <line
          style={getLinesStyles(4)}
          x1="1682.8"
          y1="1187.2"
          x2="1814.5"
          y2="1263.2"
        />
        <line
          style={getLinesStyles(4)}
          x1="1831.8"
          y1="1209.2"
          x2="1869.9"
          y2="1231.2"
        />
        <line
          style={getLinesStyles(4)}
          x1="2235.3"
          y1="890.2"
          x2="2215.4"
          y2="901.7"
        />
        <line
          style={getLinesStyles(4)}
          x1="2179.1"
          y1="922.7"
          x2="2198.1"
          y2="911.7"
        />
        <line
          style={getLinesStyles(4)}
          x1="2150.5"
          y1="939.2"
          x2="2187.7"
          y2="960.7"
        />
        <line
          style={getLinesStyles(4)}
          x1="2223.2"
          y1="981.2"
          x2="2263.1"
          y2="1004.2"
        />
        <line
          style={getLinesStyles(4)}
          x1="2207.2"
          y1="1036.5"
          x2="2167.4"
          y2="1013.5"
        />
        <line
          style={getLinesStyles(4)}
          x1="2095"
          y1="971.2"
          x2="2132.3"
          y2="992.7"
        />
      </g>
      <g id="shadow_copy_2">
        <polygon
          style={{ fill: '#E5E6E8' }}
          points="1895.9,434.2 2399.9,143.2 2206.8,31.8 2012.8,143.8 2066.5,174.7 1811.9,321.7 1662,235.3 
            1362.4,408.3 975.3,184.8 938.9,205.8 904.3,185.8 273.8,549.8 984.8,960.2 1427.8,704.5 1427.3,704.8 	"
        />
      </g>
      <g id="_x35__zones">
        <path
          style={getFillStyles('f5-luce-center')}
          d="M1383.2,497.8l-19.9,11.5l75.3,43.5L989.1,812.2l-452.1-261l469.4-271L1383.2,497.8z M1024.6,401.8l-72.7,0
            l-225.2,130l0,44l223.4,129l78.8,0l222.1-128.2l0-44.7L1024.6,401.8z"
        />
        <polygon
          style={getFillStyles('luce-visible-storage')}
          points="876.5,876.2 482.5,648.8 593.4,584.8 987.4,812.2 	"
        />
        <polygon
          style={getFillStyles('f5-arts-americas')}
          points="1155.4,845.2 1044.6,781.2 878.3,877.2 989.1,941.2 	"
        />
        <polygon
          style={getFillStyles('f5-european-art')}
          points="1439.5,553.2 1550.3,617.2 1157.1,844.2 1046.3,780.2 	"
        />
        <polygon
          style={getFillStyles('rotunda')}
          points="1626.5,357.3 1869.9,497.7 1606.6,649.7 1363.3,509.3 	"
        />
        <polygon
          style={getFillStyles('shapiro-wing')}
          points="2375.6,142.7 2262.2,77.2 1701.9,400.7 1815.3,466.2 	"
        />
      </g>
      <g id="_x35__drawing">
        <polyline
          style={getLinesStyles(5)}
          points="1382.7,498 1006.5,280.8 1022.9,271.3 905.1,203.3 830.7,246.3 948.4,314.3 426.2,615.8 
            990.9,941.7 1551.2,618.2 1606.6,650.2 1869.9,498.2 1814.5,466.2 2375.6,142.2 2263.1,77.2 2235.3,93.2 2178.2,60.2 2121.9,92.7 
            2179.1,125.7 2150.5,142.2 2093.3,109.2 2037,141.8 2094.2,174.7 1813.6,336.7 1738.2,293.3 1532.1,412.3 1457.7,369.3 
            1383.2,412.3 1457.7,455.3 1400.5,488.3 	"
        />
        <polygon
          style={getLinesStyles(5)}
          points="1024.6,402.3 1248.9,531.8 1248.9,575.8 1024.6,705.3 950.2,705.3 725,575.3 725,531.8 952.3,400.5 	
            "
        />
        <line
          style={getLinesStyles(5)}
          x1="537.5"
          y1="552"
          x2="943.2"
          y2="786.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="978.7"
          y1="806.7"
          x2="1025.5"
          y2="833.7"
        />
        <line
          style={getLinesStyles(5)}
          x1="1063.6"
          y1="855.7"
          x2="1100.4"
          y2="877"
        />
        <path style={getLinesStyles(5)} d="M537.4,551.9" />
        <line
          style={getLinesStyles(5)}
          x1="594.1"
          y1="584.7"
          x2="482.8"
          y2="648.9"
        />
        <line
          style={getLinesStyles(5)}
          x1="933.7"
          y1="780.8"
          x2="895.6"
          y2="802.8"
        />
        <line
          style={getLinesStyles(5)}
          x1="860.1"
          y1="823.2"
          x2="822.9"
          y2="844.8"
        />
        <path style={getLinesStyles(5)} d="M988.7,812.5" />
        <line
          style={getLinesStyles(5)}
          x1="999.5"
          y1="805.7"
          x2="950.2"
          y2="834.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="914.7"
          y1="854.7"
          x2="877.4"
          y2="876.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="1145.5"
          y1="722.5"
          x2="1438.6"
          y2="553.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="1035"
          y1="786.2"
          x2="1112.1"
          y2="741.7"
        />
        <line
          style={getLinesStyles(5)}
          x1="872.6"
          y1="358.5"
          x2="893"
          y2="370.3"
        />
        <line
          style={getLinesStyles(5)}
          x1="929.4"
          y1="391.3"
          x2="949.3"
          y2="402.8"
        />
        <line
          style={getLinesStyles(5)}
          x1="725"
          y1="575.3"
          x2="706.4"
          y2="586"
        />
        <line
          style={getLinesStyles(5)}
          x1="1248.5"
          y1="572.5"
          x2="1271.9"
          y2="586"
        />
        <line
          style={getLinesStyles(5)}
          x1="1327.3"
          y1="618.1"
          x2="1308.2"
          y2="607"
        />
        <polyline
          style={getLinesStyles(5)}
          points="1400.5,488.3 1363.3,509.8 1383.2,521.2 	"
        />
        <line
          style={getLinesStyles(5)}
          x1="1419.5"
          y1="542.2"
          x2="1475.4"
          y2="574.5"
        />
        <line
          style={getLinesStyles(5)}
          x1="1513.5"
          y1="596.5"
          x2="1551.2"
          y2="618.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="1418.7"
          y1="606.7"
          x2="1382.8"
          y2="586"
        />
        <line
          style={getLinesStyles(5)}
          x1="1456.8"
          y1="628.7"
          x2="1495.3"
          y2="651"
        />
        <line
          style={getLinesStyles(5)}
          x1="1626.5"
          y1="357.8"
          x2="1646.4"
          y2="369.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="1681.9"
          y1="325.8"
          x2="1701.8"
          y2="337.3"
        />
        <line
          style={getLinesStyles(5)}
          x1="1738.2"
          y1="358.2"
          x2="1795.4"
          y2="391.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="1813.6"
          y1="336.7"
          x2="1746"
          y2="375.7"
        />
        <line
          style={getLinesStyles(5)}
          x1="1711.4"
          y1="395.7"
          x2="1701.9"
          y2="401.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="1776.3"
          y1="444.2"
          x2="1814.5"
          y2="466.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="1682.8"
          y1="390.2"
          x2="1740"
          y2="423.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="1831.8"
          y1="412.2"
          x2="1869.9"
          y2="434.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="2235.3"
          y1="93.2"
          x2="2215.4"
          y2="104.7"
        />
        <line
          style={getLinesStyles(5)}
          x1="2179.1"
          y1="125.7"
          x2="2198.1"
          y2="114.7"
        />
        <line
          style={getLinesStyles(5)}
          x1="2150.5"
          y1="142.2"
          x2="2187.7"
          y2="163.7"
        />
        <line
          style={getLinesStyles(5)}
          x1="2223.2"
          y1="184.2"
          x2="2263.1"
          y2="207.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="2207.2"
          y1="239.5"
          x2="2167.4"
          y2="216.5"
        />
        <line
          style={getLinesStyles(5)}
          x1="2095"
          y1="174.2"
          x2="2132.3"
          y2="195.7"
        />
        <line
          style={getLinesStyles(5)}
          x1="950.2"
          y1="705.3"
          x2="932"
          y2="715.8"
        />
        <line
          style={getLinesStyles(5)}
          x1="894.7"
          y1="737.3"
          x2="877"
          y2="747.5"
        />
        <line
          style={getLinesStyles(5)}
          x1="1024.6"
          y1="705.3"
          x2="1044.6"
          y2="716.8"
        />
        <line
          style={getLinesStyles(5)}
          x1="1079.2"
          y1="736.7"
          x2="1099.1"
          y2="748.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="1044.6"
          y1="780.7"
          x2="1081.8"
          y2="802.2"
        />
        <line
          style={getLinesStyles(5)}
          x1="1117.3"
          y1="821.7"
          x2="1156.6"
          y2="844.4"
        />
        <line
          style={getLinesStyles(5)}
          x1="1249.8"
          y1="705.2"
          x2="1213"
          y2="684"
        />
        <line
          style={getLinesStyles(5)}
          x1="1287"
          y1="726.7"
          x2="1325.1"
          y2="748.7"
        />
        <line
          style={getLinesStyles(5)}
          x1="1605.7"
          y1="432.7"
          x2="1647.3"
          y2="432.7"
        />
        <line
          style={getLinesStyles(5)}
          x1="1493.2"
          y1="497.7"
          x2="1493.2"
          y2="522.7"
        />
        <line
          style={getLinesStyles(5)}
          x1="1583.2"
          y1="574.7"
          x2="1626.5"
          y2="574.7"
        />
        <line
          style={getLinesStyles(5)}
          x1="1739.1"
          y1="509.7"
          x2="1739.1"
          y2="485.7"
        />
      </g>
      <g id="elevator">
        <g>
          <path d="M173,3838.7h-46.2v-91.2H90.6v-31.5c24.4-0.4,42.2-8.9,47.3-36H173V3838.7z" />
        </g>
        <g>
          <path
            d="M81.3,3036.2c-0.9-18.2,6.2-31.5,18.6-44.4c26.2-27.3,67.3-38,67.3-63.9c0-10-9.5-15.8-18.9-15.8
                c-17.8,0-22.9,14.9-22.6,30H84.2c0.7-46,25.8-64.6,66.4-64.6c32.4,0,62.8,14.2,62.8,50.6c0,27.5-21.1,38.8-41.5,51.5
                c-11.3,7.1-23.3,13.1-31.5,18.9H213v37.7H81.3z"
          />
        </g>
        <g>
          <path
            d="M120.2,2179.3c-0.2,7.1,1.8,12.9,5.5,16.9s9.5,6.2,16.6,6.2c13.5,0,20.6-9.1,20.6-18.2c0-18-17.8-17.3-28.9-17.3v-27.3
                c10.9,0.9,27.5-1.3,27.5-16c0-10.2-9.1-14-18.2-14c-10.9,0-18.9,5.6-20.2,16.7H81.5c1.6-36,30.6-51.3,63.3-51.3
                c37.1,0,60.2,17.1,60.2,43.7c0,14.2-5.5,24.6-18.2,30.9c14.2,5.6,22.4,17.3,22.4,32.6c0,36.4-27.3,54.8-69.3,54.8
                c-36.4,0-63.9-18.9-63.3-57.7H120.2z"
          />
        </g>
        <g>
          <path d="M74.4,1361.5l73-86.8h43.1v89.5h19.5v34.4h-19.5v32.6h-44v-32.6H74.4V1361.5z M109.3,1364.2h37.3v-47.7L109.3,1364.2z" />
        </g>
        <g>
          <path
            d="M96.4,472.2h100.3v37.7h-67.9l-5.1,23.5c9.8-7.1,20.6-8.4,32.4-8.4c30,0,53.3,18.2,53.3,49.5c0,43.3-34.4,57.5-70.2,57.5
                c-34.2,0-56.4-15.3-65.3-44.2l46.4-4.7c0,0.4,0.4,1.1,0.4,1.6c2.7,8.2,11.5,12.7,20,12.7c13.5,0,22.4-9.1,22.4-20.6
                c0-12.9-6.2-22.6-20.2-22.6c-6.9,0-15.1,1.8-18.6,8.7l-43.5-1.6L96.4,472.2z"
          />
        </g>
        <g>
          <path d="M2075.3,3912.5h-47.7v-64.6h47.1v7.7h-38.3v19.8h35.4v7.7h-35.4v21.6h39V3912.5z" />
          <path
            d="M2124.1,3912.5h-7.9v-29c0-8.2-2.3-12.3-10.1-12.3c-4.5,0-12.4,2.9-12.4,15.7v25.6h-7.9v-47.1h7.5v6.7h0.2
                c1.7-2.5,6.1-8,14.2-8c7.3,0,16.5,3,16.5,16.4V3912.5z"
          />
          <path
            d="M2145.5,3872v30.6c0,3.7,3.1,3.7,4.8,3.7h2.8v6.2c-2.9,0.3-5.1,0.6-5.9,0.6c-7.8,0-9.5-4.4-9.5-10.1v-31h-6.4v-6.6h6.4
                v-13.1h7.9v13.1h7.6v6.6H2145.5z"
          />
          <path
            d="M2169.8,3912.5h-7.9v-47.1h7.5v7.8h0.2c3.2-5.5,7.3-9.2,13.2-9.2c1,0,1.4,0.1,2.1,0.3v8.2h-3c-7.4,0-12.1,5.8-12.1,12.6
                V3912.5z"
          />
          <path
            d="M2189.6,3879.8c0.4-11.2,7.8-15.7,19.4-15.7c3.8,0,17.5,1.1,17.5,13.1v27.1c0,2,1,2.8,2.6,2.8c0.7,0,1.7-0.2,2.6-0.4v5.8
                c-1.4,0.4-2.5,0.9-4.3,0.9c-7,0-8.1-3.6-8.4-7.2c-3.1,3.3-7.8,7.6-17,7.6c-8.6,0-14.8-5.5-14.8-13.6c0-4,1.2-13.1,14.3-14.8
                l13-1.6c1.9-0.2,4.1-0.9,4.1-5.6c0-5-3.6-7.7-11.1-7.7c-9,0-10.3,5.5-10.8,9.1H2189.6z M2218.6,3888.5c-1.3,1-3.2,1.7-13,3
                c-3.9,0.5-10.1,1.7-10.1,7.7c0,5.1,2.6,8.2,8.5,8.2c7.4,0,14.6-4.8,14.6-11.1V3888.5z"
          />
          <path
            d="M2278.3,3912.5h-7.9v-29c0-8.2-2.3-12.3-10.1-12.3c-4.5,0-12.4,2.9-12.4,15.7v25.6h-7.9v-47.1h7.5v6.7h0.2
                c1.7-2.5,6.1-8,14.2-8c7.3,0,16.5,3,16.5,16.4V3912.5z"
          />
          <path
            d="M2319.4,3881.3c-1-6.3-4.5-10.1-11.2-10.1c-9.8,0-13,9.4-13,17.7c0,8.1,2,18.1,12.9,18.1c5.3,0,9.9-4,11.2-11.2h7.7
                c-0.8,7.5-5.4,18-19.2,18c-13.2,0-21.1-10-21.1-23.6c0-14.6,7-26.2,22.6-26.2c12.3,0,17,9,17.6,17.2H2319.4z"
          />
          <path
            d="M2374.9,3897.8c-0.3,2.2-2.4,8.9-8.4,12.9c-2.2,1.4-5.2,3.2-12.8,3.2c-13.2,0-21.1-10-21.1-23.6c0-14.6,7-26.2,22.6-26.2
                c13.6,0,20.2,10.8,20.2,27.4h-34.4c0,9.8,4.6,15.5,13.7,15.5c7.5,0,11.9-5.8,12.1-9.3H2374.9z M2367.4,3885.3
                c-0.4-7.3-3.5-14-13.1-14c-7.3,0-13,6.8-13,14H2367.4z"
          />
        </g>
      </g>
    </svg>
  );
}
