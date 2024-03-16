import bcrypt from 'bcrypt';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, passwordUser) =>
{
    console.log(password, passwordUser);
return bcrypt.compareSync(password, passwordUser)};


