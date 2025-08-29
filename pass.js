const bcrypt = require('bcrypt');

(async () => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('admin', saltRounds);
  console.log(hashedPassword);
})();
