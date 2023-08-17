const mongoose = require('mongoose');
const URI = 'mongodb+srv://juliootoni:kPnJ33TQXnJfEr1J@clusterdev.jcaadui.mongodb.net/Barbearia?retryWrites=true&w=majority';

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB is Up!'))
  .catch(err => console.log(err));