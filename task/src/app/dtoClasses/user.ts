export interface User {
  username: string;
  name: string;
  email: string;
  contactNumber: string;
  dob: string; // You can use a Date type depending on how you store it
  address: string;
  pinCode: string;
  accessRole: string;
  profileImage: string; // URL of the image
  status: string;
  createdOn: string; // The creation date of the user (use Date if needed)
}
