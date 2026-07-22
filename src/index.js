import server from './server/index.js';

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  const host = process.env.HOST;
  
  server.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
  })
}

export default server;