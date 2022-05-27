const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  console.log(process.env.MONGO_URI);

  res.send('oioioi');
});

module.exports = router;
