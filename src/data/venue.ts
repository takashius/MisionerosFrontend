/** Sede CEV · Avenida Teherán, Urbanización Montalbán / Juan Pablo II, Caracas */
export const VENUE = {
  name: 'Conferencia Episcopal Venezolana',
  address: 'Avenida Teherán, Urbanización Montalbán, Caracas',
  lat: 10.467735,
  lng: -66.967318,
};

export const venueMapsUrl = () =>
  `https://www.google.com/maps/search/?api=1&query=${VENUE.lat},${VENUE.lng}`;

export const venueEmbedUrl = () =>
  `https://maps.google.com/maps?q=${VENUE.lat},${VENUE.lng}&hl=es&z=16&output=embed`;
