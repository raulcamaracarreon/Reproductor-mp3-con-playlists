# Reproductor MP3 con Playlists

Esta aplicación web permite reproducir archivos MP3 y gestionar listas de reproducción directamente desde el navegador. Está construida con [React](https://reactjs.org/) y [Vite](https://vitejs.dev/).

## Funcionalidades
- Creación y eliminación de playlists.
- Añadir pistas desde un archivo local o mediante una URL.
- Reproducción con controles de avance, retroceso, pausa y parada.
- Soporte para modo oscuro, reproducción en bucle y orden aleatorio.
- Persistencia en `localStorage` de playlists y preferencias.

## Uso
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre `http://localhost:5173` en tu navegador.

## Construcción
Para generar la versión de producción ejecuta:
```bash
npm run build
```

## Licencia
MIT
