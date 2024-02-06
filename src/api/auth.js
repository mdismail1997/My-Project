import client from './client';

const Login = data => {
  return client.post('/login', data);
  // .then(response => {
  //   console.log('&&&&&&&&&&', response);

  //   return response.data;
  // });
};

const Register = data => {
  return client.post('/register', data);
};

const ForgetPassword = data => {
  return client.post('/forgot-password', data);
};

const ChangePassword = data => {
  return client.post('/change-password', data);
};

const Category = () => {
  return client.get('/categories');
};

const Products = () => {
  return client.get('/products');
};

const productSearch = data => {
  return client.get(`product-search?query=${data}`);
};

const productDetails = data => {
  return client.get(`product/${data}`);
};

const authService = {
  Login,
  Register,
  Category,
  Products,
  productSearch,
  productDetails,
  ChangePassword,
  ForgetPassword
};

export default authService;
