echo "pull code from main"
git pull

echo "build dist"
npm run build

sudo systemctl reload nginx