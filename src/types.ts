export interface RsvpFormData {
  fullName: string;
  department: string;
  phone: string;
  attending: 'yes' | 'no';
  dietary: 'standard' | 'vegetarian' | 'halal';
}
