#!/bin/bash

# 1. menyiapkan folder SSH
mkdir -p ~/.ssh

# 2. menarik key dari variable dan memasukkan ke file
echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# 3. Agar SSH tidak meminta konfirmasi yes/no
echo -e "Host *\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config

# 4. Menyalakan autossh di background
autossh -M 0 -N -L 5432:localhost:5432 $SSH_USER@$SSH_HOST &

# 5. Memberi jeda 3 detik agar tunnel sempat terbuka
sleep 3

# 6. Menyalakan aplikasi Node.js
npm run start