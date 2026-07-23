import server from './server/index.js';

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  const host = process.env.HOST;
  
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://${host}:${port}`);
  });
}

export default server;