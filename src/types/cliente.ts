// La API también devuelve username, password y __v; esta app no los necesita.
export type Cliente = {
  id: number;
  email: string;
  phone: string;
  name: { firstname: string; lastname: string };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: { lat: string; long: string };
  };
};
