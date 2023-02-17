export function stripBasicHtml(html) {
  if (!html) return '';
  return html.replace(/(<([^>]+)>)/gi, '');
}

export function stripLineBreaks(str, replaceStr = ' ') {
  if (!str) return '';
  return str.replace(/(\r\n|\n|\r)/gm, replaceStr);
}

/**
 * Alma W. Thomas (American, 1891-1978). Wind, Sunshine and Flowers, 1968. Acrylic on canvas, 71 3/4 x 51 7/8 in. (182.2 x 131.8 cm). Brooklyn Museum, Gift of Mr. and Mrs. David K. Anderson, 76.120. © artist or artist's estate (Photo: Brooklyn Museum, 76.120_PS2.jpg)
 */
export function getCaption(item, filename = null) {
  if (!item) return '';
  let caption = '';
  caption += item?.primaryConstituent ? `${item.primaryConstituent}. ` : '';
  caption += item?.title ? `${stripLineBreaks(item.title)}, ` : '';
  caption += item?.date ? `${item.date}. ` : '';
  caption += item?.medium ? `${stripLineBreaks(item.medium)}, ` : '';
  caption += item?.dimensions ? `${stripLineBreaks(item.dimensions)}. ` : '';
  caption += item?.creditLine ? `Brooklyn Museum, ${item.creditLine}, ` : '';
  caption += item?.accessionNumber ? `${item.accessionNumber}. ` : '';
  caption += item?.copyright ? `${item.copyright} ` : '';
  caption += filename ? `(Photo: Brooklyn Museum, ${filename})` : '';
  return stripBasicHtml(caption?.trim());
}