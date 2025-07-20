import bcryptjs from "bcryptjs";

export const matchPassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};
