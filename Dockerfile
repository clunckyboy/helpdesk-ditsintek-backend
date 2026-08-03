# 1. Gunakan sistem operasi Linux dengan Node.js versi 22 (sesuai log Anda)
FROM node:22-bullseye

# 2. Instal autossh dan openssh-client secara paksa
RUN apt-get update && apt-get install -y autossh openssh-client

# 3. Pindah ke folder /app di dalam container
WORKDIR /app

# 4. Copy file package.json dan install npm
COPY package*.json ./
RUN npm install

# 5. Copy seluruh sisa file proyek Anda (termasuk start.sh)
COPY . .

# 6. Pastikan file start.sh memiliki izin untuk dieksekusi
RUN chmod +x start.sh

# 7. Jalankan start.sh saat aplikasi menyala
CMD ["bash", "start.sh"]